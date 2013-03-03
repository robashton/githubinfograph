var postEvent = require('./es')
var https = require('https')

var eventQueue = [];
var timeUntilNextEvents = 10000;
var skipped = false
var remaining = 0
var last_created_at = new Date();
var config = require('../config')
 ,  auth = config.auth

var fetchRepoInfo = function(name, cb) {
 var request = https.get({ host: 'api.github.com', path: '/repos/' + name + auth}, function(res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      cb(JSON.parse(data));
    });
  }).on('error', function(e) {
    console.error(e);
  });
};

var createDataFromPushEvent = function(data, cb) {
  fetchRepoInfo(data.repo.name, function(repo) {
    cb({
      language: repo.language,
      actor: data.actor,
      repo: data.repo,
      payload: data.payload
    });
  });
};

var processEvent = function(event) {
  if(event.created_at < last_created_at) {
    console.log('Skipping event', event.created_at);
    skipped = true
    return;
  }
  console.log('Processing event', event.created_at, ':', event.type);
  last_created_at = event.created_at;

  if(event.type === 'PushEvent') {
    fetchRepoInfo(event.repo.name, function(repo) {
      event.repo = repo
      eventQueue.push(event)
    })
  }
};


var processData = function(data) {
  var eventArray = JSON.parse(data);
  for(var i = eventArray.length-1 ; i >= 0; i--) {
    if(i % 2 === 0)
      processEvent(eventArray[i]);
  }
  if(skipped) {
    timeUntilNextEvents += 1000
    skipped = false
  }
  else
    timeUntilNextEvents -= 1000
};

var downloadEvents = function() {
 var request = https.get({ host: 'api.github.com', path: '/events' + auth}, function(res) {
    var data = '';
    var remaining = parseInt(res.headers['x-ratelimit-remaining'], 10)
    console.log('There are ', remaining, ' requests remaining')
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      processData(data);
      console.log('Waiting ', timeUntilNextEvents, ' until next poll')
      setTimeout(downloadEvents, timeUntilNextEvents);
    });
  }).on('error', function(e) {
    console.error(e);
    timeUntilNextEvents *= 10
    console.log('Waiting ', timeUntilNextEvents, ' until next poll')
    setTimeout(downloadEvents, timeUntilNextEvents);
  }).end();

};

var broadcastEvent = function() {
  if(eventQueue.length === 0) 
    return setTimeout(broadcastEvent, 500);
  var event = eventQueue.shift();
  postEvent({
    host: "127.0.0.1",
    port: 2113,
    stream: "github",
    eventType: event.type,
    data: event,
    success: function(id, corr, res) {
      console.log('success', res)
    },
    error: function(err) {
      console.log(err)
    }
  })
  setTimeout(broadcastEvent, 10)
};

module.exports = {
  start: function() {
    downloadEvents();
    broadcastEvent();
  }
}

