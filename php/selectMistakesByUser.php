<?php
require_once 'connectToDb.php'; //connect to DB

$result = $conn->query("SELECT SpokenWord, CorrectWord, SessionOccurences, AddedDate FROM Mistake Where SessionOccurences>0");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"SpokenWord":"'  . $rs["SpokenWord"] . '",';
    $outp .= '"SessionOccurences":"'  . $rs["SessionOccurences"] . '",';
    $outp .= '"CorrectWord":"'  . $rs["CorrectWord"] . '",';
    $outp .= '"AddedDate":"'  . $rs["AddedDate"] . '"}';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>