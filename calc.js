let history = {
  entries: [],
  currentIndex: 0,
  current: "",
  mostRecent: "",
  add: function(expression){
    if(expression != this.mostRecent) { //No immediate duplicate entries
      this.entries.push(expression)
      this.mostRecent = expression;
    }
    this.currentIndex = this.entries.length
  },
  selectOlder: function(){
    if(this.currentIndex > 0)
      this.currentIndex--

    return this.entries[this.currentIndex]
  },
  selectNewer: function(){
    if(this.currentIndex < this.entries.length -1)
      this.currentIndex++

    return this.entries[this.currentIndex]
  },  
}

$(function(){
  $("#input").focus()
  $("#input").focusout(function(){
    $("#input").focus()
  })

  // $("#doCalc").click(function() {
  //   crunch()    
  // })
  
  $(document).keydown(function(e) {    
    switch(e.which) {
      case 13: // enter
        crunch()
      break

      case 38: // up
        $("#input").val(history.selectOlder())
      break

      case 40: // down
        $("#input").val(history.selectNewer())
      break

      default: return // exit this handler for other keys
    }
  })
})

function displayResult(result) {
  let entry = "<div>" + $("#input").val() + "<br>= " + result + "</div>"
  $("#view").append(entry)
}

function crunch() {
  let expression = $("#input").val(),
      result

  try {
    result = math.eval(expression)
  } catch (e) {
    if (e instanceof SyntaxError) {
      alert(e.message)
    }
    alert(e.message)
  }

  if(result) {
    displayResult(result)
    $("#input").val("")
    history.add(expression)
    var d = $('#view')
    d.scrollTop(d.prop("scrollHeight"))
  }
}