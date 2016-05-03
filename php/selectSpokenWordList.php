<?php
require_once 'connectToDb.php'; //connect to DB

$result = $conn->query("SELECT Value FROM SpokenWord");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"Value":"'  . $rs["Value"] . '"}';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>