<?php 
	require_once 'connectToDb.php'; //connect to DB

	if(isset($_GET['SpokenWord'])){
		// Retrieve field from parameters
		$SpokenWord = $_GET['SpokenWord'];
		$CorrectWord = $_GET['CorrectWord'];
		$CurrentDate = $_GET['CurrentDate'];
		$query="INSERT INTO mistake (SpokenWord, CorrectWord, AddedDate) VALUES ('$SpokenWord', '$CorrectWord', '$CurrentDate')";
		$result = $conn->query($query) or die($conn->error.__LINE__);
		 
		$result = $conn->affected_rows;
		 
		$json_response = json_encode($result);
	}
?>