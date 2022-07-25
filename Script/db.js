//  Open a Data-Base
// Create Object - Store
// Make Transtastion 
let db; // databases
let openRequest = window.indexedDB.open("MyDatabase");

openRequest.addEventListener("success", (e) => {
    db = openRequest.result;
})

openRequest.addEventListener("error", (e) => {
    console.log("DB ERROR");
    console.log(e);
})

openRequest.addEventListener("upgradeneeded", (e) => {
    db = openRequest.result;
    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });
})