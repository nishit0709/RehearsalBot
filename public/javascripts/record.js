var socket = io()
const mic = document.getElementById("mic")
const micButton = document.getElementById("micButton")

function invertMic(color){
  if(color == 0){
    mic.setAttribute('style', '-webkit-filter: invert(1);filter: invert(0);')
    micButton.disabled = false
  }else{
    mic.setAttribute('style', '-webkit-filter: invert(1);filter: invert(1);')
    micButton.disabled = true
  }
}

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');
  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    micButton.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      invertMic(1)
      setTimeout(function() {
          mediaRecorder.stop();
          invertMic(0)
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
      },5000)
    }

    mediaRecorder.onstop = async function(e) {
      console.log("data available after MediaRecorder.stop() called.");
      const blob = new Blob(chunks, { 'type': 'audio/mp3' });
      chunks = []

      socket.emit("audio",blob)
      socket.on("userSpeech",(msg)=>{
        userResponse(msg)
      })
      socket.on("botSpeech",(msg)=>{
        botResponse(msg)
      })
      console.log("recorder stopped");  
    }

    mediaRecorder.ondataavailable = function(e) {
      console.log("data available")
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
    console.log('getUserMedia not supported on your browser!');
}