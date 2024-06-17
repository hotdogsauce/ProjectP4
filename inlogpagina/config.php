<?php
// config.php
$servername = "localhost";
$username = "root"; // pas aan indien nodig
$password = ""; // pas aan indien nodig
$dbname = "loginP4";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
