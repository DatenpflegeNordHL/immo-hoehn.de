from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from copy import deepcopy
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

TRACKING_KEYS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "mc_cid",
    "mc_eid",
}

CHANGE_FIELDS = (
    "title",
    "price_eur",
    "budget_eur",
    "living_area_m2",
    "lot_area_m2",
    "active_status",
    "provider_type",
    "no_outreach",
    "published_at",
    "source_url",
)


def load_json(path: str | Path, default: Any = None) -> Any:
    p = Path(path)
    if not p.exists():
        return deepcopy(default)
    with p.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: str | Path, data: Any) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(p.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write("\n")
    tmp.replace(p)


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = unicodedata.normalize("NFKC", str(value)).strip().lower()
    text = re.sub(r"\s+", " ", text)
    return text


def normalize_url(url: str | None) -> str:
    if not url:
        return ""
    try:
        parts = urlsplit(url.strip())
        query = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True) if k.lower() not in TRACKING_KEYS]
        clean_path = re.sub(r"/{2,}", "/", parts.path or "/")
        return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), clean_path.rstrip("/") or "/", urlencode(query), ""))
    except ValueError:
        return url.strip()


def _num_bucket(value: Any, step: int) -> str:
    if value in (None, ""):
        return ""
    try:
        number = float(value)
    except (TypeError, ValueError):
        return normalize_text(value)
    return str(int(round(number / step) * step))


def canonical_signature(signal: dict[str, Any]) -> str:
    source = normalize_text(signal.get("source"))
    source_id = normalize_text(signal.get("source_id"))
    if source and source_id:
        return f"src:{source}:{source_id}"

    stable = "|".join(
        [
            normalize_text(signal.get("signal_type")),
            normalize_text(signal.get("region")),
            normalize_text(signal.get("object_type")),
            normalize_text(signal.get("title")),
            _num_bucket(signal.get("living_area_m2"), 5),
            _num_bucket(signal.get("lot_area_m2"), 25),
        ]
    )
    if not stable.strip("|"):
        stable = normalize_url(signal.get("source_url"))
    digest = hashlib.sha256(stable.encode("utf-8")).hexdigest()[:24]
    return f"sig:{digest}"


def parse_iso_date(value: Any) -> date | None:
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    text = str(value).strip().replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(text).date()
    except ValueError:
        try:
            return date.fromisoformat(text[:10])
        except ValueError:
            return None


def freshness_points(published_at: Any, checked_at: Any = None) -> int:
    published = parse_iso_date(published_at)
    checked = parse_iso_date(checked_at) or datetime.now(timezone.utc).date()
    if not published:
        return 0
    age = max(0, (checked - published).days)
    if age <= 3:
        return 25
    if age <= 7:
        return 22
    if age <= 14:
        return 18
    if age <= 30:
        return 14
    if age <= 60:
        return 10
    if age <= 120:
        return 5
    return 0


def intent_points(signal: dict[str, Any]) -> int:
    stype = signal.get("signal_type")
    status = signal.get("active_status")
    if status in {"SOLD", "REMOVED", "EXPIRED", "DEAD_LINK", "DUPLICATE"}:
        return 0
    if stype in {"SELLER", "BUYER", "INVESTOR", "INVESTOR_SEARCH", "PUBLIC_SALE"}:
        return 30
    if stype in {"NEW_BUILD", "RELISTING"}:
        return 25
    if stype in {"PLANNING", "LEASEHOLD"}:
        return 15
    if stype == "MARKET_ONLY":
        return 10
    return 5


def region_points(signal: dict[str, Any], scope: dict[str, Any]) -> int:
    region = normalize_text(signal.get("region"))
    core = {normalize_text(x) for x in scope.get("core_regions", [])}
    adjacent = {normalize_text(x) for x in scope.get("adjacent_regions", [])}
    if region in core:
        return 25
    if region in adjacent:
        return 20
    if any(core_name and core_name in region for core_name in core):
        return 25
    if any(adj_name and adj_name in region for adj_name in adjacent):
        return 20
    return 5


def actionability_points(signal: dict[str, Any]) -> int:
    if signal.get("no_outreach"):
        return 0
    status = signal.get("active_status")
    if status in {"MARKET_ONLY", "NO_OUTREACH", "SOLD", "REMOVED", "EXPIRED", "DEAD_LINK", "DUPLICATE"}:
        return 0
    stype = signal.get("signal_type")
    provider = signal.get("provider_type")
    if stype == "SELLER" and provider == "private":
        return 20
    if stype == "BUYER" and provider in {"private", "business"}:
        return 20
    if stype in {"INVESTOR", "INVESTOR_SEARCH", "PUBLIC_SALE"}:
        return 15
    if stype in {"NEW_BUILD", "RELISTING"}:
        return 10
    return 5


