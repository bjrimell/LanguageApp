var app = angular.module("languageApp", []);

app.controller('mistakeController', function($scope, $http) {

	$scope.sessionRunning = false;
	getMistakes();

	function getMistakes(){
	//RETRIEVE MISTAKES FROM DB
		    $http.get("php/selectMistakesByUser.php")
	    .then(function (response) {$scope.mistakes = response.data.records;});
	}

	$scope.getDatetime = function() {
  		return (new Date).toLocaleFormat("%A, %B %e, %Y");
	};

	//ADD NEW MISTAKE TO DB
	$scope.addItem = function(SpokenWord, CorrectWord) {
		$scope.mistakes.push({SpokenWord:$scope.spokenWord, CorrectWord:$scope.correctWord});
		//update DB
	  $http.post("php/insertNewMistake.php?SpokenWord="+SpokenWord+"&CorrectWord="+CorrectWord+"&CurrentDate="+$scope.getDatetime).success(function(data){
	  });
	  getMistakes();
	}

	// INCREMENT MISTAKE BY 1
	$scope.incrementMistake = function(mistake) {
		UPDATE SCOPE HERE
		//update DB
	  $http.post("php/incrementMistake.php?SpokenWord="+mistake.SpokenWord+"&CorrectWord="+mistake.CorrectWord).success(function(data){
	  });
	  getMistakes();
	}

	// START SESSION
	$scope.startSession = function() {
		//document.getElementById("startSession").disabled = false; 
		$scope.sessionRunning = true;
	}

	// END SESSION
	$scope.endSession = function() {
		$scope.sessionRunning = false;
			  $http.post("php/saveSessionData.php").success(function(data){
	  });
	}
});
