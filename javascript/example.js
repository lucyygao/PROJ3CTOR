var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    light.intensity = 0.7;

    // screens
    const screen1 = BABYLON.MeshBuilder.CreateBox("screen1", {width: 0.1, height: 6, depth: 6}, scene);
    screen1.rotation.z = Math.PI / 2;

    const screen2 = BABYLON.MeshBuilder.CreateBox("screen2", {width: 0.1, height: 6, depth: 6}, scene);
    screen2.rotation.x = Math.PI / 2;
    screen2.position.x = -3.2;
    screen2.position.y = 3.2;

    var mesh = BABYLON.MeshBuilder.CreateIcoSphere("sphere", {radius: 1}, scene);
    mesh.position.y = 2;

    // facets
    mesh.updateFacetData();
    var facets = mesh.getFacetLocalPositions();
    var normals = mesh.getFacetLocalNormals();
    var facetpoints = [];
    for (var i = 0; i < facets.length; i++) {
        var line = [facets[i], facets[i].add(normals[i])];
        facetpoints.push(line);
    }
    var lines = BABYLON.MeshBuilder.CreateLineSystem("lines", {lines: facetpoints}, scene);
    lines.color = BABYLON.Color3.Teal();
    lines.position.y = 2;

    return scene;
};


var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();
engine.runRenderLoop(function() {
   scene.render();
});

/**
 * extruding polygons https://doc.babylonjs.com/start/chap3/polycar
 * user input https://doc.babylonjs.com/divingDeeper/input/virtualJoysticks
 * meshes https://doc.babylonjs.com/divingDeeper/mesh
 * facets and partitioning - elementary triangles https://doc.babylonjs.com/divingDeeper/mesh/facetData
 * mesh behaviors https://doc.babylonjs.com/divingDeeper/behaviors/meshBehaviors
 */