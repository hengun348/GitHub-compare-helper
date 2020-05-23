chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.includes('commits') && changeInfo.status === 'complete') {
		if (tab.url.includes('/pull/')) {
			injectPullRequestScripts();
		} else {
            injectProjectScripts();
        }
	}
});

function injectProjectScripts() {
	chrome.tabs.executeScript(null, {file: "common.js"});
	chrome.tabs.executeScript(null, {file: "script-project.js"});
	chrome.tabs.insertCSS(null, {file: "styles.css"});
}

function injectPullRequestScripts() {
	chrome.tabs.executeScript(null, {file: "common.js"});
	chrome.tabs.executeScript(null, {file: "script-pr.js"});
	chrome.tabs.insertCSS(null, {file: "styles.css"});
}
