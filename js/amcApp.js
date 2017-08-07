// ver 1.0

function onBackPressed() {
    return 0001;
}
function showShare() {
    if (isWKWebView()) {
        window.webkit.messageHandlers.amcfm_utils.postMessage({"shouldShowShare":"yes","message":"hehe"});
    }
    else {
        amcfm_utils.showShare("Hele");
    }
}

function closeClick() {
    if (isWKWebView()) {
        window.webkit.messageHandlers.amcfm_utils.postMessage({"finish":"yes"});
    }
    else {
        amcfm_utils.finish();
    }
}

function logClick() {
    if (isWKWebView()) {
        window.webkit.messageHandlers.amcfm_utils.postMessage({"ucd":"ucd requested from web page"});
    }
    else {
        amcfm_utils.ucd("ucd requested from web page");
    }
}

function isWKWebView() {
    var ua = navigator.userAgent;
    if (ua.indexOf("wkwebview") != -1) {
        return true;
    }
    else {
        return false;
    }
}

function refreshHome() {
    if (isWKWebView()) {
        window.webkit.messageHandlers.amcfm_utils.postMessage({"refreshHome":""});
    }
    else {
        amcfm_utils.refreshHome();
    }
}
