/* not my code
https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript */

(function () {
    var textFile = null,
        makeTextFile = function () {
          // if this doesn't work just do text file
        var data = new Blob(objexport, {type: 'model/obj'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        return textFile;
      };


      var create = document.getElementById('export');

      create.addEventListener('click', function () {
        var link = document.createElement('a');
        link.setAttribute('download', 'model.obj');
        link.href = makeTextFile();
        document.body.appendChild(link);

        // wait for the link to be added to the document
        window.requestAnimationFrame(function () {
          var event = new MouseEvent('click');
          link.dispatchEvent(event);
          document.body.removeChild(link);
            });

      }, false);
    })();
