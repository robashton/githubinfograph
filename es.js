var http = require('http')

module.exports = function (settings) {

    var eventType = settings.eventType || (function () { throw "eventType is required"; })();
    var stream = settings.stream || (function () { throw "stream is required"; })();
    var data = settings.data || (function () { throw "data is required"; })();
    var host = settings.host || (function() { throw "host is required";})();
    var port = settings.port || (function() { throw "port is required";})();

    var expectedVersion = settings.expectedVersion || -2;
    var eventId = settings.eventId || guid();
    var correlationId = settings.correlationId || guid();
    var metadata = settings.metadata || "";
    var onError = settings.error || function() {};
    var onSuccess = settings.success || function() {};

    var event = {
        "EventId": eventId,
        "EventType": eventType,
        "Data":  data,
        "Metadata": metadata
    };
    var body = {
        "CorrelationId": correlationId,
        "ExpectedVersion": expectedVersion,
        "Events": [event]
    };
    
    var bodyStr = JSON.stringify(body);
    var encodedStream = encodeURIComponent(stream);
    var url = "/streams/" + encodedStream;

    var req = http.request({
      host: host,
      port: port,
      path: url,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": bodyStr.length
      }
    }, function(res) {
      var response = ''
      res.setEncoding('utf8')
      res.on('data', function(data) {
        response += data
      })
      res.on('end', function() {
        onSuccess(eventId, correlationId, response)
      })
    })
    req.on('error', function(err) {
      onError(err, eventId, correlationId, expectedVersion)
    })
    req.write(bodyStr)
    req.end()

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}