def source_weight(signal: dict[str, Any], learning: dict[str, Any]) -> float:
    source = normalize_text(signal.get("source"))
    entry = learning.get("source_weights", {}).get(source, 1.0)
    try:
        return float(entry)
    except (TypeError, ValueError):
        return 1.0


def compute_score(signal: dict[str, Any], scope: dict[str, Any], learning: dict[str, Any]) -> int:
    raw = (
        freshness_points(signal.get("published_at"), signal.get("checked_at"))
        + intent_points(signal)
        + region_points(signal, scope)
        + actionability_points(signal)
    )

    if signal.get("is_relisting"):
        raw += 5
    if signal.get("price_drop_pct"):
        try:
            if float(signal["price_drop_pct"]) >= 3:
                raw += 5
        except (TypeError, ValueError):
            pass
    if signal.get("broker_welcome"):
        raw += 5
    if signal.get("matched_counterparty"):
        raw += 5

    status = signal.get("active_status")
    if status == "ACTIVE_UNCERTAIN":
        raw -= 20
    if signal.get("evidence_level") == "snippet_only":
        raw -= 30
    if status in {"SOLD", "REMOVED", "EXPIRED", "DEAD_LINK", "DUPLICATE"}:
        raw = 0

    weighted = raw * source_weight(signal, learning)
    return max(0, min(100, int(round(weighted))))


def priority_for(score: int, policy: dict[str, Any], signal: dict[str, Any]) -> str:
    if signal.get("no_outreach") or signal.get("active_status") in {"MARKET_ONLY", "NO_OUTREACH"}:
        return "MARKET_ONLY"
    limits = policy.get("learning_limits", {})
    a = int(limits.get("priority_threshold_A", 80))
    b = int(limits.get("priority_threshold_B", 60))
    minimum = int(limits.get("min_output_score", 55))
    if score >= a:
        return "A"
    if score >= b:
        return "B"
    if score >= minimum:
        return "C"
    return "ARCHIVE"


