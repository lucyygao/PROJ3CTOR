// points array, triangle array
let points = [];
let triangles = [];

// triangle object
var Triangle = {
    point1: [0, 0],
    point2: [0, 0],
    point3: [0, 0]
};

// functions -
function initializePoints(pts) {
    points = pts;
}

function findSuperTriangle() {
    let xmin = points[0];
    let xmax = points[0];
    let ymin = points[0];
    let ymax = points[0];

    for (var i = 1; i < points.length; i++) {
        var curr = points[i];
        if (curr[0] < xmin[0]) {
            xmin = curr;
        }
        if (curr[0] > xmax[0]) {
            xmax = curr;
        }
        if (curr[1] < ymin[1]) {
            ymin = curr;
        }
        if (curr[1] > ymax[1]) {
            ymax = curr;
        }
    }

    var tri = new Triangle();
    tri.point1 = [xmin - 5, ymin - 5];
    tri.point2 = [xmax + 5, ymin - 5];
    tri.point3 = [(xmax - xmin)/2, ymax + 5];

    return tri;
}

function findCircumcircleCenter() {

}

function findRadius() {

}

// figure out displaying in browser