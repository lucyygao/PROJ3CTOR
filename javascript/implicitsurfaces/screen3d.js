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

var createtext = function(text) {
    var textbox = new BABYLON.GUI.TextBlock();
    textbox.text = text;
    textbox.height = "30px";
    textbox.color = "white";
    return textbox;
}
var createslider = function(min, max, value) {
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = min;
    slider.maximum = max;
    slider.value = value;
    slider.height = "20px";
    slider.width = "160px";
    slider.color = "#808090";
    slider.background = "grey";
    return slider;
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // set camera and light
    camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 20, new BABYLON.Vector3(0, 0, 0));
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
            deformbutton.children[0].text = "Cylinder";
            panel.addControl(cyltext);
            panel.addControl(cylslider);
            panel.addControl(radiustext);
            panel.addControl(radiusslider);
            deformcylinder();
        }
        else {
            if (deformbutton.children[0].text == "Cylinder") {
                deformbutton.children[0].text = "Sphere";
                panel.removeControl(cyltext);
                panel.removeControl(cylslider);
                panel.removeControl(radiustext);
                panel.removeControl(radiusslider);
                panel.addControl(phitext);
                panel.addControl(phislider);
                panel.addControl(thetatext);
                panel.addControl(thetaslider);
                deformsphere();
            }
            else {
                if (deformbutton.children[0].text == "Sphere") {
                    deformbutton.children[0].text = "Spiral";
                    panel.removeControl(phitext);
                    panel.removeControl(phislider);
                    panel.removeControl(thetatext);
                    panel.removeControl(thetaslider);
                    panel.addControl(spiraltext);
                    panel.addControl(spiralslider);
                    deformspiral();
                }
                else {
                    deformbutton.children[0].text = "No Deform";
                    panel.removeControl(spiraltext);
                    panel.removeControl(spiralslider);
                    undodeform();
                }
            }
        }
    });

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "250px";
    panel.left = "-290px";
    panel.top = "0px";

    var resetbutton = createbutton("0px", "0px", "Reset");
    resetbutton.onPointerClickObservable.add(function() {
        // reset background
        scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        skybutton.children[0].text = "Skybox";
        skybox.visibility = true;

        // reset material
        matbutton.children[0].text = "Gold";
        cloud.material = pbr;

        // reset deform
        deformbutton.children[0].text = "No Deform";
        undodeform();
        cloud.scaling.x = 1;
        cloud.scaling.y = 1;
        cloud.scaling.z = 1;

        // update gui and slider text
        panel.removeControl(cyltext);
        panel.removeControl(cylslider);
        panel.removeControl(radiustext);
        panel.removeControl(radiusslider);
        panel.removeControl(phitext);
        panel.removeControl(phislider);
        panel.removeControl(thetatext);
        panel.removeControl(thetaslider);
        panel.removeControl(spiraltext);
        panel.removeControl(spiralslider);
        size.text = "Scaling: 1";
        squeeze.text = "Squeeze: 1";

        // reset pointsize
        cloud.material.pointSize = 10;
        pointsize.text = "Point Size: 10";
    });

    var pointsize = createtext("Point Size: 10");
    var pointslider = createslider(1, 30, 10);
    pointslider.onValueChangedObservable.add(function (value) {
        cloud.material.pointSize = value;
        pointsize.text = "Point Size: " + Math.floor(value);
    });

    var phitext = createtext("Deformation (phi): 1");
    var phislider = createslider(0, 1, 1);
    phislider.onValueChangedObservable.add(function (value) {
        phiconst = value;
        undodeform();
        deformsphere();
        phitext.text = "Deformation (phi): " + value.toFixed(2);
    });

    var thetatext = createtext("Deformation (theta): 1");
    var thetaslider = createslider(0, 1, 1);
    thetaslider.onValueChangedObservable.add(function (value) {
        thetaconst = value;
        undodeform();
        deformsphere();
        thetatext.text = "Deformation (theta): " + value.toFixed(2);
    });

    var cyltext = createtext("Deformation (theta): 1");
    var cylslider = createslider(0, 1, 1);
    cylslider.onValueChangedObservable.add(function (value) {
        cylconst = value;
        undodeform();
        deformcylinder();
        cyltext.text = "Deformation (theta): " + value.toFixed(2);
    });

    var spiraltext = createtext("Deformation (theta): 1");
    var spiralslider = createslider(0, 1, 1);
    spiralslider.onValueChangedObservable.add(function (value) {
        spiralconst = value;
        undodeform();
        deformspiral();
        spiraltext.text = "Deformation (theta): " + value.toFixed(2);
    });

    var radiustext = createtext("Radius: 2");
    var radiusslider = createslider(-5, 5, 2);
    radiusslider.onValueChangedObservable.add(function (value) {
        radius = value;
        undodeform();
        deformcylinder();
        radiustext.text = "Radius: " + value.toFixed(2);
    });

    var size = createtext("Scaling: 1");
    var sizeslider = createslider(-5, 5, 1);
    sizeslider.onValueChangedObservable.add(function (value) {
        cloud.scaling.x = value;
        cloud.scaling.y = value;
        cloud.scaling.z = value;
        size.text = "Scaling: " + value.toFixed(2);
    });

    var squeeze = createtext("Squeeze: 1");
    var squeezeslider = createslider(-5, 5, 1);
    squeezeslider.onValueChangedObservable.add(function (value) {
        cloud.scaling.z = value;
        squeeze.text = "Squeeze: " + value.toFixed(2);
    });

    // adding everything to UI
    UI.addControl(style);
    UI.addControl(skybutton);
    UI.addControl(matbutton);
    UI.addControl(panel);
    panel.addControl(resetbutton);
    panel.addControl(pointsize);
    panel.addControl(pointslider);
    panel.addControl(size);
    panel.addControl(sizeslider);
    panel.addControl(squeeze);
    panel.addControl(squeezeslider);

    UI.addControl(deformbutton);