def validate_signal(signal: dict[str, Any], scope: dict[str, Any], policy: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in ("signal_type", "title", "region", "source", "source_url", "checked_at", "active_status"):
        if not signal.get(field):
            errors.append(f"missing:{field}")

    if signal.get("signal_type") not in set(scope.get("signal_types", [])):
        errors.append("invalid:signal_type")
    if signal.get("active_status") not in set(policy.get("active_statuses", [])):
        errors.append("invalid:active_status")
    if policy.get("hard_rules", {}).get("require_detail_page") and signal.get("evidence_level") == "snippet_only":
        errors.append("evidence:detail_page_required")
    if signal.get("provider_type") == "private" and signal.get("contact_method") in {"cold_phone", "cold_email"}:
        errors.append("policy:private_cold_outreach_blocked")
    return errors


def normalize_signal(signal: dict[str, Any], scope: dict[str, Any], policy: dict[str, Any], learning: dict[str, Any]) -> dict[str, Any]:
    item = deepcopy(signal)
    item["source_url"] = normalize_url(item.get("source_url"))
    item["signature"] = canonical_signature(item)
    item["validation_errors"] = validate_signal(item, scope, policy)
    item["score"] = compute_score(item, scope, learning)
    item["priority"] = priority_for(item["score"], policy, item)
    return item


def _changed_fields(old: dict[str, Any], new: dict[str, Any]) -> list[str]:
    changed = []
    for field in CHANGE_FIELDS:
        if old.get(field) != new.get(field):
            changed.append(field)
    return changed


def build_delta(
    baseline_signals: Iterable[dict[str, Any]],
    incoming_signals: Iterable[dict[str, Any]],
) -> dict[str, list[dict[str, Any]]]:
    old_by_sig = {s.get("signature") or canonical_signature(s): s for s in baseline_signals}
    new_by_sig = {s.get("signature") or canonical_signature(s): s for s in incoming_signals}

    new_items: list[dict[str, Any]] = []
    changed_items: list[dict[str, Any]] = []
    unchanged_items: list[dict[str, Any]] = []

    for sig, item in new_by_sig.items():
        old = old_by_sig.get(sig)
        if not old:
            new_items.append(item)
            continue
        fields = _changed_fields(old, item)
        if fields:
            enriched = deepcopy(item)
            enriched["changed_fields"] = fields
            changed_items.append(enriched)
        else:
            unchanged_items.append(item)

    missing_items = [old for sig, old in old_by_sig.items() if sig not in new_by_sig]
    return {
        "new": new_items,
        "changed": changed_items,
        "unchanged": unchanged_items,
        "not_seen_today": missing_items,
    }


def merge_baseline(
    baseline_signals: Iterable[dict[str, Any]],
    incoming_signals: Iterable[dict[str, Any]],
) -> list[dict[str, Any]]:
    merged = {s.get("signature") or canonical_signature(s): deepcopy(s) for s in baseline_signals}
    for item in incoming_signals:
        sig = item.get("signature") or canonical_signature(item)
        previous = merged.get(sig, {})
        combined = deepcopy(previous)
        combined.update(deepcopy(item))
        combined["signature"] = sig
        merged[sig] = combined
    return sorted(merged.values(), key=lambda x: (x.get("priority", "Z"), -(x.get("score") or 0), x.get("title", "")))


def apply_feedback(learning: dict[str, Any], feedback: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    result = deepcopy(learning)
    weights = result.setdefault("source_weights", {})
    stats = result.setdefault("feedback_stats", {})
    limits = policy.get("learning_limits", {})
    min_samples = int(limits.get("min_feedback_samples_before_change", 3))
    max_delta = float(limits.get("max_weight_change_per_cycle", 0.1))
    weight_min = float(limits.get("source_weight_min", 0.5))
    weight_max = float(limits.get("source_weight_max", 1.5))

    by_source: dict[str, list[int]] = {}
    value_map = {
        "very_good": 2,
        "good": 1,
        "neutral": 0,
        "bad": -1,
        "false_positive": -2,
    }
    for item in feedback:
        source = normalize_text(item.get("source"))
        rating = value_map.get(item.get("rating"), 0)
        if source:
            by_source.setdefault(source, []).append(rating)

    for source, values in by_source.items():
        source_stat = stats.setdefault(source, {"samples": 0, "sum": 0})
        source_stat["samples"] += len(values)
        source_stat["sum"] += sum(values)
        if source_stat["samples"] < min_samples:
            continue
        average = source_stat["sum"] / source_stat["samples"]
        if average > 0.35:
            delta = max_delta
        elif average < -0.35:
            delta = -max_delta
        else:
            delta = 0.0
        current = float(weights.get(source, 1.0))
        weights[source] = round(min(weight_max, max(weight_min, current + delta)), 2)

    result["updated_at"] = datetime.now(timezone.utc).isoformat()
    return result


def markdown_report(run_date: str, delta: dict[str, list[dict[str, Any]]]) -> str:
    lines = [f"# Immo Höhn Acquisition Scout – {run_date}", ""]
    lines.append(f"- Neu: **{len(delta['new'])}**")
    lines.append(f"- Geändert: **{len(delta['changed'])}**")
    lines.append(f"- Unverändert bestätigt: **{len(delta['unchanged'])}**")
    lines.append(f"- Heute nicht erneut gesehen: **{len(delta['not_seen_today'])}**")
    lines.append("")

    actionable = sorted(
        delta["new"] + delta["changed"],
        key=lambda x: (x.get("priority") == "A", x.get("score", 0)),
        reverse=True,
    )
    lines.append("## Neue / geänderte Chancen")
    lines.append("")
    if not actionable:
        lines.append("Keine neuen oder geänderten Signale.")
    else:
        for item in actionable:
            lines.append(
                f"- **{item.get('priority','?')} · {item.get('score',0)}/100 · {item.get('signal_type','?')} · {item.get('region','?')}** – "
                f"{item.get('title','(ohne Titel)')}  "
            )
            lines.append(f"  Quelle: {item.get('source_url','')}  ")
            if item.get("changed_fields"):
                lines.append(f"  Geändert: {', '.join(item['changed_fields'])}  ")
            if item.get("next_action"):
                lines.append(f"  Nächster Schritt: {item['next_action']}  ")
    lines.append("")
    lines.append("## Hinweis")
    lines.append("")
    lines.append("`not_seen_today` bedeutet **nicht automatisch entfernt**. Ein Signal wird erst nach expliziter Detailseitenprüfung auf `REMOVED`, `SOLD`, `EXPIRED` oder `DEAD_LINK` gesetzt.")
    lines.append("")
    return "\n".join(lines)
