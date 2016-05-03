var app = angular.module("languageApp", []);

	app.directive("addbuttonwrongword", function($compile){
		return function(scope, element, attrs){
			element.bind("click", function(){
				scope.count++;
				angular.element(document.getElementById('dropzoneWrongWord')).append($compile("<div><button class='w3-btn w3-padding w3-blue' draggable='true' ondragstart='return dragInitialize(event)' id={{spokenWord.Value}}>"+scope.spokenWordTextInput+"</button></div>")(scope));
			});
		};
	});

	app.directive("addbuttoncorrectword", function($compile){
		return function(scope, element, attrs){
			element.bind("click", function(){
				scope.count++;
				angular.element(document.getElementById('dropzoneCorrectWord')).append($compile("<div><button class='w3-btn w3-padding w3-blue' draggable='true' ondragstart='return dragInitialize(event)' id={{correctWord.Value}}>"+scope.correctWordTextInput+"</button></div>")(scope));
			});
		};
	});

	app.controller('mistakeController', function($scope, $http) {

		$scope.sessionRunning = false;
		$scope.itemDroppedInSpokenWordDropZone=false;
		$scope.itemDroppedInMistakeTypeDropZone=false;
		$scope.itemDroppedInCorrectWordDropZone=false;
		getSpokenWords();
		getCorrectWords();
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
		$scope.addItem = function(SpokenWord, CorrectWord, MistakeType) {
			//$scope.mistakes.push({SpokenWord:$scope.spokenWord, CorrectWord:$scope.correctWord});
			//update DB
		  $http.post("php/insertNewMistake.php?SpokenWord="+SpokenWord+"&CorrectWord="+CorrectWord+"&MistakeType="+MistakeType+"&CurrentDate="+$scope.getDatetime).success(function(data){
		  });
		  getMistakes();
		}

		//RESET DROPZONES TO ORIGINAL STATE
		$scope.clearDropZone = function(divId, elementId) {
			if (elementId != null)
			{
				document.getElementById(divId).appendChild(document.getElementById(elementId));
			}
		}

		// INCREMENT MISTAKE BY 1
		$scope.incrementMistake = function(mistake) {
			//UPDATE SCOPE HERE
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

			$scope.getDropZoneContents = function (id) {
				var ancestor = document.getElementById(id),
				descendents = ancestor.getElementsByTagName('*');
				return descendents;
			}

		// GET ALL ITEMS IN SPOKEN WORD LIST
			function getSpokenWords() {
				$http.get("php/selectSpokenWordList.php")
		    		.then(function (response) {$scope.spokenWords = response.data.records;});
			}

				// GET ALL ITEMS IN CORRECT WORD LIST
			function getCorrectWords() {
				$http.get("php/selectCorrectWordList.php")
		    		.then(function (response) {$scope.correctWords = response.data.records;});
			}

		// ADD MISTAKE TO DB
			$scope.addMistake = function() {
				//retrieve items from respective dropzones
				wrongWordDropZoneContents = $scope.getDropZoneContents('dropzoneWrongWord');
				errorTypeDropZoneContents = $scope.getDropZoneContents('dropzoneErrorType');
				correctWordDropZoneContents = $scope.getDropZoneContents('dropzoneCorrectWord');
				var spokenWordId;
				var mistakeTypeId;
				var correctWordId;

				//take the text value of the droped item
				var i, e, d;
				for (i = 0; i < wrongWordDropZoneContents.length; ++i) {
				    spokenWord = wrongWordDropZoneContents[i].innerText;
				    spokenWordId = wrongWordDropZoneContents[i].id;
				}
				for (i = 0; i < errorTypeDropZoneContents.length; ++i) {
				    mistakeType = errorTypeDropZoneContents[i].innerText;
				    mistakeTypeId = errorTypeDropZoneContents[i].id;
				}
				for (i = 0; i < correctWordDropZoneContents.length; ++i) {
				    correctWord = correctWordDropZoneContents[i].innerText;
				    correctWordId = correctWordDropZoneContents[i].id;
				}

				//call the function to add mistake to DB
				$scope.addItem(spokenWord, correctWord, mistakeType);

				//clear dropzones of dropped-in content
				$scope.clearDropZone('spokenWord', spokenWordId);
				$scope.clearDropZone('mistakeType', mistakeTypeId);
				$scope.clearDropZone('correctWord', correctWordId);
		}
	});