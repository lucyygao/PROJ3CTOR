var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var coordinates = [];
var drawing = false;
var timer = 0;
var wasoutside = false;
var drawxmax = 0;
var drawxmin = 0;

// drawing points
function drawCoordinates(x,y){
    var pointSize = 3;
    ctx.fillStyle = "#ff2626";
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
}

function clicked(e) {
    if (!outside(e)) {
        drawing = true;
        var rectangle = canvas.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        coordinates.push([x, y]);
        // drawCoordinates(x, y);
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.moveTo(x, y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.stroke();
    }

}

function outside(e) {
    var rectangle = canvas.getBoundingClientRect();
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    if (x < 0 || x > 800 || y < 0 || y > 400) {
        done(e);
        wasoutside = true;
        return true;
    }
}

function moved(e) {
    if (drawing && !outside(e)) {
        // draw a dot every so often
        if (timer % 2 == 0) {
            // connect to previous point
            var rectangle = canvas.getBoundingClientRect();
            var x = e.clientX - rectangle.left;
            var y = e.clientY - rectangle.top;
            if (wasoutside) {
                ctx.lineWidth = 3;
                ctx.moveTo(x, y);
                ctx.beginPath();
                wasoutside = false;
            }
            else {
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.moveTo(x, y);
            }


            // draw red dot for point and add to coordinate array
            // drawCoordinates(x, y);
            coordinates.push([x, y]);
        }
    }
    timer++;
}

function done(e) {
    ctx.closePath();
    drawing = false;
    mirror();
    finddrawbounds();
}

function finddrawbounds() {
    // loop thru coordinates and find min and max
    drawxmax = coordinates[0][0];
    drawxmin = coordinates[0][0];
    for (var i = 1; i < coordinates.length; i++) {
        if (coordinates[i][0] > drawxmax) {
            drawxmax = coordinates[i][0];
        }
            else {
                if (coordinates[i][0] < drawxmin) {
                    drawxmin = coordinates[i][0];
                }
            }
    }
}

function draw() {
    // draw out all the coordinates
    for (var i = 0; i < coordinates.length; i++) {
        drawCoordinates(coordinates[i][0], coordinates[i][1]);
    }

    // connect to other dots
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (var j = 0; j < coordinates.length; j++) {
        ctx.moveTo(coordinates[j][0], coordinates[j][1]);
        ctx.lineTo(coordinates[j + 1][0], coordinates[j + 1][1]);
        ctx.stroke();
    }
    ctx.closePath();
}




// mouse clicks will draw points
canvas.addEventListener("mousedown", clicked);
canvas.addEventListener("mousemove", moved);
canvas.addEventListener("mouseup", done);

draw();