chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.includes('/commits') && changeInfo.status === 'complete') {
		if (tab.url.includes('/pull/')) {
			injectPullRequestScripts(tabId);
		} else {
            injectProjectScripts(tabId);
        }
	}
});

function injectProjectScripts(tabId) {
	chrome.tabs.executeScript(tabId, {file: "script.js"});
	chrome.tabs.insertCSS(tabId, {file: "styles.css"});
}

function injectPullRequestScripts(tabId) {
	chrome.tabs.executeScript(tabId, {file: "script.js"});
	chrome.tabs.insertCSS(tabId, {file: "styles.css"});
}
