var happyWords = [
  ":)", ":-)", ":D", ":-D", "great", "amazing", "yay", "celebrate", "yes!"
] 
var sadWords = [
  ":(", ":-(", ":-<", "crap", "rubbish", "awful", "shit", "lame"
] 
function collectHappinessIndexOfCommit(commit, state) {
     var index = 0
     for(var i in happyWords) {
         if(commit.message.indexOf(happyWords[i]) >= 0)
            state.happycount++
     }
     for(var i in sadWords) {
         if(commit.message.indexOf(sadWords[i]) >= 0)
            state.sadcount++
     }
     state.commits++
  }

  function collectHappinessIndexOfPush(pushEvent, state) {
    for(var i =0 ; i < pushEvent.body.payload.commits.length; i++) {
      var commit = pushEvent.body.payload.commits[i]
      collectHappinessIndexOfCommit(commit, state)
    }
  }

  fromStreams(['github', 'github-paranoidpushes'])
    .when({
      "$init": function() {
        return { 
            paranoid: {
               commits: 0, sadcount: 0, happycount: 0
            },
            all: {
               commits: 0, sadcount: 0, happycount: 0
            }
        }
      },
      "PushEvent": function(state, ev) {
         collectHappinessIndexOfPush(ev, state.all)
      },
      "ParanoidPush": function(state, ev) {
          collectHappinessIndexOfPush(ev.body.next, state.paranoid)
      }
    })

