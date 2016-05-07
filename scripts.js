var commitListItems = Array.from(document.getElementsByClassName('commit'));


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
			lastIndexOfSelectedCheckboxes,
			githubCompareUrl;			;
			
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
		
		githubCompareUrl = 'https://github.com/reqtest/reqtest/compare/' +
							secondSelectedCommitSHA + '...' + firstSelectedCommitSHA;
		
		console.log(githubCompareUrl);
	}
}

function addCheckboxes() {
	commitListItems.forEach(appendCheckbox);
	
	function appendCheckbox(listItem) {
		var sha,
			checkbox;
		
		sha = listItem.getElementsByClassName('sha')[0].text.trim();
		
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = sha;
		checkbox.className = 'commit-compare-checkbox';
		
		listItem.appendChild(checkbox);
	}
}

