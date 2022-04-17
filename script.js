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

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })
})

// Recoding Process Code
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;

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

})


// Timer Function
let timerId;
let counter = 0;
let timer = document.querySelector(".time-cont");

function startTimer() {
    function displayTimer() {
        let currSecond = counter;
        let hour = Number.parseInt(currSecond / 3600);
        currSecond = currSecond % 3600;
        let minutes = Number.parseInt(currSecond / 60);
        currSecond = currSecond % 60;
        let second = currSecond;
        hour = (hour < 10 ? `0${hour}` : hour);
        second = (second < 10 ? `0${second}` : second);
        minutes = (minutes < 10 ? `0${minutes}` : minutes);
        timer.style.display = "block";
        timer.innerText = `${hour} : ${minutes} : ${second}`;
        counter++;
    }

    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.style.display = "none";
    timer.innerText = "00:00:00";
    counter = 0;
}