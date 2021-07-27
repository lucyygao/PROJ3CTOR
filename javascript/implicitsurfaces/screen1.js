var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var coordinates = [];
var drawing = false;
var wasoutside = false;
var drawxmax = 0;
var drawxmin = 0;
var allcoords = [];
var timer = 0;

// 800 x 400 x 800 - divide all by 8
function initialize() {
    allcoords = Array(100).fill().map(() => Array(50).fill().map(() => Array(100).fill(0)));
    console.table(allcoords);
    console.log("reet");
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
        for (var k = 0; k < 100; k++) {
            allcoords[Math.floor(x/8)][Math.floor(y/8)][k] += 1;
        }
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
        if (timer % 3 == 0) {
            var rectangle = canvas.getBoundingClientRect();
            var x = e.clientX - rectangle.left;
            var y = e.clientY - rectangle.top;
            if (wasoutside) {
                // clicked(e);
                done();
                ctx.moveTo(x, y);
                ctx.beginPath();
                wasoutside = false;
            }
            else {
                ctx.lineTo(x, y);
                ctx.stroke();
                // ctx.moveTo(x, y);
            }
            // add coordinates to array
            coordinates.push([x, y]);
            // for (var k = 0; k < 100; k++) {
            //     allcoords[Math.floor(x/8)][Math.floor(y/8)][k] += 1;
            // }
        }
        timer++;
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

    // var x;
    // var y;
    // for (var i = 0; i < coordinates.length; i++) {
    //     x = coordinates[i][0];
    //     y = coordinates[i][1];
    //     for (var k = 0; k < 100; k++) {
    //         allcoords[Math.floor(x/8)][Math.floor(y/8)][k] += 1;
    //     }
    // }

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 50; j++) {
            pixel = ctx.getImageData(i*8, j*8, 1, 1);
            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = 0; k < 100; k++) {
                    allcoords[i][j][k] = 1;
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