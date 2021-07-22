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
        for (var k = 0; k < 100; k++) {
            allcoords[k][Math.floor(y/8)][Math.floor(x/8)] += 1;
        }
        // drawCoordinates(x, y);
        // ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

        // draw layer
        ctx2.moveTo(x, y);
        ctx2.strokeStyle = 'black';
        ctx2.fillStyle = 'blueviolet';
        ctx2.lineWidth = 1;
        ctx2.beginPath();
        ctx2.lineTo(x, y);
        ctx2.stroke();

        // hint layer
        // hint.moveTo(x, y);
        // hint.strokeStyle = 'black';
        // hint.fillStyle = 'blueviolet';
        // hint.lineWidth = 1;
        // hint.beginPath();
        // hint.lineTo(x, y);
        // hint.stroke();
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
        if (timer2 % 3 == 0) {
            // connect to previous point
            var rectangle = canvas2.getBoundingClientRect();
            var x = e.clientX - rectangle.left;
            var y = e.clientY - rectangle.top;
            if (wasoutside2) {
                // sculptclicked(e);
                done2(e);
                ctx2.moveTo(x, y);
                ctx2.beginPath();
                // hint.moveTo(x, y);
                // hint.beginPath();
                wasoutside2 = false;
            }
            else {
                ctx2.lineTo(x, y);
                ctx2.stroke();
                // hint.lineTo(x, y);
                // hint.stroke();
                // ctx2.moveTo(x, y);
            }
            // add to coordinates array
            coordinates2.push([x, y]);
            // for (var k = 0; k < 100; k++) {
            //     allcoords[k][Math.floor(y/8)][Math.floor(x/8)] += 1;
            // }
        }
        timer2++;
    }

}

function sculptdone(e) {
    ctx2.closePath();
    ctx2.fill();
    // hint.closePath();
    // hint.fill();
    drawing2 = false;
    // findsculptbounds();
    sculptupdatecoords();
    console.table(allcoords);
    console.log("beet");
    createmesh();
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
    // hint.beginPath();
    // hint.strokeStyle = 'black';
    // hint.lineWidth = 1;
    for (var j = 0; j < coordinates2.length; j++) {
        ctx2.moveTo(coordinates2[j][0], coordinates2[j][1]);
        ctx2.lineTo(coordinates2[j + 1][0], coordinates2[j + 1][1]);
        ctx2.stroke();
        // hint.moveTo(coordinates2[j][0], coordinates2[j][1]);
        // hint.lineTo(coordinates2[j + 1][0], coordinates2[j + 1][1]);
        // hint.stroke();
    }
    ctx2.closePath();
    // hint.closePath();
}

// function findsculptbounds() {
//     // loop thru coordinates and find min and max
//     sculptxmax = coordinates2[0][0];
//     sculptxmin = coordinates2[0][0];
//     sculptymax = coordinates2[0][1];
//     sculptymin = coordinates2[0][1];
//     for (var i = 1; i < coordinates2.length; i++) {
//         if (coordinates2[i][0] > sculptxmax) {
//             sculptxmax = coordinates2[i][0];
//         }
//             else {
//                 if (coordinates2[i][0] < sculptxmin) {
//                     sculptxmin = coordinates2[i][0];
//                 }
//             }
//         if (coordinates2[i][1] > sculptymax) {
//             sculptymax = coordinates2[i][1];
//         }
//         else {
//             if (coordinates2[i][1] < sculptymin) {
//                 sculptymin = coordinates2[i][1];
//             }
//         }
//     }
// }

function sculptupdatecoords() {
    var pixel;

    // var z;
    // var y;
    // for (var i = 0; i < coordinates2.length; i++) {
    //     z = coordinates2[i][0];
    //     y = coordinates2[i][1];
    //     for (var k = 0; k < 100; k++) {
    //         allcoords[k][Math.floor(y/8)][Math.floor(z/8)] += 1;
    //     }
    // }

    for (var i = 0; i < 800; i += 8) {
        for (var j = 0; j < 400; j += 8) {
            pixel = ctx2.getImageData(i, j, 1, 1);
            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = 0; k < 100; k++) {
                    allcoords[k][Math.round(j/8)][Math.round(i/8)] += 1;
                }
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
canvas2.addEventListener("mousedown", sculptclicked);
canvas2.addEventListener("mousemove", sculptmoved);
canvas2.addEventListener("mouseup", sculptdone);

// hintlayer.addEventListener("mousedown", sculptclicked);
// hintlayer.addEventListener("mousemove", sculptmoved);
// hintlayer.addEventListener("mouseup", sculptdone);

sculptdraw();