//     // DELETE LATER ----------------------------------------------------
//     // show axis
//   var showAxis = function(size) {
//     var makeTextPlane = function(text, color, size) {
//     var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
//     dynamicTexture.hasAlpha = true;
//     dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
//     var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
//     plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
//     plane.material.backFaceCulling = false;
//     plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
//     plane.material.diffuseTexture = dynamicTexture;
//     return plane;
//      };

//     var axisX = BABYLON.Mesh.CreateLines("axisX", [
//       new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
//       new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
//       ], scene);
//     axisX.color = new BABYLON.Color3(1, 0, 0);
//     var xChar = makeTextPlane("X", "red", size / 10);
//     xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
//     var axisY = BABYLON.Mesh.CreateLines("axisY", [
//         new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
//         new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
//         ], scene);
//     axisY.color = new BABYLON.Color3(0, 1, 0);
//     var yChar = makeTextPlane("Y", "green", size / 10);
//     yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
//     var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
//         new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
//         new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
//         ], scene);
//     axisZ.color = new BABYLON.Color3(0, 0, 1);
//     var zChar = makeTextPlane("Z", "blue", size / 10);
//     zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
//   };

//   showAxis(5);
//   // -----------------------------------------------------------------------------


    return scene;
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();
var camera;
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
var cylconst = 1;
var spiralconst = 1;
var radius = 2;

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
                if (allcoords[i][j][k] > 5 && allcoords[i][j][k] % 5 == 2 && isedge(i, j, k)) {
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
    // console.log(pointslider.value());
    // figure out to get point value here jflsdkfjklsdjfklsdjf
    cloud.material.pointSize = pointslider.value();
    cloud.material.backFaceCulling = false;

    cloud.setPivotPoint(cloud.getBoundingInfo().boundingSphere.center);

    initpos = [...positions];
    initnorm = [...normals];

    camera.setTarget(cloud.getAbsolutePivotPoint());
}

var deform = function() {
    var xmin = positions[0];
    var xmax = positions[0];
    var ymin = positions[1];
    var ymax = positions[1];
    var zmin = positions[2];
    var zmax = positions[2];
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
        if (positions[i + 2] < zmin) {
            zmin = positions[i + 2];
        }
        else {
            if (positions[i + 2] > zmax) {
                zmax = positions[i + 2];
            }
        }
    }
    var array = [];
    array.push(xmax - xmin);
    array.push(ymax - ymin);
    array.push(zmax - zmin);
    array.push(xmin);
    return array;
}

var deformcylinder = function() {
    var arr = deform();
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];
    var xlen = arr[0];

    for (var j = 0; j < pos.length; j += 3) {
        // move to origin to deform
        pos[j] -= (center.x - arr[0]/2);
        pos[j + 1] -= radius * (center.y - arr[1]/2);
        pos[j + 2] -= (center.z - arr[2]/2);

        // rotate around z axis
        var theta = -2 * Math.PI * pos[j]/xlen;
        var newx = (pos[j] * Math.cos(cylconst * theta) - pos[j + 1] * Math.sin(cylconst * theta));
        var newy = (pos[j] * Math.sin(cylconst * theta) + pos[j + 1] * Math.cos(cylconst * theta));

        // move back to position
        pos[j] = newx + center.x;
        pos[j + 1] = newy + center.y;
        pos[j + 2] += center.z;
    }

    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
};

