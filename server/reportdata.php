<?php
// 設置響應頭
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // 解決跨域問題（僅限開發環境）
header("Access-Control-Allow-Headers: Content-Type");

// 資料庫連接配置
$servername = "localhost";
$username = "root"; // 預設為 root，根據實際情況修改
$password = "";    // WampServer 預設無密碼，根據實際情況修改
$dbname = "report_db"; // 使用剛創建的資料庫

// 創建資料庫連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    echo json_encode(array("status" => "error", "message" => "資料庫連接失敗: " . $conn->connect_error));
    exit();
}

// 獲取 POST 請求的 JSON 數據
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 檢查數據是否有效
if (isset($data['problemTitle']) && isset($data['problem']) && isset($data['problemType'])) {
    $problemTitle = $data['problemTitle'];
    $problem = $data['problem'];
    $problemType = $data['problemType'];

    // 準備 SQL 語句
    $sql = "INSERT INTO reports (problem_title, problem, problem_type) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $problemTitle, $problem, $problemType);

    if ($stmt->execute()) {
        echo json_encode(array("status" => "success", "message" => "報告已保存"));
    } else {
        echo json_encode(array("status" => "error", "message" => "保存失敗: " . $stmt->error));
    }

    $stmt->close();
} else {
    echo json_encode(array("status" => "error", "message" => "無效的數據"));
}

$conn->close();
?>