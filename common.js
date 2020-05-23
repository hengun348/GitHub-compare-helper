var commitListItems,
	notificationElement,
	githubCompareUrl,
	lastIndexOfSelectedCheckboxes;

function drawElements(buttonDestinationClass) {
	const buttonDestination = document.getElementsByClassName(buttonDestinationClass)[0];
	commitListItems = Array.from(document.getElementsByClassName('commit'));

	addGenerateCompareUrlButton(buttonDestination);
	addCheckboxes();
}

function addGenerateCompareUrlButton(buttonDestination) {
	let generateCompareUrlButton,
		textNode;
	
	generateCompareUrlButton = document.createElement('button');
	generateCompareUrlButton.id = 'generate-compare-url-button';
	generateCompareUrlButton.onclick = generateCompareUrl;

	textNode = document.createTextNode('Generate compare url');

	generateCompareUrlButton.appendChild(textNode);

	buttonDestination.prepend(generateCompareUrlButton);

	function generateCompareUrl() {
		let checkboxes,
			selectedCheckboxes,
			topSelectedCommitSHA,
			bottomSelectedCommitSHA;

		checkboxes = getAllCheckboxElements();
		selectedCheckboxes = getSelectedCheckboxes(checkboxes);

		if(selectedCheckboxes.length === 0) {
			alert('You have not selected any commits!');
			return;
		}

		if(selectedCheckboxes.length === 1) {
			alert('You have selected too few commits. Please select 2 commits.');
			return;
		}

		topSelectedCommitSHA = selectedCheckboxes[0].value;
		bottomSelectedCommitSHA = checkboxes[lastIndexOfSelectedCheckboxes].value;

		if(!topSelectedCommitSHA || !bottomSelectedCommitSHA) {
			alert('Could not find commits SHAs.');
		}

		githubCompareUrl = baseCompareUrlFromCurrentCommitsUrl();

		if(!githubCompareUrl) {
			alert('Could not generate compare url.');
		}

		function baseCompareUrlFromCurrentCommitsUrl() {
			let githubCommitsUrl,
				repoUrl,
				githubCompareUrlLastPart,
				isPullRequestPage = document.location.href.includes('/pull/');
			
			if (isPullRequestPage) {
				githubCompareUrlLastPart = '/compare/' + topSelectedCommitSHA + '...' + bottomSelectedCommitSHA;
			} else {
				githubCompareUrlLastPart = '/compare/' + bottomSelectedCommitSHA + '...' + topSelectedCommitSHA;
			}

			githubCommitsUrl = document.location.href;

			repoUrl = githubCommitsUrl.split('/').slice(0,5).join('/');

			return repoUrl + githubCompareUrlLastPart;
		}
		
		window.location.href = githubCompareUrl;
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
		const checkboxIsChecked = checkbox.checked;

		if(checkboxIsChecked) {
			lastIndexOfSelectedCheckboxes = index;
		}

		return checkboxIsChecked;
	}
}


function addCheckboxes() {
	commitListItems.forEach(appendCheckbox);

	function appendCheckbox(listItem) {
		let sha,
			checkbox;

		sha = listItem.getElementsByClassName('sha')[0].text.trim();

		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = sha;
		checkbox.onclick = highlightRange;
		checkbox.className = 'commit-compare-checkbox';

		listItem.appendChild(checkbox);

		function highlightRange() {
			let allCheckboxes = getAllCheckboxElements(),
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