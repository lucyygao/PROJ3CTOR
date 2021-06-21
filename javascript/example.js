var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/6, Math.PI/3, 30, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    light.intensity = 0.7;

    // screens
    // const screen1 = BABYLON.MeshBuilder.CreateBox("screen1", {width: 0.1, height: 6, depth: 6}, scene);
    // screen1.rotation.z = Math.PI / 2;

    // const screen2 = BABYLON.MeshBuilder.CreateBox("screen2", {width: 0.1, height: 6, depth: 6}, scene);
    // screen2.rotation.x = Math.PI / 2;
    // screen2.position.x = -3.2;
    // screen2.position.y = 3.2;

    // var mesh = BABYLON.MeshBuilder.CreateIcoSphere("sphere", {radius: 1}, scene);
    // mesh.position.y = 2;

    // // facets
    // mesh.updateFacetData();
    // var facets = mesh.getFacetLocalPositions();
    // var normals = mesh.getFacetLocalNormals();
    // var facetpoints = [];
    // for (var i = 0; i < facets.length; i++) {
    //     var line = [facets[i], facets[i].add(normals[i])];
    //     facetpoints.push(line);
    // }
    // var lines = BABYLON.MeshBuilder.CreateLineSystem("lines", {lines: facetpoints}, scene);
    // lines.color = BABYLON.Color3.Teal();
    // lines.position.y = 2;

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

    // BABYLON.SceneLoader.ImportMesh("", "/scenes/", "skull.babylon", scene, function (newMeshes) {
    //     // Set the target of the camera to the first imported mesh
    //     camera.target = newMeshes[0];
    //     scene.defaultMaterial.backFaceCulling = false;

    //     scene.clipPlane4 = new BABYLON.Plane(0, 1, 0, 0);
    //     scene.clipPlane3 = new BABYLON.Plane(1, 0, 0, -20);
    // });
    // var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // var panel = new BABYLON.GUI.StackPanel();
    // panel.width = "220px";
    // panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    // panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    // advancedTexture.addControl(panel);

    // var slider = new BABYLON.GUI.Slider();
    // slider.minimum = -6;
    // slider.maximum = 0;
    // slider.value = -6;
    // slider.height = "20px";
    // slider.width = "200px";
    // slider.color = "violet";
    // slider.onValueChangedObservable.add(function(value) {
    //     scene.clipPlane4 = new BABYLON.Plane(0, 1, 0, value);
    // });
    // panel.addControl(slider);

    // slider = new BABYLON.GUI.Slider();
    // slider.minimum = -10;
    // slider.maximum = 0;
    // slider.value = -10;
    // slider.paddingTop = "10px";
    // slider.height = "30px";
    // slider.width = "200px";
    // slider.color = "violet";
    // slider.onValueChangedObservable.add(function(value) {
    //     scene.clipPlane3 = new BABYLON.Plane(1, 0, 0, value);
    // });
    // panel.addControl(slider);

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