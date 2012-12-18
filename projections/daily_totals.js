function addTo(state, e, eventName) {
  if(!state[eventName]) state[eventName] = 0
   state[eventName]++
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
    "PullRequestEvent": function(s, e) {
      if(e.body.payload.action === 'opened')
        addTo(s, e, "pullrequestopened")
      else if(e.body.payload.action === 'closed')
        addTo(s, e, "pullrequestclosed")
    },
    "IssueCommentEvent": function(s, e) {
      addTo(s, e, "issuecomments")
    },
    "GistEvent": function(s, e) {
       if(e.body.payload.action === 'create')
         addTo(s, e, "gistcreated")
     },
    "CommitCommentEvent": function(s, e) {
      addTo(s, e, "commitcomments")
    },
    "CreateEvent": function(s, e) {
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
