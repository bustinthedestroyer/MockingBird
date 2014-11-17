//I am the popup.js I get run when the browser extension icon is clicked
//If you make a change here, you only have to reopen the pop-up to see the effect

//get the step from the background and spit them out
document.getElementById('output').innerHTML = chrome.extension.getBackgroundPage().steps;

//Set status and recording icon when pop-up opens 
if(chrome.extension.getBackgroundPage().paused){
	document.getElementById('recordButtton').className = 'record';
	document.getElementById('status').innerHTML = ' Press to being recording.';
}else{
	document.getElementById('recordButtton').className = 'recording';
	document.getElementById('status').innerHTML = ' Recording...';
}

//TODO remove when I remember why I was doing this
//document.getElementById('status').innerHTML = chrome.extension.getBackgroundPage();

//onload attach functions to buttons in popup (inline js is not allowed so attach events here)
window.onload = function(){
	function clear(){
		console.log('pu.clear');
		chrome.extension.sendRequest({method: "clearSteps", data:"data"});
		document.getElementById('output').innerHTML = '';
	}
	function record(){
		console.log('pu.record');
		if(chrome.extension.getBackgroundPage().paused){
			window.close();
		}else{
			document.getElementById('recordButtton').className = 'record';
			document.getElementById('status').innerHTML = ' Press to being recording.';
		}
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   			function(tabs){
				chrome.extension.sendRequest({method: "record", data: tabs[0].url});
			}
		);
	}
	//function test(){
	//	console.log('pu.test');
	//	alert('test');		
	//}
	
	document.getElementById('recordButtton').onclick = record;	
	document.getElementById('clearButton').onclick = clear;
	//document.getElementById('testButton').onclick = test;
}