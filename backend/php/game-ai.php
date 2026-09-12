<?php
// Secure OpenAI backend for AI Game Finder.
// Put OPENAI_API_KEY in the server environment. Never place it in frontend JavaScript.
header('Content-Type: application/json; charset=utf-8');
$allowedOrigins = [
    'https://1v1-lol-unbloked.github.io'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'POST only']); exit; }
if ($origin && !in_array($origin, $allowedOrigins, true)) { http_response_code(403); echo json_encode(['error'=>'Origin not allowed']); exit; }

$apiKey = getenv('OPENAI_API_KEY');
if (!$apiKey) { http_response_code(500); echo json_encode(['error'=>'OPENAI_API_KEY is not configured']); exit; }

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 70000) { http_response_code(413); echo json_encode(['error'=>'Request too large']); exit; }
$body = json_decode($raw, true);
$prompt = trim((string)($body['prompt'] ?? ''));
$candidates = $body['candidates'] ?? [];
if ($prompt === '' || !is_array($candidates)) { http_response_code(400); echo json_encode(['error'=>'Invalid request']); exit; }
$candidates = array_slice($candidates, 0, 30);

$catalog = [];
foreach ($candidates as $g) {
    $catalog[] = [
        'id' => $g['id'] ?? null,
        'name' => substr((string)($g['name'] ?? ''), 0, 100),
        'category' => substr((string)($g['category'] ?? ''), 0, 50),
        'genre' => substr((string)($g['genre'] ?? ''), 0, 100),
        'popularity' => substr((string)($g['popularity'] ?? ''), 0, 30),
        'about' => substr((string)($g['about'] ?? ''), 0, 420),
    ];
}

$inputText = "User request: " . $prompt . "\n\nCandidate games:\n" . json_encode($catalog, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
$payload = [
    'model' => 'gpt-5.6-luna',
    'instructions' => 'You are a game recommendation engine for an unblocked browser games catalog. Choose up to 6 games ONLY from the supplied candidates. Never invent IDs or games. Prefer intent fit over raw popularity. Return ONLY valid JSON in this exact shape: {"picks":[{"id":123,"reason":"Short reason under 12 words"}]}. No markdown.',
    'input' => $inputText,
    'max_output_tokens' => 700
];

$ch = curl_init('https://api.openai.com/v1/responses');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 25
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);
if ($response === false || $status < 200 || $status >= 300) {
    http_response_code(502);
    echo json_encode(['error'=>'OpenAI request failed','detail'=>$error ?: ('HTTP '.$status)]);
    exit;
}
$data = json_decode($response, true);
$text = '';
foreach (($data['output'] ?? []) as $item) {
    foreach (($item['content'] ?? []) as $content) {
        if (($content['type'] ?? '') === 'output_text') { $text .= (string)($content['text'] ?? ''); }
    }
}
$text = trim($text);
$text = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $text);
$out = json_decode($text, true);
if (!is_array($out) || !isset($out['picks']) || !is_array($out['picks'])) {
    http_response_code(502); echo json_encode(['error'=>'Invalid AI response']); exit;
}
$validIds = array_map('strval', array_column($catalog, 'id'));
$picks = [];
foreach (array_slice($out['picks'], 0, 6) as $pick) {
    $id = (string)($pick['id'] ?? '');
    if ($id !== '' && in_array($id, $validIds, true)) {
        $picks[] = ['id'=>$pick['id'], 'reason'=>substr((string)($pick['reason'] ?? ''),0,120)];
    }
}
echo json_encode(['picks'=>$picks], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
