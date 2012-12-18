function addTo(state, e, eventName) {
  var date = new Date(e.body.created_at)
  var hour = date.getUTCHours()
  if(!state[eventName]) state[eventName] = []
  if(typeof state[eventName][hour] === 'undefined')
  state[eventName][hour] = 0
  state[eventName][hour]++
}

fromAll()
  .partitionBy(function(e) {
    if(e.body && e.body.repo) {
      var date = new Date(e.body.created_at)
      return date.getUTCFullYear() + '' + date.getUTCMonth() + '' + date.getUTCDate()
    }
  })
  .when({
    "PushEvent": function(s, e) {
      addTo(s, e, "pushes")
    },
    "IssueCommentEvent": function(s, e) {
      addTo(s, e, "issuecomments")
    },
    "CommitCommentEvent": function(s, e) {
      addTo(s, e, "commitcomments")
    },
    "CreatedEvent": function(s, e) {
      addTo(s, e, "repocreated")
    },
    "IssuesEvent": function(s, e) {
      if(e.body.payload.action === 'opened')
        addTo(s, e, "issuesopened")
      else if(e.body.payload.action === 'closed')
        addTo(s, e, "issuesclosed")
      else if(e.body.payload.action === 'reopened')
        addTo(s, e, "issuesreopened")
    }
})
