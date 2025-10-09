<?php
// 1. CONFIGURATION
$appId = "readings-from-sensors";
$apiKey = "NNSXS.Y3TSJQIA7YJVM4NJPDLKSSJ35FJ2JAI474VLQWY.FT2E7BDFLY5WZ4WWYEVX72LKJI35V53G27X5HXYOBQUNSWNLXREQ";
$region = "eu1";

// 2. BUILD URL WITH SORTING - Get most recent message first
$url = "https://{$region}.cloud.thethings.network/api/v3/as/applications/{$appId}/packages/storage/uplink_message?limit=1&order=-received_at";

// 3. API REQUEST
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer {$apiKey}",
        "Accept: application/json"
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
curl_close($ch);

// 4. EXTRACT DATA
preg_match('/\{(?:[^{}]|(?R))*\}/', $response, $matches);
$data = json_decode($matches[0], true);

$message = $data['result'];
$sensorData = $message['uplink_message']['decoded_payload'];

echo "Temperature: " . $sensorData['temperature'] . "°C\n";
echo "Humidity: " . $sensorData['humidity'] . "%\n";
echo "Time: " . $message['received_at'] . "\n";