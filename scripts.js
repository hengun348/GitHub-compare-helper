var commitListItems,
	githubCompareUrl;
	
commitListItems = Array.from(document.getElementsByClassName('commit'));

function copyFunction(e) {
	e.clipboardData.setData('text/plain', githubCompareUrl);
	e.preventDefault();
	
	githubCompareUrl = undefined;
	document.removeEventListener('copy', copyFunction);
}

addGenerateCompareUrlButton();
addCheckboxes();

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
			alert('You have not selected any commits!');
			return;
		}
		
		if(selectedCheckboxes.length === 1) {
			alert('You have selected too few commits! \n' +
			'Select 2 commits, one to start compare from \n' +
			'and a second to stop the compare on.');
			
			return;
		}
		
		if(selectedCheckboxes.length > 2) {
			alert('You have selected too many commits! \n' +
			'Only select 2 commits, one to start compare from \n' +
			'and a second to stop the compare on.');
			
			return;
		}
		
		firstSelectedCommitSHA = selectedCheckboxes[0].value;
		secondSelectedCommitSHA = checkboxes[lastIndexOfSelectedCheckboxes + 1].value;
		
		if(!firstSelectedCommitSHA || !secondSelectedCommitSHA) {
			alert('Unknown error occured.');
		}
		
		githubCompareUrl = baseCompareUrlFromCurrentCommitsUrl();
		
		if(!githubCompareUrl) {
			alert('Could not generate compare url!');
		}
		
		function baseCompareUrlFromCurrentCommitsUrl() {
			var indexOfCommitsPartOfUrl,
				githubCommitsUrl,
				githubCompareUrlLastPart
				
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
				
				console.log('Compare url copied to clipboard.');  
			} catch(err) {  
				alert('Unable to copy compare url to clipboard!');  
			}  
		}
	}
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