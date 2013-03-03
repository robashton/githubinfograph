var swearwords = [ "fuck", "ass", "bitch", "bastard", "shit", "bollocks", "cock", "cunt", "dick", "hell",  ] // Changed to protect the innocent

fromStream('github-commits')
  .partitionBy(function(ev) {
    if(ev.body.repo)
      return ev.body.repo.language
  })
  .when({
    "$init": function(state, ev) {
      return { total: 0, curses: 0 }
    },
    "Commit": function(state, ev) {
      state.total += 1

      for(var i = 0 ; i < swearwords.length; i++) {
        var curse = swearwords[i]
        if(ev.body.commit.message.indexOf(curse) >= 0)
          state.curses += 1
      }
    }
  })

