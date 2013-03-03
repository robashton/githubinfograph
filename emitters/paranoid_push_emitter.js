fromStream('github')
  .partitionBy(function(ev) {                                                        
    if(ev.body.repo) {                                                               
      return ev.body.repo.full_name                                                   
    }
  })  
  .when({                                                                            
    $init: function(state, ev) { 
      return {}                                               
    },  
    "PushEvent": function(state, ev) {
      if(state.lastPush) {
        var newDate = new Date(ev.body.created_at)                                   
          , lastDate = new Date(state.lastPush.body.created_at)                      
          , difference = (newDate.getTime() - lastDate.getTime()) / 1000             
            
        if(difference < 120) {
          emit('github-paranoidpushes', "ParanoidPush", {                            
            first: state.lastPush,                                                   
            next: ev                                                                 
          })
        }                                                                            
      }                                                                              
      state.lastPush = ev                                                            
    }
  }) 

