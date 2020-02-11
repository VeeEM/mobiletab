var defaultOptions = {
    "how-open": "background"
};
function isLink(element){
    if(element instanceof HTMLAnchorElement && element.href || element instanceof HTMLAreaElement && element.href){
        return true;
    }
    else{
        return false;
    }
}

function isDescendantOfLink(element){
    var p = element.parentNode;
    while(p != null){
        if(isLink(p)){
            return p;
        }
        p = p.parentNode;
    }
    return null;
}

function getLinkFromElement(element){
    if(isLink(element)){
        return element;
    }
    else{
        return isDescendantOfLink(element);
    }
}

var opening = null;
var lastClick = new Date().getTime();
var lastLink = null;
var skip = false;

var options = {};
function onGot(result){
    Object.keys(defaultOptions).forEach((key) => {
        if(result[key]){
            options[key] = result[key];
        }
        else{
            options[key] = defaultOptions[key];
        }
    });
    var setActive = options["how-open"] == "background" ? false : true;
    window.addEventListener("click", (e) => {
        if(skip == false){
            if(e.button != 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey){
                return;
            }
            var link = getLinkFromElement(e.target);
            if(link){
                e.preventDefault();
                e.stopPropagation();
                var thisClick = new Date().getTime();
                if((thisClick - lastClick) < 300 && lastLink == link){
                    if(opening){
                        clearTimeout(opening);
                        opening = null;
                    }
                    browser.runtime.sendMessage({"url": link.href, "active": setActive});
                }
                else{
                    if(opening){
                        clearTimeout(opening);
                        opening = null;
                    }
                    opening = setTimeout(function(){
                        opening = null;
                        skip = true;
                        e.target.click();
                    }, 300);
                }
                lastLink = link;
                lastClick = thisClick;
            }
        }
        else{
            skip = false;
        }
    }, {capture: true});
}
function onError(error){
    console.log(`Error: ${error}`);
}
let getting = browser.storage.local.get(defaultOptions.keys);
getting.then(onGot, onError);
