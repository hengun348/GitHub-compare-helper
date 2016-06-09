var commitListItems,
	notificationElement,
	githubCompareUrl,
	lastIndexOfSelectedCheckboxes;

if(extensionIsNotInitialized()) {
	startPollingIfPageIsRendered();
}

function startPollingIfPageIsRendered() {
	var commitsListIsVisible = !!Array.from(document.getElementsByClassName('commits-listing')).length;
	
	if(commitsListIsVisible) {
		drawElements();
	} else { 
		setTimeout(startPollingIfPageIsRendered, 500);
	}
}

function drawElements() {
	commitListItems = Array.from(document.getElementsByClassName('commit'));

	addGenerateCompareUrlButton();
	addNotificationContainer();
	addCheckboxes();
}

function extensionIsNotInitialized() {
	return !document.getElementById('generate-compare-url-button');
}

function addGenerateCompareUrlButton() {
	var selectMenu,
		generateCompareUrlButton,
		textNode;
		
	selectMenu = document.getElementsByClassName('branch-select-menu')[0];
	
	generateCompareUrlButton = document.createElement('button');
	generateCompareUrlButton.id = 'generate-compare-url-button';
	generateCompareUrlButton.onclick = generateCompareUrl;
	
	textNode = document.createTextNode('Generate compare url')
	
	generateCompareUrlButton.appendChild(textNode);
	
	selectMenu.appendChild(generateCompareUrlButton);
	
	function generateCompareUrl() {
		var checkboxes,
			selectedCheckboxes,
			firstSelectedCommitSHA,
			secondSelectedCommitSHA;
			
		checkboxes = getAllCheckboxElements();
		selectedCheckboxes = getSelectedCheckboxes(checkboxes);
			
		if(selectedCheckboxes.length === 0) {
			showNotification('error', 'You have not selected any commits!');
			return;
		}
		
		if(selectedCheckboxes.length === 1) {
			showNotification('error', 'You have selected too few commits! Select 2 commits.');
			return;
		}
		
		firstSelectedCommitSHA = selectedCheckboxes[0].value;
		secondSelectedCommitSHA = checkboxes[lastIndexOfSelectedCheckboxes + 1].value;

		if(!firstSelectedCommitSHA || !secondSelectedCommitSHA) {
			showNotification('error', 'Could not find commits SHAs.');
		}
		
		githubCompareUrl = baseCompareUrlFromCurrentCommitsUrl();
		
		if(!githubCompareUrl) {
			showNotification('error', 'Could not generate compare url!');
		}
		
		function baseCompareUrlFromCurrentCommitsUrl() {
			var indexOfCommitsPartOfUrl,
				githubCommitsUrl,
				githubCommitsUrlFirstPart,
				githubCompareUrlLastPart;
				
			githubCompareUrlLastPart = 'compare/' + secondSelectedCommitSHA + '...' + firstSelectedCommitSHA;
			
			githubCommitsUrl = document.location.href;
			indexOfCommitsPartOfUrl = githubCommitsUrl.indexOf('commits');
		
			githubCommitsUrlFirstPart = githubCommitsUrl.substring(0, indexOfCommitsPartOfUrl);
		
			return githubCommitsUrlFirstPart + githubCompareUrlLastPart;
		}
		
		window.location = githubCompareUrl;
	}
}


function getAllCheckboxElements() {
	return commitListItems.map(toCheckboxes);

	function toCheckboxes(listItem) {
		return listItem.getElementsByClassName('commit-compare-checkbox')[0];
	}
}

function getSelectedCheckboxes(checkboxes) {
	return checkboxes.filter(onSelectedCheckboxes);
				
	function onSelectedCheckboxes(checkbox, index) {
		var checkboxIsChecked = checkbox.checked;
		
		if(checkboxIsChecked) {
			lastIndexOfSelectedCheckboxes = index;
		}
		
		return checkboxIsChecked;
	}
}

function addNotificationContainer() {
	var fileNavigationElement;
		
	fileNavigationElement = document.getElementsByClassName('file-navigation')[0];
	
	notificationElement = document.createElement('div');
	notificationElement.id = 'compare-helper-notification';
	
	fileNavigationElement.appendChild(notificationElement);
}

function addCheckboxes() {
	commitListItems.forEach(appendCheckbox);
	
	function appendCheckbox(listItem, index) {
		var sha,
			checkbox;
		
		sha = listItem.getElementsByClassName('sha')[0].text.trim();
		
		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = sha;
		checkbox.onclick = highlightRange;
		checkbox.className = 'commit-compare-checkbox';
		
		listItem.appendChild(checkbox);

		if(index === commitListItems.length -1) {
			checkbox.style.visibility = "hidden";
		}

		function highlightRange() {
			var allCheckboxes = getAllCheckboxElements(),
				selectedCheckboxes = getSelectedCheckboxes(allCheckboxes),
				foundFirstSelectedCheckbox = false,
				foundSecondSelectedCheckbox = false;
				
			if(selectedCheckboxes.length < 2) {
				enableAllCheckboxes();
				return;
			}
			
			allCheckboxes.forEach(disableBasedOnSelection);
			
			function disableBasedOnSelection(checkbox) {
				if(!foundFirstSelectedCheckbox) {
					disableUntilFirstCheckboxFound(checkbox);
				} 
				
				if(!foundSecondSelectedCheckbox) {
					verifyIsSecondSelected(checkbox);
				} else {
					disableAndUncheckAfterSecondCheckboxFound(checkbox);
				}
			}
			
			function disableAndUncheckAfterSecondCheckboxFound(checkbox) {
				checkbox.disabled = true;
				checkbox.checked = false;
			}
			
			function disableUntilFirstCheckboxFound(checkbox) {
				if(checkbox.value !== selectedCheckboxes[0].value) {
					checkbox.disabled = true;
				} else {
					foundFirstSelectedCheckbox = true;
				}
			}
			
			function verifyIsSecondSelected(checkbox) {
				if(checkbox.value === selectedCheckboxes[1].value) {
					foundSecondSelectedCheckbox = true;
				}
			}
			
			function enableAllCheckboxes() {
				allCheckboxes.forEach(enableIt);
				
				function enableIt(checkbox) {
					checkbox.disabled = false;
				}
			}
		}
	}
}

function showNotification(type, text) {
	if(type === 'error') {
		notificationElement.className = 'error';
	} else {
		notificationElement.className = 'success';
	}
	
	notificationElement.innerHTML = text;
}