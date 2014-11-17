//I am the mighty contentscript, I am added to the end of every webpage in the brower as long as the plugin is enabled.
//I am used here to attach an event to any click that will record steps and send them to the background page where the popup can retrieve them.

function record(event){
	//Find out what type of element was clicked on and act accordingly
	//console.log(event.target.type);
	switch(event.target.type) {
		//If the element we clicked on is an input, lets attach a onblur event to capture what was put into the field (attachs to password or text fields) TODO: Text Area
		case 'text':
		case 'password':
			event.target.onblur = function(event){
				var theStep = 'Then I enter "' + event.target.value + '" into "' + event.target.id + '"';
				chrome.extension.sendRequest({method: 'recordStep', data: theStep});
				event.target.onblur = null;
			}
			break;
		//If the element is a select, lets figure that out (select-one)
		case 'select-one':
			event.target.onchange = function(event){
				var theStep = 'Then I select "' + event.target.value + '" from "' + event.target.id + '"';
				chrome.extension.sendRequest({method: 'recordStep', data: theStep})
				event.target.onchange = null;
			}
			break;
		//If the elemnt is a checkbox, check it by value
		case 'checkbox':
			var theStep = 'I check the box with value "' + event.target.value + '"';
			chrome.extension.sendRequest({method: "recordStep", data: theStep});
			break;
		//If the elemnt is a select, choose by id
		case 'radio':
			var theStep = 'Then I choose "' + event.target.id + '"';
			chrome.extension.sendRequest({method: 'recordStep', data: theStep});
			break;
		//If it is some other type of element, lets just poke it and hope for the best!
		default:
			var theStep = '';
			console.log(event.target.tagName)
			console.log(event.target.innerText)
			if(event.target.tagName=="A"){
			var theStep = 'Then I click on link with text "' + event.target.innerText + '"';
			}
			else if(event.target.tagName=="BUTTON"){
			var theStep = 'Then I click on button with text "' + event.target.innerText + '"';
			}
			else if(event.target.id){
				theStep = 'Then I click on element with id "' + event.target.id + '"';
			}else if(event.target.getAttribute('name')){
				theStep = 'Then I click on a "' + event.target.tagName +'" element with name "' + event.target.getAttribute('name') + '"';
			}else if(event.target.getAttribute('class')){
				theStep = 'Then I click on element with class "' + event.target.getAttribute('class') + '"';
			}else if(event.target.getAttribute('href')){
				theStep = 'Then I click on element with attribute "href" with value like "' + event.target.getAttribute('href')+'"';
			}else{
				theStep = 'WARNING:: No valid selector found'
			}
			chrome.extension.sendRequest({method: "recordStep", data: theStep});
	}
}

//Add that sweet NSA level tracking event! (just kidding NSA we <3 you)
document.addEventListener('click', record, true);