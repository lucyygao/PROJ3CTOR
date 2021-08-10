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
                deformbutton.children[0].text = "Spiral";
                deformspiral();
            }
            else {
                if (deformbutton.children[0].text == "Spiral") {
                    deformbutton.children[0].text = "Cube";
                    deformcube();
                }
                else {
                    deformbutton.children[0].text = "No Deform";
                    undodeform();
                }
            }
        }
    });

    // slider to change point size - MAKE A CREATESLIDER FUNCTION PROBABLY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "250px";
    panel.left = "-290px";
    panel.top = "200px";

    var pointsize = new BABYLON.GUI.TextBlock();
    pointsize.text = "Point Size: 5";
    pointsize.height = "30px";
    pointsize.color = "white";
    var pointslider = new BABYLON.GUI.Slider();
    pointslider.minimum = 1;
    pointslider.maximum = 50;
    pointslider.value = 5;
    pointslider.height = "20px";
    pointslider.width = "160px";
    pointslider.color = "#808090";
    pointslider.background = "grey";
    pointslider.onValueChangedObservable.add(function (value) {
        cloud.material.pointSize = value;
        pointsize.text = "Point Size: " + Math.floor(value);
    });
    var phitext = new BABYLON.GUI.TextBlock();
    phitext.text = "Deformation (phi): 1";
    phitext.height = "30px";
    phitext.color = "white";
    var phislider = new BABYLON.GUI.Slider();
    phislider.minimum = 0;
    phislider.maximum = 1;
    phislider.value = 1;
    phislider.height = "20px";
    phislider.width = "160px";
    phislider.color = "#808090";
    phislider.background = "grey";
    phislider.onValueChangedObservable.add(function (value) {
        phiconst = value;
        undodeform();
        deformsphere();
        phitext.text = "Deformation (phi): " + value.toFixed(2);
    });

    var thetatext = new BABYLON.GUI.TextBlock();
    thetatext.text = "Deformation (theta): 1";
    thetatext.height = "30px";
    thetatext.color = "white";
    var thetaslider = new BABYLON.GUI.Slider();
    thetaslider.minimum = 0;
    thetaslider.maximum = 1;
    thetaslider.value = 1;
    thetaslider.height = "20px";
    thetaslider.width = "160px";
    thetaslider.color = "#808090";
    thetaslider.background = "grey";
    thetaslider.onValueChangedObservable.add(function (value) {
        thetaconst = value;
        undodeform();
        deformsphere();
        thetatext.text = "Deformation (theta): " + value.toFixed(2);
    });

    var size = new BABYLON.GUI.TextBlock();
    size.text = "Scaling: 1";
    size.height = "30px";
    size.color = "white";
    var sizeslider = new BABYLON.GUI.Slider();
    sizeslider.minimum = 0;
    sizeslider.maximum = 10;
    sizeslider.value = 1;
    sizeslider.height = "20px";
    sizeslider.width = "160px";
    sizeslider.color = "#808090";
    sizeslider.background = "grey";
    sizeslider.onValueChangedObservable.add(function (value) {
        cloud.scaling.x = value;
        cloud.scaling.y = value;
        cloud.scaling.z = value;
        size.text = "Scaling: " + value.toFixed(2);
    });

    // adding everything to UI
    UI.addControl(style);
    UI.addControl(skybutton);
    UI.addControl(matbutton);
    UI.addControl(panel);
    panel.addControl(pointsize);
    panel.addControl(pointslider);
    panel.addControl(phitext);
    panel.addControl(phislider);
    panel.addControl(thetatext);
    panel.addControl(thetaslider);
    panel.addControl(size);
    panel.addControl(sizeslider);
    UI.addControl(deformbutton);



    // DELETE LATER ----------------------------------------------------
    // show axis
  var showAxis = function(size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };

    var axisX = BABYLON.Mesh.CreateLines("axisX", [
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  };

  showAxis(5);
  // -----------------------------------------------------------------------------





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

// sliders
var phiconst = 1;
var thetaconst = 1;

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

    cloud.setPivotPoint(cloud.getBoundingInfo().boundingSphere.center);

    initpos = [...positions];
    initnorm = [...normals];

    // camera.setTarget(cloud);
}

