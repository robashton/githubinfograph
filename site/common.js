var originalEventMapping = {
    "pushes": {  display: "Pushes", original: "PushEvent" }, 
      "pullrequestopened": { display: "Pull requests opened", original: "PullRequestEvent" },
      "pullrequestclosed": { display: "Pull requests closed", original: "PullRequestEvent" },
      "issuecomments": { display: "Issues commented on", original: "IssueCommentEvent" },
      "gistcreated": { display: "Gists created", original: "GistEvent" },
      "commitcomments": { display: "Commit comments", original: "CommitCommentEvent" },
      "repocreated": { display: "Repositories Created", original: "CreatedEvent" },
      "issuesopened": { display: "Issues opened", original: "IssuesEvent" },
      "issuesclosed": { display: "Issues closed", original: "IssuesEvent" },
      "issuesreopened": { display: "Issues re-opened", original: "IssuesEvent" }
}

var supportedEvents =  [ "PushEvent", "PullRequestEvent", "IssueCommentEvent", "GistEvent", "CommitCommentEvent", "CreatedEvent", "IssuesEvent" ]

var chartColourRange = d3.scale.linear().domain(supportedEvents).range(["red", "blue", "green"])
