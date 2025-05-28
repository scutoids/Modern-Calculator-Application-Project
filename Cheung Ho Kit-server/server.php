<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$pythonApiUrl = 'http://localhost:5001';

$uploadDir = 'Uploads/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("無法創建上傳目錄: $uploadDir");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '無法創建上傳目錄']);
        exit;
    }
}

// 記錄請求詳情
error_log("收到請求: 方法=" . $_SERVER['REQUEST_METHOD'] . ", URL=" . $_SERVER['REQUEST_URI']);

// 明確處理 action=ask_ai
$action = $_GET['action'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'ask_ai') {
    $rawInput = file_get_contents('php://input');
    error_log("收到 ask_ai 請求，原始輸入: " . $rawInput);

    $input = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON 解析錯誤: " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => '無效的 JSON 輸入: ' . json_last_error_msg()]);
        exit;
    }

    $message = $input['message'] ?? '';
    if (empty($message)) {
        error_log("缺少 message 字段，輸入: " . json_encode($input));
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => '缺少訊息或訊息為空']);
        exit;
    }

    error_log("處理數學問題: $message");

    // 檢查是否為數學問題
    $mathKeywords = ['+', '-', '*', '/', '=', '計算', '速度', '距離', '時間', '平均', '概率', '統計', '方程', '幾何', '代數'];
    $isMathQuestion = false;
    foreach ($mathKeywords as $keyword) {
        if (stripos($message, $keyword) !== false) {
            $isMathQuestion = true;
            break;
        }
    }

    if (!$isMathQuestion) {
        error_log("非數學問題: $message");
        echo json_encode([
            'status' => 'success',
            'choices' => [[
                'message' => ['content' => '抱歉，我只能回答數學、統計或數據分析相關的問題。請試試一個數學問題！']
            ]]
        ]);
        exit;
    }

    // 改進提示，要求簡潔純文字
    $prompt = "你是一個專注於數學和數據分析的 AI 助手。請用簡潔的純文字回答以下數學、統計或數據分析問題，避免使用 LaTeX、Markdown 或冗長解釋。問題：$message";
    $apiResponse = callMistralAI($prompt);
    echo json_encode($apiResponse);
    exit;
}

// 處理文件上傳
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['data_csv'])) {
    error_log("收到文件上傳請求: " . json_encode($_FILES['data_csv']));
    
    if ($_FILES['data_csv']['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => '上傳文件超過 php.ini 的 upload_max_filesize 限制',
            UPLOAD_ERR_FORM_SIZE => '上傳文件超過表單限制',
            UPLOAD_ERR_PARTIAL => '文件只部分上傳',
            UPLOAD_ERR_NO_FILE => '未上傳任何文件',
            UPLOAD_ERR_NO_TMP_DIR => '缺少臨時文件夾',
            UPLOAD_ERR_CANT_WRITE => '無法寫入磁盤',
            UPLOAD_ERR_EXTENSION => 'PHP 擴展阻止了上傳'
        ];
        $errorMsg = $uploadErrors[$_FILES['data_csv']['error']] ?? '未知上傳錯誤';
        error_log("文件上傳錯誤: $errorMsg");
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "文件上傳失敗: $errorMsg"]);
        exit;
    }

    $csv = $_FILES['data_csv'];
    if (!str_ends_with(strtolower($csv['name']), '.csv')) {
        error_log("無效文件類型: " . $csv['name']);
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => '請上傳 CSV 檔案']);
        exit;
    }

    $csvPath = $uploadDir . time() . '_' . basename($csv['name']);
    if (!move_uploaded_file($csv['tmp_name'], $csvPath)) {
        error_log("無法移動上傳文件: " . $csv['tmp_name'] . " 到 " . $csvPath);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '數據 CSV 上傳失敗']);
        exit;
    }

    $absoluteCsvPath = realpath($csvPath);
    if ($absoluteCsvPath === false) {
        error_log("無法解析絕對路徑: $csvPath");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '無法解析文件路徑']);
        exit;
    }
    error_log("傳遞給 Flask 的文件路徑: $absoluteCsvPath");

    $response = ['status' => 'success', 'uploaded_files' => ['data_csv' => $absoluteCsvPath], 'choices' => []];

    $ch = curl_init($pythonApiUrl . '/summarize');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['filename' => $absoluteCsvPath]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => true,
    ]);

    $pythonResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $curlErrno = curl_errno($ch);
    curl_close($ch);

    if ($curlError) {
        error_log("cURL Error: $curlError (Error Code: $curlErrno)");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '無法連接到 Python 服務']);
        exit;
    }

    if ($httpCode !== 200) {
        error_log("Flask API Error: HTTP $httpCode - $pythonResponse");
        http_response_code($httpCode);
        echo json_encode(['status' => 'error', 'message' => '無法獲取數據摘要，HTTP 狀態碼: ' . $httpCode]);
        exit;
    }

    $pythonData = json_decode($pythonResponse, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON Decode Error: " . json_last_error_msg());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '無法解析 Python 服務回應']);
        exit;
    }

    $response['summary'] = $pythonData['summary'] ?? '無摘要';
    $response['columns'] = $pythonData['columns'] ?? [];
    $response['choices'][] = [
        'message' => ['content' => '數據 CSV 上傳成功！摘要：' . $response['summary']]
    ];

    if (file_exists($absoluteCsvPath)) {
        unlink($absoluteCsvPath);
        error_log("已刪除上傳文件: $absoluteCsvPath");
    }

    echo json_encode($response);
    exit;
}

// 其他 POST 請求
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("收到未知 POST 請求，無 action 或 data_csv: " . json_encode($_FILES));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => '無效的 POST 請求，缺少 action 或上傳文件']);
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => '無效的請求']);

function callMistralAI($message) {
    // 設定 Mistral AI API 的 API Key 和 URL
    $apiKey = '';
    $apiUrl = 'https://api.mistral.ai/v1/chat/completions';

    $data = [
        'model' => 'mistral-large-latest',
        'messages' => [['role' => 'user', 'content' => $message]]
    ];

    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $curlErrno = curl_errno($ch);

    if ($curlError) {
        error_log("cURL Error: $curlError (Error Code: $curlErrno)");
        curl_close($ch);
        return [
            'status' => 'error',
            'message' => 'cURL 請求失敗',
            'error' => $curlError,
            'errno' => $curlErrno
        ];
    }

    curl_close($ch);

    error_log("Mistral AI API Response: HTTP $httpCode - " . substr($response, 0, 500));

    if ($httpCode !== 200) {
        error_log("API Error: HTTP $httpCode - $response");
        return [
            'status' => 'error',
            'message' => 'API 錯誤',
            'code' => $httpCode,
            'response' => $response
        ];
    }

    $responseData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON Decode Error: " . json_last_error_msg());
        return ['status' => 'error', 'message' => '無法解析 API 回應'];
    }

    $aiContent = $responseData['choices'][0]['message']['content'] ?? '';
    if (empty($aiContent)) {
        error_log("Empty AI Content: " . json_encode($responseData));
        return ['status' => 'error', 'message' => 'API 回應無有效內容'];
    }

    return [
        'status' => 'success',
        'choices' => [[
            'message' => ['content' => $aiContent]
        ]]
    ];
}
?>