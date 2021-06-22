var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var coordinates2 = [];
var drawing2 = false;
var timer2 = 0;
var wasoutside2 = false;

// drawing2 points
function sculptdrawCoordinates(x,y){
    var pointSize = 3;
    ctx2.fillStyle = "#ff2626";
    ctx2.beginPath();
    ctx2.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx2.fill();
    ctx2.closePath();
}

function sculptclicked(e) {
    if (!sculptoutside(e)){
        drawing2 = true;
        var rectangle = canvas2.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        coordinates2.push([x, y]);
        // drawCoordinates(x, y);
        // ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.moveTo(x, y);
        ctx2.strokeStyle = 'black';
        ctx2.lineWidth = 1;
        ctx2.beginPath();
        ctx2.lineTo(x, y);
        ctx2.stroke();
    }
}

function sculptoutside(e) {
    var rectangle = canvas2.getBoundingClientRect();
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    if (x < 0 || x > 800 || y < 0 || y > 400) {
        done(e);
        wasoutside2 = true;
        return true;
    }
}

function sculptmoved(e) {
    if (drawing2 && !sculptoutside(e)) {
        // draw a dot every so often
        if (timer2 % 2 == 0) {
            // connect to previous point
            var rectangle = canvas2.getBoundingClientRect();
            var x = e.clientX - rectangle.left;
            var y = e.clientY - rectangle.top;
            if (wasoutside2) {
                sculptclicked(e);

                wasoutside2 = false;
            }
            ctx2.lineTo(x, y);
            ctx2.stroke();
            ctx2.moveTo(x, y);

            // draw red dot for point and add to coordinate array
            // drawCoordinates(x, y);
            coordinates2.push([x, y]);
        }
    }
    timer2++;
}

function sculptdone(e) {
    ctx2.closePath();
    drawing2 = false;
}

function sculptdraw() {
    // draw out all the coordinates
    for (var i = 0; i < coordinates2.length; i++) {
        drawCoordinates(coordinates2[i][0], coordinates2[i][1]);
    }

    // connect to other dots
    ctx2.beginPath();
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 1;
    for (var j = 0; j < coordinates2.length; j++) {
        ctx2.moveTo(coordinates2[j][0], coordinates2[j][1]);
        ctx2.lineTo(coordinates2[j + 1][0], coordinates2[j + 1][1]);
        ctx2.stroke();
    }
    ctx2.closePath();
}

// mouse clicks will draw points
canvas2.addEventListener("mousedown", sculptclicked);
canvas2.addEventListener("mousemove", sculptmoved);
canvas2.addEventListener("mouseup", sculptdone);

sculptdraw();