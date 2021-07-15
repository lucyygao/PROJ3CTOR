var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var coordinates = [];
var drawing = false;
var wasoutside = false;
var drawxmax = 0;
var drawxmin = 0;
var allcoords = [];

// 800 x 400 x 800 - divide all by 8
function initialize() {
    var x = [];
    var y = [];
    var z = [];
    for (var i = 0; i < 100; i++) {
        z.push(0);
    }
    for (var i = 0; i < 50; i++) {
        y.push(z.slice());
    }
    for (var i = 0; i < 100; i++) {
        allcoords.push(y.slice());
    }
}

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
        ctx.fillStyle = 'blueviolet';
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
        var rectangle = canvas.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        if (wasoutside) {
            done();
            ctx.moveTo(x, y);
            ctx.beginPath();
            wasoutside = false;
        }
        else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // add coordinates to 3d array
        coordinates.push([x, y]);
    }
}

function done(e) {
    ctx.closePath();
    ctx.fill();
    drawing = false;
    mirror();
    // finddrawbounds();
    updatecoords();
}

// function finddrawbounds() {
//     // loop thru coordinates and find min and max
//     drawxmax = coordinates[0][0];
//     drawxmin = coordinates[0][0];
//     for (var i = 1; i < coordinates.length; i++) {
//         if (coordinates[i][0] > drawxmax) {
//             drawxmax = coordinates[i][0];
//         }
//             else {
//                 if (coordinates[i][0] < drawxmin) {
//                     drawxmin = coordinates[i][0];
//                 }
//             }
//     }
// }

function updatecoords() {
    var pixel;
    for (var i = 0; i < 800; i += 8) {
        for (var j = 0; j < 400; j += 8) {
            pixel = ctx.getImageData(i, j, 1, 1);
            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = 0; k < 800; k += 8) {
                    allcoords[i/8][j/8][k/8] += 1;
                }
            }
        }
    }
}

initialize();
// mouse clicks will draw points
canvas.addEventListener("mousedown", clicked);
canvas.addEventListener("mousemove", moved);
canvas.addEventListener("mouseup", done);

// draw();