var deform = function() {
    var xmin = positions[0];
    var xmax = positions[0];
    var ymin = positions[1];
    var ymax = positions[1];
    for (var i = 3; i < positions.length; i += 3) {
        if (positions[i] < xmin) {
            xmin = positions[i];
        }
        else {
            if (positions[i] > xmax) {
                xmax = positions[i];
            }
        }
        if (positions[i + 1] < ymin) {
            ymin = positions[i + 1];
        }
        else {
            if (positions[i + 1] > ymax) {
                ymax = positions[i + 1];
            }
        }
    }
    var array = [];
    array.push(xmax - xmin);
    array.push(ymax - ymin);
    array.push(xmin);
    return array;
}

var deformsphere = function() {
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];
    var norms = [...normals];
    // var pos = cloud.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    // var norms = cloud.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    var xlen = deform()[0];
    var ylen = deform()[1];

    for (var j = 0; j < pos.length; j += 3) {
        // var rho = Math.sqrt(pos[j] ** 2 + pos[j + 1] ** 2 + pos[j + 2] ** 2);
        var rho = pos[j + 2];
        var phi = phiconst * Math.PI * pos[j + 1]/ylen;
        var theta = thetaconst * 2 * Math.PI * pos[j]/xlen;

        pos[j] = (rho * Math.sin(phi) * Math.cos(theta)) + center.x;
        pos[j + 1] = (rho * Math.sin(phi) * Math.sin(theta)) + center.y;
        pos[j + 2] = rho * Math.cos(phi) + center.z;

        // pos[j] = -1 * (rho * Math.sin(phi) * Math.cos(theta)) + xmin + xlen/2;
        // pos[j + 1] = -1 * (rho * Math.sin(phi) * Math.sin(theta)) + ymin + ylen/2;
        // pos[j + 2] = rho * Math.cos(phi) + zmin + zlen/2;

        // norms[j] = norms[j] * Math.sin(phi) * Math.cos(theta);
        // norms[j + 1] = norms[j + 1] * Math.sin(phi) * Math.sin(theta);
        // norms[j + 2] *= Math.cos(phi);

        norms[j] = pos[j];
        norms[j + 1] = pos[j + 1];
        norms[j + 2] = pos[j + 2];
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    // cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norms);
    // cloud.setPivotPoint(center);
    // var newcent = cloud.getBoundingInfo().boundingSphere.center;
    // var axis = new BABYLON.Vector3(center.x - newcent.x, center.y - newcent.y, center.z - newcent.z);
    // var dist = Math.sqrt(axis.x ** 2 + axis.y ** 2 + axis.z ** 2);

    // cloud.translate(axis, dist, BABYLON.Space.WORLD);
};

var deformspiral = function() {
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];
    var norms = [...normals];

    var ylen = deform()[1];

    for (var j = 0; j < pos.length; j += 3) {
        var r = Math.sqrt(pos[j] ** 2 + pos[j + 1] ** 2);
        // var r = pos[j + 2];
        var theta = pos[j + 1] / ylen * Math.PI * 2;
        pos[j] = r * Math.cos(theta) + center.x;
        pos[j + 1] = r * Math.sin(theta) + center.y;
        // pos[j + 2] += center.z;

        // norms[j] = pos[j];
        // norms[j + 1] = pos[j + 1];
        // norms[j + 2] = pos[j + 2];
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    // cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norms);
}

var deformcube = function() {
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];
    var norms = [...normals];
    var xlen = deform()[0];
    var boundary = xlen / 4 + deform()[2];
    for (var i = 0; i < pos.length; i += 3) {
        // top
        if (pos[i] < boundary) {
            // pos[i] += xlen/2;
            // pos[i + 2] += xlen/4;
            // pos[i + 2] -= xlen / 2;
            console.log("hey");
        }
        else {
            // right
            if (pos[i] < boundary + xlen/4) {
                var hold = pos[i];
                pos[i] = pos[i + 1];
                pos[i + 1] = hold;
                console.log("hey2");
            }
            else {
                // bottom
                if (pos[i] < boundary + xlen/2) {
                    pos[i + 1] *= -1;
                    console.log("hey3");
                }
                // left
                else {
                    var hold = -1 * pos[i];
                    pos[i] = -1 * pos[i + 1];
                    pos[i + 1] = hold;
                    console.log("hey4");
                }
            }
        }
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
}

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

