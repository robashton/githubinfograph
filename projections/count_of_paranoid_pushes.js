fromStream('github-paranoidpushes')
   .when({
     $init: function() {
        return { count: 0 }
     },
     ParanoidPush: function(state, ev) {
        state.count++
     }
   })
