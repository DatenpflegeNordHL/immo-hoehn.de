<?php
declare(strict_types=1);

header('X-Robots-Tag: noindex, nofollow', true);
header('Referrer-Policy: strict-origin-when-cross-origin', true);

const CONTACT_RECIPIENT = 'info@immo-hoehn.de';
const CONTACT_FROM = 'info@immo-hoehn.de';
const CONTACT_RETURN_PATH = '/kontakt/';

function redirect_contact(string $status): never
{
    header('Location: ' . CONTACT_RETURN_PATH . '?kontakt=' . rawurlencode($status) . '#kontaktformular', true, 303);
    exit;
}

function post_string(string $key, int $maxLength): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);
    if (mb_strlen($value, 'UTF-8') > $maxLength) {
        return '';
    }

    return $value;
}

function one_line(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Method Not Allowed';
    exit;
}

// Honeypot. Bots should receive no useful signal about whether delivery happened.
$website = post_string('website', 200);
if ($website !== '') {
    redirect_contact('erfolg');
}

$name = one_line(post_string('name', 120));
$email = one_line(post_string('email', 254));
$telefon = one_line(post_string('telefon', 60));
$anliegen = post_string('anliegen', 80);
$objektart = post_string('objektart', 60);
$ort = one_line(post_string('ort', 120));
$nachricht = post_string('nachricht', 5000);
$datenschutz = $_POST['datenschutz'] ?? '';

$allowedAnliegen = [
    'immobilie-verkaufen' => 'Immobilie verkaufen',
    'wertermittlung' => 'Wertermittlung',
    'objektanfrage' => 'Objektanfrage',
    'allgemeine-anfrage' => 'Allgemeine Anfrage',
];

$allowedObjektarten = [
    '' => 'Nicht angegeben',
    'haus' => 'Haus',
    'wohnung' => 'Wohnung',
    'grundstueck' => 'Grundstück',
    'gewerbe' => 'Gewerbe',
];

if (
    mb_strlen($name, 'UTF-8') < 2 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !array_key_exists($anliegen, $allowedAnliegen) ||
    !array_key_exists($objektart, $allowedObjektarten) ||
    mb_strlen($nachricht, 'UTF-8') < 10 ||
    $datenschutz !== '1'
) {
    redirect_contact('ungueltig');
}

// Header injection defense beyond FILTER_VALIDATE_EMAIL.
if (preg_match('/[\r\n]/', $email) === 1) {
    redirect_contact('ungueltig');
}

$subjectText = 'Website-Anfrage: ' . $allowedAnliegen[$anliegen];
$subject = mb_encode_mimeheader($subjectText, 'UTF-8', 'B', "\r\n");

$body = [
    'Neue Anfrage über immo-hoehn.de',
    '',
    'Name: ' . $name,
    'E-Mail: ' . $email,
    'Telefon: ' . ($telefon !== '' ? $telefon : 'Nicht angegeben'),
    'Anliegen: ' . $allowedAnliegen[$anliegen],
    'Objektart: ' . $allowedObjektarten[$objektart],
    'Ort / PLZ: ' . ($ort !== '' ? $ort : 'Nicht angegeben'),
    '',
    'Nachricht:',
    $nachricht,
    '',
    'Datenschutzhinweis im Formular bestätigt: ja',
];

$headers = [
    'From: Höhn Immobilien Website <' . CONTACT_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = mail(
    CONTACT_RECIPIENT,
    $subject,
    implode("\r\n", $body),
    implode("\r\n", $headers)
);

if (!$sent) {
    redirect_contact('versandfehler');
}

redirect_contact('erfolg');
