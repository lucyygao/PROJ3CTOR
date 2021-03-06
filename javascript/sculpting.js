var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var coordinates2 = [];
var drawing2 = false;
var timer2 = 0;
var wasoutside2 = false;
var ymin = 0;
var ymax = 0;
var sculptxmax = 0;
var sculptxmin = 0;
var sculptymax = 0;
var sculptymin = 0;

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
                ctx2.lineWidth = 3;
                sculptclicked(e);
                wasoutside2 = false;
            }
            else {
                ctx2.lineTo(x, y);
                ctx2.stroke();
                ctx2.moveTo(x, y);
            }


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
    findsculptbounds();
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

function findsculptbounds() {
    // loop thru coordinates and find min and max
    sculptxmax = coordinates2[0][0];
    sculptxmin = coordinates2[0][0];
    sculptymax = coordinates2[0][1];
    sculptymin = coordinates2[0][1];
    for (var i = 1; i < coordinates2.length; i++) {
        if (coordinates2[i][0] > sculptxmax) {
            sculptxmax = coordinates2[i][0];
        }
            else {
                if (coordinates2[i][0] < sculptxmin) {
                    sculptxmin = coordinates2[i][0];
                }
            }
        if (coordinates2[i][1] > sculptymax) {
            sculptymax = coordinates2[i][1];
        }
        else {
            if (coordinates2[i][1] < sculptymin) {
                sculptymin = coordinates2[i][1];
            }
        }
    }
}

function mirror() {
    ymax = coordinates[0][1];
    ymin = coordinates[0][1];
    var ycurr;
    for (var i = 0; i < coordinates.length; i++) {
        ycurr = coordinates[i][1];
        if (ycurr > ymax) {
            ymax = ycurr;
        }
        else {
            if (ycurr < ymin) {
                ymin = ycurr;
            }
        }
    }
    ctx2.beginPath();
    ctx2.lineWidth = 1;
    ctx2.globalAlpha = 0.2;
    ctx2.fillStyle = "gray";
    // ctx2.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx2.setLineDash([6]);
    ctx2.fillRect(0, ymin, canvas2.width, ymax - ymin);

    ctx2.globalAlpha = 1;
    ctx2.strokeRect(0, ymin, canvas2.width, ymax - ymin);
}

// mouse clicks will draw points
canvas2.addEventListener("mousedown", sculptclicked);
canvas2.addEventListener("mousemove", sculptmoved);
canvas2.addEventListener("mouseup", sculptdone);

sculptdraw();