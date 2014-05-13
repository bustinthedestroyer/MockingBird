  (function(context){

  document.getElementById("appid").value=chrome.runtime.id;  
  var logField = document.getElementById("log");
  var sendText=document.getElementById("sendText");
  var sendText=document.getElementById("sendText");
  var sendId=document.getElementById("sendId");
  var send=document.getElementById("send");

  chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse, scripttext) {
      if (sender.id in blacklistedIds) {
        sendResponse({"result":"sorry, could not process your message"});
        return;  // don't allow this extension access
      } else if (request.myCustomMessage) {
        appendLog("from "+sender.id+": "+request.myCustomMessage);
        //storescript(scripttext)
        sendResponse({"result":"Ok, got your message"});
      } else {
        sendResponse({"result":"I don't understand this message"});
      }
    });



  var appendLog = function(message) {
    logField.innerText+="\n"+message;
  }

 context.appendLog = appendLog;

  function storescript(scripttext)
{
  chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
      writableFileEntry.createWriter(function(writer) {
        writer.onerror = errorHandler;
        writer.onwriteend = function(e) {
          console.log('write complete');
        };
        //Note scripttext is of type Blob ex. new Blob(['1234567890']
        writer.write(scripttext, {type: 'text/plain'}));
      }, errorHandler);
  });
}



})(window)