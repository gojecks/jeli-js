var unsafeHeaders = {
    'Accept-Charset': true,
    'Accept-Encoding': true,
    'Connection': true,
    'Content-Length': true,
    'Cookie': true,
    'Cookie2': true,
    'Content-Transfer-Encoding': true,
    'Date': true,
    'Expect': true,
    'Host': true,
    'Keep-Alive': true,
    'Referer': true,
    'TE': true,
    'Trailer': true,
    'Transfer-Encoding': true,
    'Upgrade': true,
    'User-Agent': true,
    'Via': true
};

/**
 * @method xhr()
 * Generate an XHR request instance
 */
function xhr() {
    if (typeof XMLHttpRequest !== 'undefined' && (!window.ActiveXObject)) {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } catch (e) {}
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
        } catch (e) {}
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {}
    }
    return false;
}