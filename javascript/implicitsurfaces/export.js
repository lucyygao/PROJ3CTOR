/* not my code, from this and lightly modified
https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript */

var file = null;

function exportfile() {
  var data = new Blob(objexport, {type: 'model/obj'});
  if (file !== null) {
    window.URL.revokeObjectURL(file);
  }
  file = window.URL.createObjectURL(data);
  return file;
}

var exportbutton = document.getElementById('export');
exportbutton.addEventListener('click', function () {
  // only export if there are points to export
  if (coordinates.length > 0 && coordinates2.length > 0) {var link = document.createElement('a');
    link.setAttribute('download', 'model.obj');
    link.href = exportfile();
    document.body.appendChild(link);
    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
        });
  }
}, false);
