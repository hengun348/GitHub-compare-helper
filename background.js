chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	  
	chrome.declarativeContent.onPageChanged.addRules([
	  {
		conditions: [
		  new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { 
				hostEquals: 'github.com', 
				pathContains: 'commits'
			},
		  })
		],
		actions: [ new chrome.declarativeContent.ShowPageAction() ]
	  } 
	]);
  });  
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(tab.url.includes('commits') && changeInfo.status === 'complete') {
		injectScripts();
  	}
});

function injectScripts() {
	chrome.tabs.executeScript(null, {file: "script.js"});
	chrome.tabs.insertCSS(null, {file: "styles.css"});
}
