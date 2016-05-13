function dragInitialize(ev) {
ev.dataTransfer.effectAllowed='move';
ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
return true;
}

function allowDropStatus(ev) {
ev.preventDefault();
return false;
}	

function dropComplete(ev) {

	switch (ev.currentTarget.id) // prevent more than one item appearing in drop zone
	{
		case "dropzoneWrongWord":
		{
			if (itemDroppedInSpokenWordDropZone)
			{
				return false;
			}
			else
			{
				itemDroppedInSpokenWordDropZone = true;
				break;
			}
		}
		case "spokenWord":
		{
			itemDroppedInSpokenWordDropZone = false;
			break;
		}

		case "dropzoneCorrectWord":
		{
			if (itemDroppedInCorrectWordDropZone)
			{
				return false;
			}
			else
			{
				itemDroppedInCorrectWordDropZone = true;
				break;
			}
		}
		case "correctWord":
		{
			itemDroppedInCorrectWordDropZone = false;
			break;
		}

		case "dropzoneErrorType":
		{
			if (itemDroppedInMistakeTypeDropZone)
			{
				return false;
			}
			else
			{
				itemDroppedInMistakeTypeDropZone = true;
				break;
			}
		}
		case "mistakeType":
		{
			itemDroppedInMistakeTypeDropZone = false;
			break;
		}
	}

ev.preventDefault();
var src = ev.dataTransfer.getData("Text");
ev.target.appendChild(document.getElementById(src));
ev.stopPropagation();
return false;
}