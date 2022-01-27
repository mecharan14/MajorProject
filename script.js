var recognition;
var end = false;
if (!("webkitSpeechRecognition" in window)) {
  upgrade();
} else {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  // recognition.interimResults = true;

  recognition.onstart = function () {
    console.log("Started Voice Recognition");
  };
  recognition.onresult = function (event) {
    process(event.results[event.resultIndex][0].transcript, recognition);
  };
  recognition.onerror = function (event) {
    console.log(event);
  };
  recognition.onend = function () {
    if (end) {
      console.log("Ended Voice Recognition");
    } else {
      recognition.start();
    }
  };
}

const upgrade = () => {
  alert("Upgrade your browser first");
};

const process = (text, recognition) => {
  document.querySelector(".output").textContent = text;
  if (text.trim() == "hello" || text.trim() == "hi") {
    let greet;
    let date = new Date();
    if (date.getHours() < 12) {
      greet = "morning";
    } else if (date.getHours() < 15) {
      greet = "afternoon";
    } else {
      greet = "evening";
    }
    speak("Hello, good " + greet);
    return;
  }
  if (text.indexOf("read") > -1) {
    speak("Please wait while I recognise text");
    startTesseract();
    return;
  }
  if (text.indexOf("what do you see") > -1) {
    var map = new Map();
    objects.forEach((element) => {
      if (map.has(element["label"])) {
        map.set(element["label"], map.get(element["label"]) + 1);
      } else {
        map.set(element["label"], 1);
      }
    });

    console.log(map);
    msg = "I see ";
    map.forEach((v, k) => {
      if (v == 1) {
        msg += `a ${k}, `;
      } else {
        msg += `${v} ${k}s, `;
      }
    });
    speak(msg);
  }

  // document.querySelector('.output').textContent= text
  // speak(text);
  if (text.trim() == "stop") {
    end = true;
    recognition.stop();
  }
};

const speak = (text) => {
  if ("speechSynthesis" in window) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
  } else {
    upgrade();
  }
};