var deformsphere = function() {
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];
    var xlen = deform()[0];
    var ylen = deform()[1];

    for (var j = 0; j < pos.length; j += 3) {
        var rho = pos[j + 2];
        var phi = phiconst * Math.PI * pos[j + 1]/ylen;
        var theta = thetaconst * 2 * Math.PI * pos[j]/xlen;

        pos[j] = (rho * Math.sin(phi) * Math.cos(theta)) + center.x;
        pos[j + 1] = (rho * Math.sin(phi) * Math.sin(theta)) + center.y;
        pos[j + 2] = rho * Math.cos(phi) + center.z;
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
};

var deformspiral = function() {
    var center = cloud.getAbsolutePivotPoint();
    var pos = [...positions];

    var ylen = deform()[1];

    for (var j = 0; j < pos.length; j += 3) {
        var r = Math.sqrt(pos[j] ** 2 + pos[j + 1] ** 2);
        // var r = pos[j + 2];
        var theta = spiralconst * pos[j + 1] / ylen * Math.PI * 2;
        pos[j] = r * Math.cos(theta) + center.x;
        pos[j + 1] = r * Math.sin(theta) + center.y;
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    // cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norms);
}

// var deformcube = function() {
//     var center = cloud.getAbsolutePivotPoint();
//     var pos = [...positions];
//     var norms = [...normals];
//     var xlen = deform()[0];
//     var boundary = xlen / 4 + deform()[2];
//     for (var i = 0; i < pos.length; i += 3) {
//         // top
//         if (pos[i] < boundary) {
//             // pos[i] += xlen/2;
//             // pos[i + 2] += xlen/4;
//             // pos[i + 2] -= xlen / 2;
//             // console.log("hey");
//         }
//         else {
//             // right
//             if (pos[i] < boundary + xlen/4) {
//                 var hold = pos[i];
//                 pos[i] = pos[i + 1];
//                 pos[i + 1] = hold;
//                 // console.log("hey2");
//             }
//             else {
//                 // bottom
//                 if (pos[i] < boundary + xlen/2) {
//                     pos[i + 1] *= -1;
//                     // console.log("hey3");
//                 }
//                 // left
//                 else {
//                     var hold = -1 * pos[i];
//                     pos[i] = -1 * pos[i + 1];
//                     pos[i + 1] = hold;
//                     // console.log("hey4");
//                 }
//             }
//         }
//     }
//     cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
// }

var undodeform = function() {
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, initpos);
    cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, initnorm);
}

var calculatenormal = function(i, j, k) {
    var x, y, z;
    if (i == 0) {
        x = allcoords[i + 1][j][k];
    }
    else {
        if (i == 99) {
            x = -1 * allcoords[i - 1][j][k];
        }
        else {
            x = allcoords[i + 1][j][k] - allcoords[i - 1][j][k];
        }
    }

    if (j == 0) {
        y = allcoords[i][j + 1][k];
    }
    else {
        if (j == 49) {
            y = -1 * allcoords[i][j - 1][k];
        }
        else {
            y = allcoords[i][j + 1][k] - allcoords[i][j - 1][k];
        }
    }

    if (k == 0) {
        z = allcoords[i][j][k + 1];
    }
    else {
        if (k == 99) {
            z = -1 * allcoords[i][j][k - 1];
        }
        else {
            z = allcoords[i][j][k + 1] - allcoords[i][j][k - 1];
        }
    }
    var normal = new BABYLON.Vector3(-x, -y, -z);

    return normal;
}

var isedge = function(i, j, k) {
    // check i values
    if (i > 0) {
        if (allcoords[i - 1][j][k] < 7) {
            return true;
        }
    }
    if (i < 99) {
        if (allcoords[i + 1][j][k] < 7) {
            return true;
        }
    }

    // check j
    if (j > 0) {
        if (allcoords[i][j - 1][k] < 7) {
            return true;
        }
    }
    if (j < 49) {
        if (allcoords[i][j + 1][k] < 7) {
            return true;
        }
    }

    // check k
    if (k > 0) {
        if (allcoords[i][j][k - 1] < 7) {
            return true;
        }
    }
    if (k < 99) {
        if (allcoords[i][j][k + 1] < 7) {
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

