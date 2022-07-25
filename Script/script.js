let video = document.querySelector("video");
let recoder;
let constraints = {
    video: true,
    audio: true
}

video.volume = 0;

// For storing Data
let chunks = [];
// navigator -> global browser info object
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    recoder = new MediaRecorder(stream);

    recoder.addEventListener("start", (e) => {
        chunks = [];
    })

    // Collted Video Data in chunks
    recoder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })

    recoder.addEventListener("stop", (e) => {
        // Conversion to media chunks to video format
        let blob = new Blob(chunks, { type: "video/mp4" });
        let videoURL = URL.createObjectURL(blob);
        if (db) {
            let videoId = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }
    })
})

// Recoding Process Code
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

recordBtnCont.addEventListener("click", (e) => {
    if (!recoder) {
        return;
    }
    recordFlag = !recordFlag;
    if (recordFlag) {
        recoder.start();
        startTimer();
        recordBtn.classList.add("scale-record");
    } else {
        recoder.stop();
        stopTimer();
        recordBtn.classList.remove("scale-record");
    }
})

captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    let imgUrl = canvas.toDataURL();

    if (db) {
        let imageId = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imgUrl
        }
        imageStore.add(imageEntry);
    }
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500);
})


// Timer Function
let timerId;
let counter = 0;
let timer = document.querySelector(".timer");
let timerCont = document.querySelector(".time-cont");


function startTimer() {
    function displayTimer() {
        timerCont.style.display = 'flex'
        let currSecond = counter;
        let hour = Number.parseInt(currSecond / 3600);
        currSecond = currSecond % 3600;
        let minutes = Number.parseInt(currSecond / 60);
        currSecond = currSecond % 60;
        let second = currSecond;
        hour = (hour < 10 ? `0${hour}` : hour);
        second = (second < 10 ? `0${second}` : second);
        minutes = (minutes < 10 ? `0${minutes}` : minutes);
        timer.innerText = `${hour} : ${minutes} : ${second}`;
        counter++;
    }

    timerId = setInterval(displayTimer, 1000);
}


function stopTimer() {
    clearInterval(timerId);
    timerCont.style.display = "none";
    timer.innerText = "00:00:00";
    counter = 0;
}

// Filtering Logic :-
let filterLayer = document.querySelector(".filter-layer");
let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        // Get Style 
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
        console.log(transparentColor);
    })
})