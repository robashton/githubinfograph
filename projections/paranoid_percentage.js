fromStreams([ "github", "github-paranoidpushes" ])
   .when({
     "$init": function() {
       return { paranoid: 0, total: 0 }
     },
     "ParanoidPush": function(state, ev) {
       state.paranoid++
     },
     "PushEvent": function(state, ev) {
       state.total++
     }
   })
