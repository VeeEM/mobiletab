browser.runtime.onMessage.addListener(function(msg, sender, reply){
    var tabOptions = msg;
    tabOptions["index"] = sender.tab.index + 1;
    browser.tabs.create(msg);
});
