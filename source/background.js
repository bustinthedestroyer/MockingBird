//I am the background.js, I am running as long as a chrome window is open regardless of tabs or windows, I will live until all chrome browsers are closed
//If you change something here, you must disable/re-enable the browser plug-in before changes will take hold

//global vars
var steps = "";
var paused = true;

//listeners so I can respond to request from individual browsers/tabs
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	//console.log(request.method);
	switch(request.method) {
		case 'recordStep':
			if(!paused){
				console.log('bg.recordstep');
				steps += '\r\n' + request.data;
			}
			break;
		case 'clearSteps':
			console.log('bg.clearSteps');
			steps = '';
			break;
		case 'record':
			console.log('bg.record : ' + request.data);
			if(paused){
				if(steps.length == ""){
					steps += 'Given I navigate to ' + request.data;
				}
				paused=false;
				console.log('bg.record : recording started');
				//Change Icon to record
				chrome.browserAction.setIcon({path: "img/bird_record.png"})

			}else{
				paused=true;
				console.log('bg.record : recording stopped');
				chrome.browserAction.setIcon({path: "img/bird.png"})
			}
			break;
		default:
			console.log('bg.unkown');
	}
});

chrome.windows.onRemoved.addListener(function(windowId){
	steps = "";
	paused = true;
	//TODO: Clean up proccess and stuffs
	//alert("!! Exiting the Browser !!");
});