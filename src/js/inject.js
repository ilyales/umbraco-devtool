(function() {
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(requestBody) {
        this.addEventListener('load', function() {
            var responseHeadersRaw = this.getAllResponseHeaders();
            var responseHeaders = {};
            if (typeof responseHeadersRaw === "string") {
                var responseHeadersArr = responseHeadersRaw.split("\r\n");
                var responseHeaders = responseHeadersArr.reduce(function (acc, current, i){
                    var parts = current.split(': ');
                    if (parts[0]!=="") {
                        acc[parts[0]] = parts[1];
                    }
                    return acc;
                }, {});
            }
            var responseBody = this.responseText;
            var requst = {
                url:this._url,
                method:this._method,
                responseType:this.responseType,
                requestHeaders:this._requestHeaders,
                requestBody:requestBody,
                responseHeader:responseHeaders,
                responseBody:responseBody
            }

            console.log(requst);
        });
        return send.apply(this, arguments);
    };

})();