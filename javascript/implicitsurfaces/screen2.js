var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var hint = hintlayer.getContext('2d');
var sculptselect = sculptselectlayer.getContext('2d');
var coordinates2 = [];
var sculptselected = [];
var drawing2 = false;
var sculptselecting = false;
var timer2 = 0;
var prevlen2 = 0;
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
        // for (var k = 0; k < 100; k++) {
        //     allcoords[k][Math.floor(y/8)][Math.floor(x/8)] += 2;
        // }
        // draw layer
        ctx2.moveTo(x, y);
        if (sculptselected.length > 0) {
            ctx2.globalAlpha = 0.4;
            ctx2.strokeStyle = 'greenyellow';
            ctx2.fillStyle = 'green';
        }
        else {
            ctx2.globalAlpha = 1;
            ctx2.strokeStyle = 'black';
            ctx2.fillStyle = 'blueviolet';
        }
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

    // extra check if there's a selection
    if (sculptselected.length > 0) {
        var xmin = sculptselected[0];
        var xmax = sculptselected[0] + sculptselected[2];
        var ymin = sculptselected[1];
        var ymax = sculptselected[1] + sculptselected[3];

        if (x < xmin || x > xmax || y < ymin || y > ymax) {
            return true;
        }
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
    if (coordinates2.length != prevlen2) {
        sculptupdatecoords();
        createpointcloud();
    }
    prevlen2 = coordinates2.length;
}

function sculptupdatecoords() {
    var pixel;
    var zmin = 0;
    var zmax = 100;
    var ymin = 0;
    var ymax = 50;
    var xmin = 0;
    var xmax = 100;

    if (sculptselected.length > 0) {
        var zmin = Math.floor(sculptselected[0]/8);
        var zmax = Math.floor((sculptselected[0] + sculptselected[2])/8);
        var ymin = Math.floor(sculptselected[1]/8);
        var ymax = Math.floor((sculptselected[1] + sculptselected[3])/8);
    }

    if (selected.length > 0) {
        var xmin = Math.floor(selected[0]/8);
        var xmax = Math.floor((selected[0] + selected[2])/8);

        if (sculptselected.length > 0) {
            if (selected[1] < sculptselected[1]) {
                ymin = Math.floor(selected[1]/8);
            }
            if (selected[1] + selected[3] < sculptselected[1] + sculptselected[3]) {
                ymax = Math.floor((selected[1] + selected[3])/8);
            }
        }
        else {
            ymin = Math.floor(selected[1]/8);
            ymax = Math.floor((selected[1] + selected[3])/8);
        }
    }

    console.log(xmin + " " + xmax + " " + ymin + " " + ymax + " " + zmin + " " + zmax);


    // get every eighth pixel and update matrix
    for (var i = zmin; i < zmax; i++) {
        for (var j = ymin; j < ymax; j++) {
            pixel = ctx2.getImageData(i*8, j*8, 1, 1);

            // add to matrix only if the pixel isn't the default
            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = xmin; k < xmax; k++) {
                    allcoords[k][j][i] += 2;

                    // // remove extra line when overlap
                    // if (allcoords[k][j][i] == 3) {
                    //     for (var remove = 0; remove <= k; remove++) {
                    //         allcoords[remove][j][i] -= 1;
                    //     }
                    //     break;
                    // }
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

function selectsculptclicked(e) {
    canvas2.style.cursor = "crosshair";
    sculptselected = [];
    sculptselecting = true;

    // clear prev selections
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.globalAlpha = 1;
    ctx2.strokeStyle = 'black';
    ctx2.fillStyle = 'blueviolet';
    ctx2.moveTo(coordinates2[0][0], coordinates2[0][1]);
    ctx2.beginPath();
    for (var i = 1; i < coordinates2.length; i++) {
        ctx2.lineTo(coordinates2[i][0], coordinates2[i][1]);
        ctx2.stroke();
    }
    ctx2.closePath();
    ctx2.fill();

    var rectangle = sculptselectlayer.getBoundingClientRect();
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    sculptselected.push(x, y);
    sculptselect.strokeStyle = 'green';
    sculptselect.beginPath();
}

function selectsculptmoved(e) {
    if (sculptselecting) {
        var rectangle = sculptselectlayer.getBoundingClientRect();
        if (sculptselected.length > 2) {
            sculptselected.pop();
            sculptselected.pop();
        }
        var width = e.clientX - rectangle.left - sculptselected[0];
        var height = e.clientY - rectangle.top - sculptselected[1];
        sculptselected.push(width, height);
        sculptselect.clearRect(0, 0, sculptselectlayer.width, sculptselectlayer.height);
        sculptselect.strokeRect(sculptselected[0], sculptselected[1], width, height);
    }
}

function selectsculptdone(e) {
    ctx2.strokeStyle = 'greenyellow';
    ctx2.strokeRect(sculptselected[0], sculptselected[1], sculptselected[2], sculptselected[3]);
    canvas2.style.cursor = "auto";
    sculptselecting = false;
    // modify();

    if (selected.length > 0 && sculptselected.length > 0) {
        setupboxes();
    }

    sculptselect.closePath();
}

// mouse clicks will draw
canvas2.addEventListener("pointerdown", sculptclicked);
canvas2.addEventListener("pointermove", sculptmoved);
canvas2.addEventListener("pointerup", sculptdone);