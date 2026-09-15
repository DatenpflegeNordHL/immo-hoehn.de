from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path

from .core import (
    apply_feedback,
    build_delta,
    load_json,
    markdown_report,
    merge_baseline,
    normalize_signal,
    save_json,
)

ROOT = Path(__file__).resolve().parents[2]


def _load_inbox(path: Path) -> list[dict]:
    if not path.exists():
        raise SystemExit(f"Inbox fehlt: {path}")
    data = load_json(path, default=[])
    if isinstance(data, dict) and "signals" in data:
        data = data["signals"]
    if not isinstance(data, list):
        raise SystemExit("Inbox muss eine JSON-Liste oder {\"signals\": [...]} sein")
    return data


def run_daily(args: argparse.Namespace) -> int:
    scope = load_json(ROOT / "config" / "scope.json", {})
    policy = load_json(ROOT / "config" / "policy.json", {})
    learning_path = ROOT / "state" / "learning.json"
    baseline_path = ROOT / "state" / "baseline.json"
    learning = load_json(learning_path, {"source_weights": {}, "feedback_stats": {}})
    baseline = load_json(baseline_path, {"version": 1, "signals": []})

    incoming_raw = _load_inbox(Path(args.inbox))
    incoming = [normalize_signal(item, scope, policy, learning) for item in incoming_raw]

    invalid = [item for item in incoming if item.get("validation_errors")]
    valid = [item for item in incoming if not item.get("validation_errors")]

    delta = build_delta(baseline.get("signals", []), valid)
    merged = merge_baseline(baseline.get("signals", []), valid)

    run_date = args.run_date or date.today().isoformat()
    baseline_out = {
        "version": 1,
        "updated_at": run_date,
        "signals": merged,
    }
    save_json(baseline_path, baseline_out)

    report_dir = ROOT / "reports" / "daily"
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / f"{run_date}.md").write_text(markdown_report(run_date, delta), encoding="utf-8")

    if invalid:
        invalid_dir = ROOT / "reports" / "invalid"
        invalid_dir.mkdir(parents=True, exist_ok=True)
        save_json(invalid_dir / f"{run_date}.json", invalid)

    feedback_path = ROOT / "feedback" / f"{run_date}.json"
    if feedback_path.exists():
        feedback = load_json(feedback_path, [])
        if isinstance(feedback, list):
            learning = apply_feedback(learning, feedback, policy)
            save_json(learning_path, learning)

    machine_summary = {
        "run_date": run_date,
        "input": len(incoming_raw),
        "valid": len(valid),
        "invalid": len(invalid),
        "new": len(delta["new"]),
        "changed": len(delta["changed"]),
        "unchanged": len(delta["unchanged"]),
        "not_seen_today": len(delta["not_seen_today"]),
    }
    print(json.dumps(machine_summary, ensure_ascii=False))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Immo Höhn Acquisition Scout")
    sub = parser.add_subparsers(dest="command", required=True)

    daily = sub.add_parser("daily", help="Tages-Inbox verarbeiten")
    daily.add_argument("--inbox", required=True, help="Pfad zur Tages-JSON-Datei")
    daily.add_argument("--run-date", help="YYYY-MM-DD; Standard: heute")
    daily.set_defaults(func=run_daily)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
