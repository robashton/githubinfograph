fromStream("github")
  .when({
    "$init": function(state, ev) {
      return {}
    },
    "PushEvent": function(state, ev) {
      for(var i = 0 ; i < ev.body.payload.commits.length; i++) {
        var commit = ev.body.payload.commits[i]
        var repo = ev.body.repo 
        emit("github-commits", "Commit", {
          commit: commit,
          repo: repo
        })
      }
    }
 })
     
