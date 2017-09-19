let history = {
  entries: [],
  currentIndex: 0,
  current: "",
  mostRecent: "",
  temp: "freshTempura",
  isPrev: false,
  add: function(expression){
    if(expression != this.mostRecent && expression) { //No immediate duplicate entries
      this.entries.push(expression)
      this.mostRecent = expression
      this.temp = ""
    }
    this.currentIndex = this.entries.length
  },
  selectOlder: function(){
    if(this.currentIndex > 0)
      this.currentIndex--

    return this.entries.length ? this.entries[this.currentIndex] : ""
  },
  selectNewer: function(){
    //don't increment if last AND no temp value
    if(this.currentIndex < this.entries.length){
      this.currentIndex++          
    }
    if(this.currentIndex == this.entries.length) {
      return this.temp
    }
         
    return this.entries.length ? this.entries[this.currentIndex] : ""
  }
}

let editor,
    Range    

$(function(){
  Range = ace.require("ace/range").Range

  view = ace.edit("view")

  view.setOptions({
    mode: "ace/mode/c_cpp",
    theme: "ace/theme/chaos",
    readOnly: true,
    showGutter: false,
    animatedScroll: true,
    autoScrollEditorIntoView: true,
    highlightGutterLine: false,
    selectionStyle: "text",
    showPrintMargin: false,
    wrap: true
  })

  editor = ace.edit("input")  

  editor.setOptions({
    mode: "ace/mode/c_cpp",
    theme: "ace/theme/chaos",
    highlightActiveLine: false,
    showGutter: false,
    showPrintMargin: false    
  })

  editor.focus()

  // editor.setTheme("ace/theme/chaos")
  // editor.session.setMode("ace/mode/c_cpp")

  //Automatically scrolling cursor into view after selection change this will be disabled 
  //in the next version set editor.$blockScrolling = Infinity to disable this message
  editor.$blockScrolling = Infinity
  view.$blockScrolling = false

  editor.commands.addCommand({
    name: 'doCalc',
    bindKey: {win: 'enter',  mac: 'enter'},
    exec: function(editor) {
        crunch()
    },
    readOnly: true // false if this command should not apply in readOnly mode
  })

  editor.commands.addCommand({
    name: 'older',
    bindKey: {win: 'up',  mac: 'up'},
    exec: function(editor) {      
      let older = history.selectOlder()
      if (older){
        history.isPrev = true
        editor.setValue(older)
      }
    },
    readOnly: true
  })

  editor.commands.addCommand({
    name: 'newer',
    bindKey: {win: 'down',  mac: 'down'},
    exec: function(editor) {      
      let newer = history.selectNewer()
      if (newer != "freshTempura"){
        history.isPrev = true
        editor.setValue(newer)
      }
    },
    readOnly: true
  })

  editor.getSession().on('change', function(e) {
    if(editor.getValue()) {
      if(!history.isPrev) {
        history.temp = editor.getValue()
        history.currentIndex = history.entries.length
      }

      history.isPrev = false

      // console.log("-")
      // console.log("isPrev: " + history.isPrev)
      // console.log("temp: " + history.temp)
      // console.log("i: " + history.currentIndex)
      // console.log("len: " + history.entries.length)
    } else {
      if(!history.isPrev) {
        history.temp = ""
        history.currentIndex = history.entries.length
      }
    }
  })

  
  $(document).keyup(function(e) {
    editor.focus()

    // switch(e.which) {
    //   case 13: // enter
    //     crunch()
    //   break

    //   case 38: // up
    //     // $("#input").val(history.selectOlder())
    //     editor.setValue(history.selectOlder())
    //   break

    //   case 40: // down
    //     // $("#input").val(history.selectNewer())
    //     editor.setValue(history.selectNewer())
    //   break

    //   default: return // exit this handler for other keys
    // }
  })
})

function displayResult(result) {
  let entry = view.getValue().length ? 
              "\n\n" + editor.getValue() + "\n= " + result : 
              editor.getValue() + "\n= " + result

  view.insert(entry)

  view.session.addMarker(new Range(view.session.getLength() - 1, 0, view.session.getLength() - 1, 1), "result", "fullLine") //ace_active-line
}

function crunch() {
  let expression = editor.getValue(),
      result

  try {
    result = math.eval(expression)
  } catch (e) {
    // if (e instanceof SyntaxError) {
    //   alert(e.message)
    // }
    alert(e.message)
  }

  if(result) {
    displayResult(result)
    editor.setValue("")    
    history.add(expression)
    // $('#view').scrollTop(d.prop("scrollHeight"))
  }
}