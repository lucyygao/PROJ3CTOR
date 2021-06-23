var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 20, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    camera.setTarget(new BABYLON.Vector3(-400/70, -400/70, 0));
    light.intensity = 0.7;

    return scene;
};


var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();
var numshapes = 0;
var numshapes2 = 0;
var shape = [];
var path = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 5)
];
var wireframe = new BABYLON.Mesh("wireframe", scene);
var material = new BABYLON.StandardMaterial("material", scene);
material.backFaceCulling = false;
// wireframe.material = material;

engine.runRenderLoop(function() {
    if (coordinates.length > numshapes) {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2}, scene);
        sphere.position.x = -1 * coordinates[coordinates.length - 1][0] / 70;
        sphere.position.y = -1 * coordinates[coordinates.length - 1][1] / 70;
        var vec = new BABYLON.Vector3(sphere.position.x, sphere.position.y, 0);
        shape.push(vec);
        var wireframe = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: shape, path: path, updatable: true}, scene);
        wireframe.wireframe = true;
        wireframe.material = material;

        numshapes++;
    }
    if (coordinates2.length > numshapes2) {
        var box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
        box.position.x = -1 * coordinates2[coordinates2.length - 1][0] / 70;
        box.position.y = -1 * coordinates2[coordinates2.length - 1][1] / 70;
        numshapes2++;
    }




   scene.render();
});

/**
 * extruding polygons https://doc.babylonjs.com/start/chap3/polycar
 * user input https://doc.babylonjs.com/divingDeeper/input/virtualJoysticks
 * meshes https://doc.babylonjs.com/divingDeeper/mesh
 * facets and partitioning - elementary triangles https://doc.babylonjs.com/divingDeeper/mesh/facetData
 * mesh behaviors https://doc.babylonjs.com/divingDeeper/behaviors/meshBehaviors
 * mesh picking https://doc.babylonjs.com/divingDeeper/mesh/interactions/picking_collisions
 * clipping planes https://doc.babylonjs.com/divingDeeper/scene/clipPlanes
 * html web https://doc.babylonjs.com/start/chap1/first_app
 *
 * playground web ver https://playground.babylonjs.com/#9869JE
 */