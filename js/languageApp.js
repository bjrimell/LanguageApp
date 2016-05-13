var app = angular.module("languageApp", []);

	var manuallyAddedCounter =0;

	app.directive("addbuttonwrongword", function($compile){
		return function(scope, element, attrs){
			element.bind("click", function(){
				if (itemDroppedInSpokenWordDropZone)
					{return false;}
				// we want the ID to be a hash so it is unique for each specific word/phrase entered
				var hash = hashCode('spoken_'+scope.spokenWordTextInput);
				// if the typed text already appears in the list of available words, use existing instead of creating new button
				//if (document.getElementsByName(scope.spokenWordTextInput).length >0)
				if (document.getElementById(hash))
					{return false;}
				scope.count++;
				angular.element(document.getElementById('dropzoneWrongWord')).append($compile("<div id='manual'><button class='w3-btn w3-padding w3-light-blue' draggable='true' ondragstart='return dragInitialize(event)' id="+hash+" name="+hash+" ng-disabled='!sessionRunning'>"+scope.spokenWordTextInput+"</button></div>")(scope));
				scope.manualSpokenWords.push({Value:scope.spokenWordTextInput, HashValue:hash});
				itemDroppedInSpokenWordDropZone = true;
				manuallyAddedCounter++;
			});
		};
	});

	app.directive("addbuttoncorrectword", function($compile){
		return function(scope, element, attrs){
			element.bind("click", function(){
				if (itemDroppedInCorrectWordDropZone)
					{return false;}
				// we want the ID to be a hash so it is unique for each specific word/phrase entered
				var hash = hashCode('correct_'+scope.correctWordTextInput);
				// if the typed text already appears in the list of available words, use existing instead of creating new button
				if (document.getElementById(hash))
					{return false;}
				angular.element(document.getElementById('dropzoneCorrectWord')).append($compile("<div id='manual'><button class='w3-btn w3-padding w3-light-blue' draggable='true' ondragstart='return dragInitialize(event)' id="+hash+" name="+hash+" ng-disabled='!sessionRunning'>"+scope.correctWordTextInput+"</button></div>")(scope));
				scope.manualCorrectWords.push({Value:scope.correctWordTextInput, HashValue:hash});
				itemDroppedInCorrectWordDropZone = true;
				manuallyAddedCounter++;
			});
		};
	});

	hashCode = function(str){
	    var hash = 0;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	app.controller('mistakeController', function($scope, $http) {

		getSpokenWords();
		getCorrectWords();
		getMistakes();
		$scope.manualSpokenWords = [];
		$scope.manualCorrectWords = [];

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
			$scope.mistakes.push({SpokenWord:SpokenWord, CorrectWord:CorrectWord});
			//$scope.$apply();
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
			// DISPLAY LIST OF NEW WORDS ADDED TO SPOKEN LIST
			for (var i=0; i < $scope.manualSpokenWords.length; i++)
			{
				$http.post("php/insertNewWord.php?Value="+$scope.manualSpokenWords[i].Value+"&WordType=SpokenWord&HashValue="+$scope.manualSpokenWords[i].HashValue).success(function(data){
		  		});
			}

			// DISPLAY LIST OF NEW WORDS ADDED TO CORRECT LIST
			for (var i=0; i < $scope.manualCorrectWords.length; i++)
			{
				$http.post("php/insertNewWord.php?Value="+$scope.manualCorrectWords[i].Value+"&WordType=CorrectWord&HashValue="+$scope.manualCorrectWords[i].HashValue).success(function(data){
		  		});
			}

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

			$scope.checkDropZoneHasContents = function() {
				//check all dropzones have an item before continuing
				if (!itemDroppedInSpokenWordDropZone)
					{return false;} //return error
				else if (!itemDroppedInMistakeTypeDropZone)
					{return false;} //return error
				else if (!itemDroppedInCorrectWordDropZone)
					{return false;} //return error
				return true;
			}

		// ADD MISTAKE TO DB
			$scope.addMistake = function() {

				if (!$scope.checkDropZoneHasContents()) {
					return false;
				};
				//retrieve items from respective dropzones
				wrongWordDropZoneContents = $scope.getDropZoneContents('dropzoneWrongWord');
				errorTypeDropZoneContents = $scope.getDropZoneContents('dropzoneErrorType');
				correctWordDropZoneContents = $scope.getDropZoneContents('dropzoneCorrectWord');
				var spokenWordId;
				var mistakeTypeId;
				var correctWordId;

				//take the text value of the dropped item
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
				itemDroppedInSpokenWordDropZone = false;
				$scope.clearDropZone('mistakeType', mistakeTypeId);
				itemDroppedInMistakeTypeDropZone = false;
				$scope.clearDropZone('correctWord', correctWordId);
				itemDroppedInCorrectWordDropZone = false;
		}
	});