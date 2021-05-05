// drawCoordinates from https://ourcodeworld.com/articles/read/49/draw-points-on-a-canvas-with-javascript-html5
// need to add lines, change dots to specific ones
// combine with triangulation.js

// x array and y array to hold all points
// every three points is a triangle (point1, point2, point3)
var x = [150, 170, 200];
var y = [150, 200, 150];


function drawCoordinates(x,y){
    var pointSize = 3;
    var ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = "#ff2626";

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

function displayTri(index) {
    triangle = index * 3;
    drawCoordinates(x[triangle], y[triangle]);
    drawCoordinates(x[triangle + 1], y[triangle + 1]);
    drawCoordinates(x[triangle + 2], y[triangle + 2]);

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // draw triangle
    ctx.beginPath();
    ctx.moveTo(x[triangle], y[triangle]);
    ctx.lineTo(x[triangle + 1], y[triangle + 1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x[triangle + 1], y[triangle + 1]);
    ctx.lineTo(x[triangle + 2], y[triangle + 2]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x[triangle + 2], y[triangle + 2]);
    ctx.lineTo(x[triangle], y[triangle]);
    ctx.stroke();
}

function findSuperTriangle() {
    var xmin = x[0];
    var xmax = x[0];
    var ymin = y[0];
    var ymax = y[0];

    for (var i = 1; i < points.length; i++) {
        var xcurr = x[i];
        var ycurr = y[i];
        if (xcurr < xmin) {
            xmin = xcurr;
        }
        if (xcurr > xmax) {
            xmax = xcurr;
        }
        if (ycur < ymin) {
            ymin = curr;
        }
        if (ycurr > ymax) {
            ymax = ycurr;
        }
    }
    x[0] = 30;

    x.push(xmin - 5);
    x.push(xmax + 5);
    x.push((xmax - xmin)/2);
    y.push(ymin - 5);
    y.push(ymin - 5);
    y.push(ymax + 5);
}

displayTri(0);
findSuperTriangle();
displayTri(0);