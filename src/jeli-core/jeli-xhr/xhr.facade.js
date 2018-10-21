/**
 * 
 * @param {*} url 
 * @param {*} options 
 */
function $http() {
    return ajax.apply(ajax, arguments);
}

$http.put = generateOptionalHTTP('PUT');
$http.get = generateOptionalHTTP('GET');
$http.post = generateOptionalHTTP('POST');
$http['delete'] = generateOptionalHTTP('DELETE');

/**
 * 
 * @param {*} type 
 */
function generateOptionalHTTP(type) {
    return function(url, data, headers) {
        var options = {};
        options.type = type;
        options.data = data;
        options.headers = headers || {};

        return ajax(url, options);
    };
}