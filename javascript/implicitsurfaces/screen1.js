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
        // add coordinates to array
        if (timer % 2 == 0) {
            coordinates.push([x, y]);
        }
        timer++;
    }
}

function done(e) {
    ctx.closePath();
    ctx.fill();
    drawing = false;
    mirror();
    updatecoords();
}

function updatecoords() {
    var pixel;
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

function selectclicked(e) {
    canvas.style.cursor = crosshair;

}

function selectmoved(e) {

}

function selectdone(e) {

}


initialize();
// mouse clicks will draw points
canvas.addEventListener("pointerdown", clicked);
canvas.addEventListener("pointermove", moved);
canvas.addEventListener("pointerup", done);