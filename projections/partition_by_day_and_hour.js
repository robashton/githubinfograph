fromStream('github')
  .whenAny(function(s, e) {
    if(e.body.created_at) {
      var date = new Date(e.body.created_at)
      var dateStr = 'hour-' + date.getUTCFullYear() + '' + date.getUTCMonth() + '' + date.getUTCDate() + '_' + date.getUTCHours()
      linkTo(dateStr, e)
    }
})
