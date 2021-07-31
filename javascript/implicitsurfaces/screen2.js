var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var hint = hintlayer.getContext('2d');
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

function sculptclicked(e) {
    if (!sculptoutside(e)){
        drawing2 = true;
        var rectangle = canvas2.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        coordinates2.push([x, y]);
        for (var k = 0; k < 100; k++) {
            allcoords[k][Math.floor(y/8)][Math.floor(x/8)] += 1;
        }
        // draw layer
        ctx2.moveTo(x, y);
        ctx2.strokeStyle = 'black';
        ctx2.fillStyle = 'blueviolet';
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
        // connect to previous point
        var rectangle = canvas2.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        if (wasoutside2) {
            done2(e);
            ctx2.moveTo(x, y);
            ctx2.beginPath();
            wasoutside2 = false;
        }
        else {
            ctx2.lineTo(x, y);
            ctx2.stroke();
        }
        // add to coordinates array
        if (timer2 % 2 == 0) {
            coordinates2.push([x, y]);
        }
        timer2++;
    }

}

function sculptdone(e) {
    ctx2.closePath();
    ctx2.fill();
    drawing2 = false;
    sculptupdatecoords();
    createpointcloud();
}

function sculptupdatecoords() {
    var pixel;

    // get every eighth pixel and update matrix
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 50; j++) {
            pixel = ctx2.getImageData(i*8, j*8, 1, 1);

            // add to matrix only if the pixel isn't the default
            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = 0; k < 100; k++) {
                    allcoords[k][j][i] += 1;

                    // remove extra line when overlap
                    if (allcoords[k][j][i] == 3) {
                        for (var remove = 0; remove <= k; remove++) {
                            allcoords[remove][j][i] -= 1;
                        }
                        break;
                    }
                }
            }
        }
    }
}

// add "hint" rectangle box
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
    hint.beginPath();
    hint.lineWidth = 1;
    hint.globalAlpha = 0.2;
    hint.fillStyle = "gray";
    hint.setLineDash([6]);
    hint.fillRect(0, ymin, canvas2.width, ymax - ymin);

    hint.globalAlpha = 1;
    hint.strokeRect(0, ymin, canvas2.width, ymax - ymin);
    hint.closePath();
}

// mouse clicks will draw
canvas2.addEventListener("pointerdown", sculptclicked);
canvas2.addEventListener("pointermove", sculptmoved);
canvas2.addEventListener("pointerup", sculptdone);