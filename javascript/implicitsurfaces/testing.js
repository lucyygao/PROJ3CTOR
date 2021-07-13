var allcoords = [];
function initialize() {
    var x = [];
    var y = [];
    var z = [];
    for (var i = 0; i < 800; i++) {
        z.push(0);
    }
    for (var i = 0; i < 400; i++) {
        y.push(z.slice());
    }
    for (var i = 0; i < 800; i++) {
        allcoords.push(y.slice());
    }
    allcoords[5][10][10] = 1;
    // allcoords.push(new Array(800).fill(new Array(400).fill(new Array(800).fill(0))));
    console.table(allcoords[5][11]);
}
initialize();