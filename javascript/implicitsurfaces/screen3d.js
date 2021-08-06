var createbutton = function(left, top, word) {
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", word);
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "#808090";
    button.left = left;
    button.top = top;
    return button;
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    // const camera = new BABYLON.ArcFollowCamera("camera", 1, 1, 5, new BABYLON.Vector3(0, 0, 0), scene);
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 20, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, -1, 0));
    camera.setTarget(new BABYLON.Vector3(-400/70, -200/70, 400/70));
    light.intensity = 1;

    // Skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../textures/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

    // GUI
    var UI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // changing between wireframe, solid, and invisible mode
    var style = createbutton("-290px", "350px", "Wireframe");
    style.onPointerClickObservable.add(function() {
        if (style.children[0].text == "Wireframe") {
            style.children[0].text = "Solid";
            material.wireframe = false;
        }
        else {
            if (style.children[0].text == "Solid") {
                style.children[0].text = "Invisible";
                material.alpha = 0;
            }
            else {
                style.children[0].text = "Wireframe";
                material.wireframe = true;
                material.alpha = 1;
            }
        }
    });

    // turning skybox on and off
    var skybutton = createbutton("-110px", "350px", "Skybox");
    skybutton.onPointerClickObservable.add(function() {
        if (skybutton.children[0].text == "Skybox") {
            skybutton.children[0].text = "Navy";
            skybox.visibility = false;
        }
        else {
            if (skybutton.children[0].text == "Navy") {
                scene.clearColor = new BABYLON.Color3(0.62, 0.62, 0.69);
                skybutton.children[0].text = "Gray";
            }
            else {
                scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);
                skybutton.children[0].text = "Skybox";
                skybox.visibility = true;
            }

        }
    });

    // changing mesh material
    var matbutton = createbutton("70px", "350px", "Gold");
    matbutton.onPointerClickObservable.add(function() {
        if (matbutton.children[0].text == "Gold") {
            matbutton.children[0].text = "Blue";
            cloud.material = blue;
        }
        else {
            if (matbutton.children[0].text == "Blue") {
                matbutton.children[0].text = "Red";
                cloud.material = red;
            }
            else {
                if (matbutton.children[0].text == "Red") {
                    matbutton.children[0].text = "Silver";
                    cloud.material = silver;
                }
                else {
                    matbutton.children[0].text = "Gold";
                    cloud.material = pbr;
                }
            }
        }
        cloud.material.pointSize = slider.value;
    });

    // deform
    var deformbutton = createbutton("250px", "350px", "No Deform");
    deformbutton.onPointerClickObservable.add(function() {
        if (deformbutton.children[0].text == "No Deform") {
            deformbutton.children[0].text = "Sphere";
            deformsphere();
        }
        else {
            if (deformbutton.children[0].text == "Sphere") {
                deformbutton.children[0].text = "No Deform";
                undodeform();
            }
        }
    });

    // slider to change point size
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.left = "-290px";
    panel.top = "280px";

    var pointsize = new BABYLON.GUI.TextBlock();
    pointsize.text = "Point Size: 5";
    pointsize.height = "30px";
    pointsize.color = "white";
    // pointsize.left = "-290px";
    // pointsize.top = "300px";
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 1;
    slider.maximum = 50;
    slider.value = 5;
    slider.height = "20px";
    slider.width = "160px";
    slider.color = "#808090";
    slider.background = "grey";
    slider.onValueChangedObservable.add(function (value) {
        cloud.material.pointSize = value;
        pointsize.text = "Point Size: " + Math.floor(value);
    });

    // adding everything to UI
    UI.addControl(style);
    UI.addControl(skybutton);
    UI.addControl(matbutton);
    UI.addControl(panel);
    panel.addControl(pointsize);
    panel.addControl(slider);
    UI.addControl(deformbutton);
    return scene;
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();
var numshapes = 0;
var numshapes2 = 0;
var timer = 0;

// extrusions
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

