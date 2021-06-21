var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/6, Math.PI/3, 30, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    light.intensity = 0.7;

    // create a shape - these points need to be in the connecting order
    const shape = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 5, 0),
        new BABYLON.Vector3(5, 5, 0),
        new BABYLON.Vector3(5, 0, 0)
    ];

    shape.push(shape[0]);

    // create extrusion path
    const path = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 5)
    ];

    const extrusion = BABYLON.MeshBuilder.ExtrudeShape("square", {shape: shape, path: path, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: BABYLON.Mesh.CAP_ALL}, scene)

    // create a shape - these points need to be in the connecting order
    const shape2 = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 5, 0),
        new BABYLON.Vector3(5, 5, 0),
        new BABYLON.Vector3(5, 0, 0)
    ];

    shape2.push(shape2[0]);

    // create extrusion path
    const path2 = [
        new BABYLON.Vector3(0, 1, 1),
        new BABYLON.Vector3(10, 1, 1)
    ];

    const extrusion2 = BABYLON.MeshBuilder.ExtrudeShape("square2", {shape: shape2, path: path2, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: BABYLON.Mesh.CAP_ALL}, scene)

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
 * mesh picking https://doc.babylonjs.com/divingDeeper/mesh/interactions/picking_collisions
 * clipping planes https://doc.babylonjs.com/divingDeeper/scene/clipPlanes
 * html web https://doc.babylonjs.com/start/chap1/first_app
 *
 * playground web ver https://playground.babylonjs.com/#9869JE
 */