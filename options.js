function saveOptions(){
    let optionsForm = document.getElementById("options-form");
    let howOpen = optionsForm["how-open"].value;

    browser.storage.local.set({
        "how-open": howOpen
    });
}
function restoreOptions(){
    function setCurrentChoice(result){
        let optionsForm = document.getElementById("options-form");
        optionsForm["how-open"].value = result["how-open"] || "background";
    }
    function onError(error){
        console.log(`Error: ${error}`);
    }
    
    let getting = browser.storage.local.get(["how-open"]);
    getting.then(setCurrentChoice, onError);
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