// materials
var material = new BABYLON.StandardMaterial("material", scene);
material.backFaceCulling = false;
material.wireframe = true;
var red = new BABYLON.StandardMaterial("redmaterial", scene);
red.diffuseColor = new BABYLON.Color3(1, 0, 0);
red.pointsCloud = true;
red.pointSize = 10;
red.backFaceCulling = false;
var blue = new BABYLON.StandardMaterial("bluematerial", scene);
blue.pointsCloud = true;
blue.pointSize = 10;
blue.diffuseColor = new BABYLON.Color3(0, 0, 0.5);
blue.backFaceCulling = false;
var pbr = new BABYLON.PBRSpecularGlossinessMaterial("pbr", scene);
pbr.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);
pbr.glossiness = 1.0;
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("../textures/environment.dds", scene);

var silver = new BABYLON.PBRSpecularGlossinessMaterial("silver", scene);
silver.diffuseColor = new BABYLON.Color3(1, 1, 1);
silver.specularColor = new BABYLON.Color3(1, 1, 1);
silver.glossiness = 1.0;
silver.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("../textures/environment.dds", scene);
silver.pointsCloud = true;
silver.pointSize = 10;
silver.backFaceCulling = false;



// normals and mesh creation
var cloud = new BABYLON.Mesh("cloud", scene);
var positions = [];
var indices = [];
var normals = [];

var initpos = [];
var initnorm = [];

var createpointcloud = function() {
    var p = 0;
    // go through allcoords matrix to find particle positions
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 50; j++) {
            for (var k = 0; k < 100; k++) {
                // must have value of 2 (double intersection) and on the surface
                if (allcoords[i][j][k] == 2 && isedge(i, j, k)) {
                    positions.push(-8 * i / 70, -8 * j / 70,  8 * k / 70);
                    indices.push(p);
                    var norm = calculatenormal(i, j, k);
                    normals.push(norm.x, norm.y, norm.z);
                    p++;
                }
            }
        }
    }

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.applyToMesh(cloud, true);
    cloud.material = pbr;
    cloud.material.pointsCloud = true;
    cloud.material.pointSize = 10;
    cloud.material.backFaceCulling = false;

    initpos = [...positions];
    initnorm = [...normals];

    // camera.setTarget(cloud);
}

var deformsphere = function() {
    var pos = cloud.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var norms = cloud.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var xmin = pos[0];
    var xmax = pos[0];
    var ymin = pos[1];
    var ymax = pos[1];
    for (var i = 3; i < pos.length; i += 3) {
        if (pos[i] < xmin) {
            xmin = pos[i];
        }
        else {
            if (pos[i] > xmax) {
                xmax = pos[i];
            }
        }
        if (pos[i + 1] < ymin) {
            ymin = pos[i + 1];
        }
        else {
            if (pos[i + 1] > ymax) {
                ymax = pos[i + 1];
            }
        }
    }

    var ylen = ymax - ymin;
    var xlen = xmax - xmin;

    for (var j = 0; j < pos.length; j += 3) {
        var rho = Math.sqrt(pos[j] ** 2 + pos[j + 1] ** 2 + pos[j + 2] ** 2);
        var phi = pos[j + 1]/ylen * Math.PI;
        var theta = pos[j]/xlen * 2 * Math.PI;

        pos[j] = -1 * (rho * Math.sin(phi) * Math.cos(theta));
        pos[j + 1] = -1 * (rho * Math.sin(phi) * Math.sin(theta));
        pos[j + 2] = rho * Math.cos(phi);

        // pos[j] = -1 * (rho * Math.sin(phi) * Math.cos(theta)) + xmin + xlen/2;
        // pos[j + 1] = -1 * (rho * Math.sin(phi) * Math.sin(theta)) + ymin + ylen/2;
        // pos[j + 2] = rho * Math.cos(phi) + zmin + zlen/2;

        norms[j] = norms[j] * Math.sin(phi) * Math.cos(theta);
        norms[j + 1] = norms[j + 1] * Math.sin(phi) * Math.sin(theta);
        norms[j + 2] *= Math.cos(phi);
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norms);
};

