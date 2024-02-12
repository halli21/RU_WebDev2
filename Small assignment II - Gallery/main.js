document.addEventListener('DOMContentLoaded', function() {
  var dropzone = document.getElementById('dropzone');
 
  
  dropzone.addEventListener('dragenter', function(event) {
      output.textContent = '';
      event.stopPropagation();
      event.preventDefault();
  });
  
  dropzone.addEventListener('dragover', function(event) {
      event.stopPropagation();
      event.preventDefault();
  });
  
  dropzone.addEventListener('drop', function(event) {
      event.stopPropagation();
      event.preventDefault();
      dodrop(event);
  });
});




function dodrop(event)
{
  var dt = event.dataTransfer;
  var files = dt.files;

  var count = files.length;
  output("File Count: " + count + "\n");

    for (var i = 0; i < files.length; i++) {
      output(" File " + i + ":\n(" + (typeof files[i]) + ") : <" + files[i] + " > " +
             files[i].name + " " + files[i].size + "\n");
    }
}

function output(text)
{
  document.getElementById("dropzone").textContent += text;
  //dump(text);
}