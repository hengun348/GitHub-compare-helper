var commitListItems,
	notificationElement,
	githubCompareUrl;

commitListItems = Array.from(document.getElementsByClassName('commit'));

function copyFunction(e) {
	e.clipboardData.setData('text/plain', githubCompareUrl);
	e.preventDefault();
	
	githubCompareUrl = undefined;
	document.removeEventListener('copy', copyFunction);
}

if(extensionIsNotInitialized()) {
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
			secondSelectedCommitSHA,
			lastIndexOfSelectedCheckboxes;
			
		checkboxes = commitListItems.map(toCheckboxes);
		
		function toCheckboxes(listItem) {
			return listItem.getElementsByClassName('commit-compare-checkbox')[0];
		}
				
		selectedCheckboxes = checkboxes
							.filter(onSelectedCheckboxes);
				
		function onSelectedCheckboxes(checkbox, index) {
			var checkboxIsChecked = checkbox.checked;
			
			if(checkboxIsChecked) {
				lastIndexOfSelectedCheckboxes = index;
			}
			
			return checkboxIsChecked;
		}
			
		if(selectedCheckboxes.length === 0) {
			showNotification('error', 'You have not selected any commits!');
			return;
		}
		
		if(selectedCheckboxes.length === 1) {
			showNotification('error', 'You have selected too few commits! Select 2 commits.');
			return;
		}
		
		if(selectedCheckboxes.length > 2) {
			showNotification('error', 'You have selected too many commits! Only select 2 commits.');
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
		
		copyCompareUrlToClipBoard();
		
		function copyCompareUrlToClipBoard() {
			try {  
				document.addEventListener('copy', copyFunction);
				document.execCommand('copy');
				
				showNotification('success', 'Compare url copied to clipboard.');  
			} catch(err) {  
				showNotification('error', 'Unable to copy compare url to clipboard!');  
			}  
		}
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
	
	function appendCheckbox(listItem) {
		var sha,
			checkbox;
		
		sha = listItem.getElementsByClassName('sha')[0].text.trim();
		
		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = sha;
		checkbox.className = 'commit-compare-checkbox';
		
		listItem.appendChild(checkbox);
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