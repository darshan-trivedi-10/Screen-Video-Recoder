setTimeout(() => {
    if (db) {
        // Video Retieval
        // Image retrieval
        let dbTransaction = db.transaction("video", "readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML = `
               <div class="media">
                       <video autoplay loop src="${url}"></video>
               </div>
               <div class="delete action-btn">Delete</div>
               <div class="download action-btn">Download</div> 
                `
                galleryCont.appendChild(mediaElem);
            })

        }

    }
}, 100);



