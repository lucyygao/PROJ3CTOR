var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 20, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    camera.setTarget(new BABYLON.Vector3(-400/70, -400/70, 0));
    light.intensity = 0.7;

    // GUI
    var UI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", "Wireframe");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "gray";
    button.left = "-280px";
    button.top = "350px";
    button.onPointerClickObservable.add(function() {
        if (button.children[0].text == "Wireframe") {
            button.children[0].text = "Solid";
            material.wireframe = false;
        }
        else {
            if (button.children[0].text == "Solid") {
                button.children[0].text = "Invisible";
                material.alpha = 0;
            }
            else {
                button.children[0].text = "Wireframe";
                material.wireframe = true;
                material.alpha = 1;
            }

        }
    });

    UI.addControl(button);
    return scene;
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();
var numshapes = 0;
var numshapes2 = 0;
var frontshape = [];
var sideshape = [];
var frontpath = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 800/70)
];
var sidepath = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(-800/70, 0, 0)
];
var material = new BABYLON.StandardMaterial("material", scene);
material.backFaceCulling = false;
material.wireframe = true;
var blue = new BABYLON.StandardMaterial("bluematerial", scene);
blue.diffuseColor = new BABYLON.Color3(0, 0, 1);
var red = new BABYLON.StandardMaterial("redmaterial", scene);
red.diffuseColor = new BABYLON.Color3(1, 0, 0);

engine.runRenderLoop(function() {
    if (coordinates.length > numshapes) {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2}, scene);
        sphere.position.x = -1 * coordinates[coordinates.length - 1][0] / 70;
        sphere.position.y = -1 * coordinates[coordinates.length - 1][1] / 70;
        var vec = new BABYLON.Vector3(sphere.position.x, sphere.position.y, 0);
        frontshape.push(vec);
        var extruded = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: frontshape, path: frontpath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
        extruded.material = material;

        numshapes++;
    }
    if (coordinates2.length > numshapes2) {
        var box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
        box.position.z = coordinates2[coordinates2.length - 1][0] / 70;
        box.position.y = -1 * coordinates2[coordinates2.length - 1][1] / 70;
        var vector = new BABYLON.Vector3(box.position.z, box.position.y, 0);
        sideshape.push(vector);
        var sideextrude = BABYLON.MeshBuilder.ExtrudeShape("side extrusion", {shape: sideshape, path: sidepath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
        sideextrude.material = material;
        box.isPickable = false;
        sideextrude.isPickable = false;

        var dir = new BABYLON.Vector3(-1, 0, 0);
        // out = BABYLON.Vector3.TransformCoordinates(out, box.getWorldMatrix());
        // var dir = out.subtract(box.position);
        var ray = new BABYLON.Ray(box.position, dir, 10);
        // var rayHelper = new BABYLON.RayHelper(ray);
		// rayHelper.show(scene);
        var hit = scene.multiPickWithRay(ray);
        if (hit) {
            for (var i = 0; i < hit.length; i++) {
                var collision = BABYLON.MeshBuilder.CreateSphere("collisiondot", {diameter: 0.2}, scene);
                collision.position = hit[i].pickedPoint;
                collision.material = red;
            }
        }

        numshapes2++;
    }

    // if there's input on both screens
    if (drawxmax != 0 && sculptxmax != 0) {
        // find and draw edge points?
        var dot1 = BABYLON.MeshBuilder.CreateSphere("dot1", {diameter: 0.2}, scene);
        var dot2 = BABYLON.MeshBuilder.CreateSphere("dot2", {diameter: 0.2}, scene);
        var dot3 = BABYLON.MeshBuilder.CreateSphere("dot3", {diameter: 0.2}, scene);
        var dot4 = BABYLON.MeshBuilder.CreateSphere("dot4", {diameter: 0.2}, scene);
        var dot5 = BABYLON.MeshBuilder.CreateSphere("dot5", {diameter: 0.2}, scene);
        var dot6 = BABYLON.MeshBuilder.CreateSphere("dot6", {diameter: 0.2}, scene);
        var dot7 = BABYLON.MeshBuilder.CreateSphere("dot7", {diameter: 0.2}, scene);
        var dot8 = BABYLON.MeshBuilder.CreateSphere("dot8", {diameter: 0.2}, scene);

        dot1.position.x = -1 * drawxmin/70;
        dot2.position.x = -1 * drawxmax/70;
        dot3.position.x = -1 * drawxmax/70;
        dot4.position.x = -1 * drawxmin/70;
        if (ymin > sculptymin) {
            dot1.position.y = -1 * ymin/70;
            dot2.position.y = -1 * ymin/70;
            dot3.position.y = -1 * ymin/70;
            dot4.position.y = -1 * ymin/70;
        }
        else {
            dot1.position.y = -1 * sculptymin/70;
            dot2.position.y = -1 * sculptymin/70;
            dot3.position.y = -1 * sculptymin/70;
            dot4.position.y = -1 * sculptymin/70;
        }
        dot1.position.z = sculptxmin/70;
        dot2.position.z = sculptxmin/70;
        dot3.position.z = sculptxmax/70;
        dot4.position.z = sculptxmax/70;

        dot5.position.x = -1 * drawxmin/70;
        dot6.position.x = -1 * drawxmax/70;
        dot7.position.x = -1 * drawxmax/70;
        dot8.position.x = -1 * drawxmin/70;
        if (ymax < sculptymax) {
            dot5.position.y = -1 * ymax/70;
            dot6.position.y = -1 * ymax/70;
            dot7.position.y = -1 * ymax/70;
            dot8.position.y = -1 * ymax/70;
        }
        else {
            dot5.position.y = -1 * sculptymax/70;
            dot6.position.y = -1 * sculptymax/70;
            dot7.position.y = -1 * sculptymax/70;
            dot8.position.y = -1 * sculptymax/70;
        }
        dot5.position.z = sculptxmin/70;
        dot6.position.z = sculptxmin/70;
        dot7.position.z = sculptxmax/70;
        dot8.position.z = sculptxmax/70;

        // add color to distinguish
        dot1.material = blue;
        dot2.material = blue;
        dot3.material = blue;
        dot4.material = blue;
        dot5.material = blue;
        dot6.material = blue;
        dot7.material = blue;
        dot8.material = blue;
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

