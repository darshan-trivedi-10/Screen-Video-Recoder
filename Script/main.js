let screenRcd = document.querySelector('#screenRecoder');


let data = [];
let isrecord = false;
let ScreenRecorder;

screenRcd.addEventListener("click", async function (e) {
    await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { mediaSource: "screen" }
    }).then(function (mediaStream) {
        ScreenRecorder = new MediaRecorder(mediaStream);

        ScreenRecorder.addEventListener("start", (e) => {
            data = [];
        })

        ScreenRecorder.addEventListener("dataavailable", function (e) {
            data.push(e.data);
        })

        ScreenRecorder.addEventListener("stop", function () {
            let blob = new Blob(data, { type: "screenRec/mp4" });
            let videoURL = URL.createObjectURL(blob);
            if (db) {
                let videoId = shortid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `scr-${videoId}`,
                    blobData: blob
                }
                console.log(videoEntry);
                videoStore.add(videoEntry);
            }
        })
    }).catch(function (err) {
        console.log(err);
    });

    if (isrecord == false) {
        ScreenRecorder.start();
    } else {
        ScreenRecorder.stop();
    }
    isrecord = !isrecord;
});
