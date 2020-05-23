chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.includes('/commits') && changeInfo.status === 'complete') {
		if (tab.url.includes('/pull/')) {
			injectPullRequestScripts();
		} else {
            injectProjectScripts();
        }
	}
});

function injectProjectScripts() {
	chrome.tabs.executeScript({file: "common.js"});
	chrome.tabs.executeScript({file: "script-project.js"});
	chrome.tabs.insertCSS({file: "styles.css"});
}

function injectPullRequestScripts() {
	chrome.tabs.executeScript({file: "common.js"});
	chrome.tabs.executeScript({file: "script-pr.js"});
	chrome.tabs.insertCSS({file: "styles.css"});
}
