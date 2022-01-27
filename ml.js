let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx;
let frontCam = JSON.parse(localStorage.getItem('frontCam')) || false;
const width = window.innerWidth;
const height = window.innerHeight;
let worker;

async function make() {
  video = await getVideo();

  objectDetector = await ml5.objectDetector("cocossd", startDetecting);

  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
}

window.addEventListener("DOMContentLoaded", async function () {
  make();
  Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  ]).then(() => {
      console.log("face models loaded")
      startFaceApi();
  })
  if(!faceRecognition){
    worker = Tesseract.createWorker({
      logger: (m) => {
        document.querySelector("#work").innerHTML = m.status;
        document.querySelector("#progress").innerHTML = m.progress * 100 + "%";
      },
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
  }
});

function startDetecting() {
  console.log("Model Ready");
  if(!faceRecognition) detect();
  else justDraw();
  recognition.start();
}

function justDraw() {
  objects = [];
  draw();
  setTimeout(justDraw, 100);
}

function detect() {
  objectDetector.detect(video, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    objects = results;

    if (objects) {
      draw();
    }

    detect();
  });
}

async function draw() {
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(video, 0, 0);

  for (let i = 0; i < objects.length; i += 1) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

    ctx.beginPath();
    ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    ctx.strokeStyle = "lightgreen";
    ctx.stroke();
    ctx.closePath();
  }
}

async function changeCam(){
  frontCam = !frontCam;
  localStorage.setItem('frontCam', frontCam)
  location.reload();
}

async function getVideo() {
  const videoElement = document.createElement("video");
  videoElement.setAttribute("style", "display: none;");
  videoElement.width = width;
  videoElement.height = height;
  document.body.appendChild(videoElement);

  const capture = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: frontCam ? "user" : "environment" },
  });
  videoElement.srcObject = capture;
  videoElement.play();

  return videoElement;
}

function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);
  return canvas;
}

function startTesseract() {
  worker
    .recognize(getScreenshot())
    .then(({ data: { text } }) => {
      console.log("Result: ", text);
      speak(text);
    });
}

function getScreenshot() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const image = document.querySelector("img");
  image.src = canvas.toDataURL();
  image.setAttribute("style", "filter: grayscale(100%);");
  return image;
}
