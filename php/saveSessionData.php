<?php 
	require_once 'connectToDb.php'; //connect to DB

	$query="UPDATE mistake SET TotalOccurrences = TotalOccurrences + SessionOccurences;";
	$result = $conn->query($query) or die($conn->error.__LINE__);
	 
	$result = $conn->affected_rows;
	 
	$json_response = json_encode($result);

	$query="UPDATE mistake SET SessionOccurences=0;";
	$result = $conn->query($query) or die($conn->error.__LINE__);
	 
	$result = $conn->affected_rows;
	 
	$json_response = json_encode($result);
?>