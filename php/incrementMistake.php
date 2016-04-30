<?php 
	require_once 'connectToDb.php'; //connect to DB

	if(isset($_GET['SpokenWord'])){
		// Retrieve field from parameters
		$SpokenWord = $_GET['SpokenWord'];
		$CorrectWord = $_GET['CorrectWord'];
		$query="UPDATE mistake SET SessionOccurences = SessionOccurences+1 WHERE SpokenWord='$SpokenWord' AND CorrectWord='$CorrectWord';";
		//echo $query;
		$result = $conn->query($query) or die($conn->error.__LINE__);
		 
		$result = $conn->affected_rows;
		 
		$json_response = json_encode($result);
	}
?>