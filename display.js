// createDot from https://jsfiddle.net/Cs4hK/
// need to add lines, change dots to specific ones
// combine with triangulation.js

var Triangle = {
    point1: [150, 150],
    point2: [170, 200],
    point3: [200, 150],
};

function createDot(x, y) {
    var elem=document.createElement("div");
    elem.setAttribute("class", "dot");
    elem.setAttribute("style", "left:"+x+"px;top:"+y+"px;");
    document.getElementsByTagName("body")[0].appendChild(elem);
    return elem;
}

function displayTri(triangle) {
    createDot(Triangle.point1[0], Triangle.point1[1]);
    createDot(Triangle.point2[0], Triangle.point2[1]);
    createDot(Triangle.point3[0], Triangle.point3[1]);

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // draw triangle - WHY IS THIS OFFSET???
    ctx.beginPath();
    ctx.moveTo(Triangle.point1[0], Triangle.point1[1]);
    ctx.lineTo(Triangle.point2[0], Triangle.point2[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(Triangle.point2[0], Triangle.point2[1]);
    ctx.lineTo(Triangle.point3[0], Triangle.point3[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(Triangle.point3[0], Triangle.point3[1]);
    ctx.lineTo(Triangle.point1[0], Triangle.point1[1]);
    ctx.stroke();
}

// var tri = new Triangle();
displayTri();
var tri2 = new Triangle();