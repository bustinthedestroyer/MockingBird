//I am the mighty contentscript, I am added to the end of every webpage in the browser as long as the plugin is enabled.
//I am used here to attach an event to any click that will record steps and send them to the background page where the popup can retrieve them.

function record(event){
	//Find out what type of element was clicked on and act accordingly
	switch(event.target.type) {
		//If the element we clicked on is an input, lets attach a onblur event to capture what was put into the field (attachs to password or text fields) TODO: Text Area
		case 'text':
		case 'password':
			event.target.onblur = function(event){
				var theStep = 'Then I enter "' + event.target.value + '" into field "' + event.target.id + '"';
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

  			//Then I click on element with a class|id|type of ".*"
  			//Then I click on element with class|id|type ".*" and text|text from cache key ".*"
  			//Then I click on element with class|id|type ".*" and a ".*" attribute with value|value from cache key ".*"
			var theStep = '';

			var elementId = event.target.id;
			var elementType = event.target.tagName;
			var elementText = event.target.innerText;
			var elementClass = event.target.getAttribute('class');

			var infoString = "I clicked element class:'" + elementClass + "' id:'" + elementId + "' type:'" + elementType + "' text:'" + elementText + "'"
			//chrome.extension.sendRequest({method: "recordStep", data: infoString});

			//If there is an ID, use it.
			if (elementId) {
				theStep = 'Then I click on element with a id of "' + elementId + '"';
			//If it's a link, and has text use that.
			}else if (elementType == "A" && elementText) {
				//theStep = event.target.onclick
				theStep = 'Then I click on element with type "' + elementType + '" and text "' + elementText + '"'
				event.stopPropagation();
			//If there is only classes, then lets hope it's the only element with those classes.
			}else if (elementClass && !elementText && !elementId) {
  				theStep = 'Then I click on element with a class of "' + elementClass + '"'
			//No good selector.
			}else{
				theStep = "Failed to find selector :(";
			}
			chrome.extension.sendRequest({method: 'recordStep', data: theStep});
	}
}

//Add that sweet NSA level tracking event! (just kidding NSA we <3 you)
document.addEventListener('click', record, true);