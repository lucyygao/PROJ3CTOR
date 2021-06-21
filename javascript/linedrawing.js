var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var coordinates = [];
var drawing = false;
var timer = 0;

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
    drawing = true;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    // coordinates.push([x, y]);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(x, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // draw();
}

function moved(e) {
    if (drawing) {
        // draw a dot every so often
        if (timer % 5 == 0) {
            // connect to previous point
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.moveTo(x, y);

            // connect to two random other points
            // var index1 = Math.floor(Math.random() * coordinates.length);
            // var index2 = Math.floor(Math.random() * coordinates.length);
            // ctx.lineTo(coordinates[index1][0], coordinates[index1][1]);
            // ctx.stroke();
            // ctx.moveTo(e.clientX, e.clientY);
            // ctx.lineTo(coordinates[index2][0], coordinates[index2][1]);
            // ctx.stroke();
            // ctx.moveTo(e.clientX, e.clientY);

            // draw red dot for point and add to coordinate array

            drawCoordinates(x, y);
            coordinates.push([x, y]);
        }
    }
    timer++;
}

function done(e) {
    ctx.closePath();
    drawing = false;
}

// supertriangle
function findSuperTriangle(p1, p2, p3) {
    // find small rectangle that has all 3 points on edges
    var array = [p1, p2, p3];
    var xmax = array[0][0];
    var xmin = array[0][0];
    var ymax = array[0][1];
    var ymin = array[0][1];

    for (var i = 0; i < array.length; i++) {
        if (array[i][0] > xmax) {
            xmax = array[i][0];
        }
        else if (array[i][0] < xmin) {
            xmin = array[i][0];
        }

        if (array[i][1] > ymax) {
            ymax = array[i][1];
        }
        else if (array[i][1] < ymin) {
            ymin = array[i][1];
        }
    }

    // small hypotenuse

}

// triangulation
// console.time('delaunay');
// var delaunay = Delaunator.from(coordinates);
// console.timeEnd('delaunay');
// var triangles = delaunay.triangles;

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
        // ctx.beginPath();
        // ctx.moveTo(coordinates[j + 1][0], coordinates[j + 1][1]);
        // ctx.lineTo(coordinates[j + 2][0], coordinates[j + 2][1]);
        // ctx.stroke();
        // // ctx.beginPath();
        // ctx.moveTo(coordinates[j + 2][0], coordinates[j + 2][1]);
        // ctx.lineTo(coordinates[j][0], coordinates[j][1]);
        // ctx.stroke();
    }
    ctx.closePath();
}

// mouse clicks will draw points
document.addEventListener("mousedown", clicked);
document.addEventListener("mousemove", moved);
document.addEventListener("mouseup", done);

draw();