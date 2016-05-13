<?php
require_once 'connectToDb.php'; //connect to DB

$result = $conn->query("SELECT Value, HashValue FROM SpokenWord");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"Value":"'  . $rs["Value"] . '",';
    $outp .= '"HashValue":"'  . $rs["HashValue"] . '"}';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>