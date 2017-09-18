$(function(){
  $("#input").focus();
  $("#input").focusout(function(){
    $("#input").focus();
  });

  $("#doCalc").click(function() {
    crunch()    
  })
  
  $(document).keypress(function(e) {
    if(e.which == 13) {
      crunch()      
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
  }
}