var undodeform = function() {
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, initpos);
    cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, initnorm);
}

var calculatenormal = function(i, j, k) {
    var x = allcoords[i + 1][j][k] - allcoords[i - 1][j][k];
    var y = allcoords[i][j + 1][k] - allcoords[i][j - 1][k];
    var z = allcoords[i][j][k + 1] - allcoords[i][j][k - 1];

    var normal = new BABYLON.Vector3(-x, -y, -z);

    return normal;
}

var isedge = function(i, j, k) {
    // check i values
    if (i > 0) {
        if (allcoords[i - 1][j][k] != 2) {
            return true;
        }
    }
    if (i < 99) {
        if (allcoords[i + 1][j][k] != 2) {
            return true;
        }
    }

    // check j
    if (j > 0) {
        if (allcoords[i][j - 1][k] != 2) {
            return true;
        }
    }
    if (j < 49) {
        if (allcoords[i][j + 1][k] != 2) {
            return true;
        }
    }

    // check k
    if (k > 0) {
        if (allcoords[i][j][k - 1] != 2) {
            return true;
        }
    }
    if (k < 99) {
        if (allcoords[i][j][k + 1] != 2) {
            return true;
        }
    }

    return false;
}

// SOLID PARTICLE SYSTEM VERSION -- CURRENTLY NOT USED, LAGGY BECAUSE TOO MANY PARTICLES
var createmesh = function() {
    const SPS = new BABYLON.SolidParticleSystem("SPS", scene, {expandable: true, useModelMaterial: true});
    const poly = BABYLON.MeshBuilder.CreatePolyhedron("p", {type: 2, size: 0.05});
    poly.material = red;
    SPS.addShape(poly, 50000);
    const mesh = SPS.buildMesh();
    SPS.mesh.hasVertexAlpha = true;

    SPS.initParticles = () => {
        var p = 0;
        for (var i = 0; i < 100; i++) {
            for (var j = 0; j < 50; j++) {
                for (var k = 0; k < 100; k++) {
                    if (allcoords[i][j][k] == 2 && p < 50000) {
                        const particle = SPS.particles[p];
                        particle.position.x = -8 * i / 70;
                        particle.position.y = -8 * j / 70;
                        particle.position.z = 8 * k / 70;
                        p++;
                    }
                }
            }
        }
        // clean up remaining particles
        if (SPS.nbParticles > p) {
            console.log(p + " " + SPS.nbParticles);
            const removed = SPS.removeParticles(p, SPS.nbParticles - 1);
        }
    };

    SPS.initParticles();
    SPS.buildMesh();
    SPS.setParticles();
    poly.dispose();
}

engine.runRenderLoop(function() {
    if (coordinates.length > numshapes) {
        var cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 0.2}, scene);
        cube.position.x = -1 * coordinates[coordinates.length - 1][0] / 70;
        cube.position.y = -1 * coordinates[coordinates.length - 1][1] / 70;
        var vec = new BABYLON.Vector3(cube.position.x, cube.position.y, 0);
        frontshape.push(vec);
        if (frontshape.length == 3) {
            frontshape.shift();
        }
        var extruded = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: frontshape, path: frontpath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
        extruded.material = material;
        cube.material = material;

        numshapes++;
    }
    if (coordinates2.length > numshapes2) {
        var box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
        box.position.z = coordinates2[coordinates2.length - 1][0] / 70;
        box.position.y = -1 * coordinates2[coordinates2.length - 1][1] / 70;
        var vector = new BABYLON.Vector3(box.position.z, box.position.y, 0);
        sideshape.push(vector);
        if (sideshape.length == 3) {
            sideshape.shift();
        }
        var sideextrude = BABYLON.MeshBuilder.ExtrudeShape("side extrusion", {shape: sideshape, path: sidepath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
        sideextrude.material = material;
        box.material = material;
        box.isPickable = false;
        sideextrude.isPickable = false;
        numshapes2++;
    }

   scene.render();
});

/**
 * textures -- https://github.com/BabylonJS/Babylon.js/tree/master/Playground/textures
 *
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

