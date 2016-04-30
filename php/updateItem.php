<?php 
	require_once 'connectToDb.php'; //connect to DB

	if(isset($_GET['Id'])){
		// Retrieve field from parameter and convert true/false to TINYINT 1/0 - this is what mySQL needs
		$Id = $_GET['Id'];
		$SpokenWord = $_GET['SpokenWord'];
		$SpokenWord = $_GET['SpokenWord'];
		$SpokenWord = $_GET['SpokenWord'];
		$CorrectWord = $_GET['SpokenWord'];
		$query="INSERT INTO mistake (SpokenWord, CorrectWord) VALUES ('$SpokenWord', '$CorrectWord')";
		echo $query;
		$result = $conn->query($query) or die($conn->error.__LINE__);
		 
		$result = $conn->affected_rows;
		 
		$json_response = json_encode($result);
	}
?>