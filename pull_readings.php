<?php

// This file fetches sensor data from the Things Network IoT server, puts it into database and sends it to the frontend.

require_once 'session_config.php';

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$userId = (int) $_SESSION['id'];

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'readings_from_sensors';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$appId = 'readings-from-sensors';
$region = 'eu1';
$env = parse_ini_file(__DIR__ . '/.env');
$apiKey = $env['API_KEY'];

$url = "https://{$region}.cloud.thethings.network/api/v3/as/applications/{$appId}/packages/storage/uplink_message?limit=1&order=-received_at";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer {$apiKey}",
        'Accept: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
curl_close($ch);

preg_match('/\{(?:[^{}]|(?R))*\}/', $response, $matches);
$data = json_decode($matches[0], true);

$message = $data['result'];
$sensorData = $message['uplink_message']['decoded_payload'];

try {
    $sql = 'INSERT INTO readings (user_id, humidity, temperature, received_at) VALUES (:user_id, :humidity, :temperature, NOW())';  // Include user_id column in the insert
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);  // Bind the authenticated user ID to the query
    $stmt->bindParam(':humidity', $sensorData['humidity']);
    $stmt->bindParam(':temperature', $sensorData['temperature']);

    $stmt->execute();

    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => [
            'temperature' => $sensorData['temperature'],
            'humidity' => $sensorData['humidity'],
            'inserted_at' => date('Y-m-d H:i:s')
        ]
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database insert failed']);
}

$conn = null;

/*
 * require_once 'session_config.php';
 *
 * $allowed_origins = [
 *     "http://localhost:3000"
 * ];
 *
 * $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
 *
 * if (in_array($origin, $allowed_origins)) {
 *     header("Access-Control-Allow-Origin: $origin");
 * } else {
 *     header("HTTP/1.1 403 Forbidden");
 *     exit;
 * }
 *
 * header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
 * header("Access-Control-Allow-Headers: Content-Type, Authorization");
 * header("Access-Control-Allow-Credentials: true");
 *
 * if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 *     exit;
 * }
 *
 * $userId = (int) $_SESSION['id'];
 *
 * $servername = "127.0.0.1";
 * $username = "root";
 * $passwordServer = "";
 * $dbname = "readings_from_sensors";
 *
 * try {
 *     $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
 *     $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 * } catch (PDOException $e) {
 *     header('Content-Type: application/json');
 *     echo json_encode(['success' => false, 'message' => 'Database connection failed']);
 *     exit;
 * }
 *
 * $appId = "readings-from-sensors";
 * $region = "eu1";
 * $env = parse_ini_file(__DIR__ . '/.env');
 * $apiKey = $env['API_KEY'];
 *
 * $url = "https://{$region}.cloud.thethings.network/api/v3/as/applications/{$appId}/packages/storage/uplink_message?limit=1&order=-received_at";
 *
 * $ch = curl_init();
 * curl_setopt_array($ch, [
 *     CURLOPT_URL => $url,
 *     CURLOPT_HTTPHEADER => [
 *         "Authorization: Bearer {$apiKey}",
 *         "Accept: application/json"
 *     ],
 *     CURLOPT_RETURNTRANSFER => true,
 *     CURLOPT_TIMEOUT => 10
 * ]);
 *
 * $response = curl_exec($ch);
 * curl_close($ch);
 *
 * preg_match('/\{(?:[^{}]|(?R))*\}/', $response, $matches);
 * $data = json_decode($matches[0], true);
 *
 * $message = $data['result'];
 * $sensorData = $message['uplink_message']['decoded_payload'];
 *
 * try {
 *     $sql = "INSERT INTO readings (user_id, humidity, temperature, received_at) VALUES (:user_id, :humidity, :temperature, NOW())"; // Include user_id column in the insert
 *     $stmt = $conn->prepare($sql);
 *     $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT); // Bind the authenticated user ID to the query
 *     $stmt->bindParam(':humidity', $sensorData['humidity']);
 *     $stmt->bindParam(':temperature', $sensorData['temperature']);
 *
 *     $stmt->execute();
 *
 *     header('Content-Type: application/json');
 *     echo json_encode([
 *         'success' => true,
 *         'data' => [
 *             'temperature' => $sensorData['temperature'],
 *             'humidity' => $sensorData['humidity'],
 *             'inserted_at' => date('Y-m-d H:i:s')
 *         ]
 *     ]);
 * } catch (PDOException $e) {
 *     header('Content-Type: application/json');
 *     echo json_encode(['success' => false, 'message' => 'Database insert failed']);
 * }
 *
 * $conn = null;
 */
