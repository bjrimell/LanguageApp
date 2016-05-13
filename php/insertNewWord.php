<?php 
	require_once 'connectToDb.php'; //connect to DB

	if(isset($_GET['Value'])){
		// Retrieve field from parameters
		$Value = $_GET['Value'];
		$HashValue = $_GET['HashValue'];
		$TableName = $_GET['WordType'];
		$query="INSERT INTO $TableName (Value, HashValue) VALUES ('$Value', '$HashValue')";
		echo $query;
		$result = $conn->query($query) or die($conn->error.__LINE__);
		 
		$result = $conn->affected_rows;
		 
		$json_response = json_encode($result);
	}
?>