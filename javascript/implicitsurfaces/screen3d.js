var createbutton = function(left, top, word) {
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", word);
    button.width = "180px";
    button.height = "25px";
    button.color = "white";
    button.background = "#aaacbc";
    button.thickness = 0;
    button.cornerRadius = 10;
    button.fontFamily = "Titillium Web";
    button.fontSize = 15;
    return button;
}

var createtext = function(text) {
    var textbox = new BABYLON.GUI.TextBlock();
    textbox.text = text;
    textbox.height = "15px";
    textbox.fontFamily = "Titillium Web";
    textbox.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textbox.paddingLeft = "10px";
    textbox.color = "black";
    textbox.fontSize = 12;
    return textbox;
}
var createslider = function(min, max, value) {
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = min;
    slider.maximum = max;
    slider.value = value;
    slider.height = "20px";
    slider.width = "190px";
    slider.color = "#404358";
    slider.background = "#aaacbc";
    slider.thumbWidth = "10px";
    slider.fontFamily = "Titillium Web";
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
    UI.markAsDirty();

    // custom font - pulled from https://playground.babylonjs.com/#RZU2XN#11
    let addFont         =   document.createElement('style');
    addFont.innerHTML   =   `
    @font-face {
        font-family: 'Titillium Web';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/titilliumweb/v10/NaPecZTIAOhVxoMyOr9n_E7fdM3mDaZRbryhsA.woff2) format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
    `
    document.head.appendChild(addFont);

    // changing between wireframe, solid, and invisible mode
    var style = createbutton("-290px", "350px", "WIREFRAME");
    style.top = "-20px";
    style.onPointerClickObservable.add(function() {
        if (style.children[0].text == "WIREFRAME") {
            style.children[0].text = "SOLID";
            material.wireframe = false;
        }
        else {
            if (style.children[0].text == "SOLID") {
                style.children[0].text = "INVISIBLE";
                material.alpha = 0;
                // remove boxes
                for (var i = 0; i < scene.meshes.length; i++) {
                    if (scene.meshes[i].material.name == "boxmaterial") {
                        scene.meshes[i].dispose();
                        i--;
                    }
                }
            }
            else {
                style.children[0].text = "WIREFRAME";
                material.wireframe = true;
                material.alpha = 1;
            }
        }
    });

    // turning skybox on and off, changing background
    var skybutton = createbutton("-110px", "350px", "SKYBOX");
    skybutton.top = "40px";
    skybutton.onPointerClickObservable.add(function() {
        if (skybutton.children[0].text == "SKYBOX") {
            skybutton.children[0].text = "NAVY";
            skybox.visibility = false;
        }
        else {
            if (skybutton.children[0].text == "NAVY") {
                scene.clearColor = new BABYLON.Color3(0.62, 0.62, 0.69);
                skybutton.children[0].text = "GRAY";
            }
            else {
                scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);
                skybutton.children[0].text = "SKYBOX";
                skybox.visibility = true;
            }

        }
    });

    // changing mesh material
    var matbutton = createbutton("70px", "350px", "GOLD");
    matbutton.top = "45px";
    matbutton.onPointerClickObservable.add(function() {
        if (matbutton.children[0].text == "GOLD") {
            matbutton.children[0].text = "BLUE";
            cloud.material = blue;
        }
        else {
            if (matbutton.children[0].text == "BLUE") {
                matbutton.children[0].text = "RED";
                cloud.material = red;
            }
            else {
                if (matbutton.children[0].text == "RED") {
                    matbutton.children[0].text = "SILVER";
                    cloud.material = silver;
                }
                else {
                    matbutton.children[0].text = "GOLD";
                    cloud.material = pbr;
                }
            }
        }
        cloud.material.pointSize = slider.value;
    });

    // deform styles
    var deformbutton = createbutton("250px", "350px", "NONE");
    deformbutton.top = "105px";
    deformbutton.onPointerClickObservable.add(function() {
        if (deformbutton.children[0].text == "NONE") {
            deformbutton.children[0].text = "CYLINDRICAL";
            rect.addControl(cyltext);
            rect.addControl(cylslider);
            rect.addControl(radiustext);
            rect.addControl(radiusslider);
            rect.height = "620px";
            menutitle.top = "-290px";
            deformcylinder();
        }
        else {
            if (deformbutton.children[0].text == "CYLINDRICAL") {
                deformbutton.children[0].text = "SPHERICAL";
                rect.removeControl(cyltext);
                rect.removeControl(cylslider);
                rect.removeControl(radiustext);
                rect.removeControl(radiusslider);
                rect.addControl(phitext);
                rect.addControl(phislider);
                rect.addControl(thetatext);
                rect.addControl(thetaslider);
                deformsphere();
            }
            else {
                if (deformbutton.children[0].text == "SPHERICAL") {
                    deformbutton.children[0].text = "SPIRAL";
                    rect.removeControl(phitext);
                    rect.removeControl(phislider);
                    rect.removeControl(thetatext);
                    rect.removeControl(thetaslider);
                    rect.addControl(spiraltext);
                    rect.addControl(spiralslider);
                    rect.height = "510px";
                    menutitle.top = "-235px";

                    deformspiral();
                }
                else {
                    deformbutton.children[0].text = "NONE";
                    rect.removeControl(spiraltext);
                    rect.removeControl(spiralslider);
                    rect.height = "400px";
                    menutitle.top = "-180px";
                    undodeform();
                }
            }
        }
    });

    // marching cubes - not in use, didn't finish
    // var marchbutton = createbutton("250px", "200px", "Marching Cubes");
    // marchbutton.onPointerClickObservable.add(function() {
    //     march();
    // });


    // reset to initial state
    var resetbutton = createbutton("0px", "0px", "RESET");
    resetbutton.top = "160px";
    resetbutton.height = "40px";
    resetbutton.fontSize = 20;
    resetbutton.onPointerClickObservable.add(function() {
        // reset background
        scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        skybutton.children[0].text = "SKYBOX";
        skybox.visibility = true;

        // reset material
        matbutton.children[0].text = "GOLD";
        cloud.material = pbr;

        // reset deform
        deformbutton.children[0].text = "NONE";
        undodeform();
        cloud.scaling.x = 1;
        cloud.scaling.y = 1;
        cloud.scaling.z = 1;

        // update gui and slider text
        rect.removeControl(cyltext);
        rect.removeControl(cylslider);
        rect.removeControl(radiustext);
        rect.removeControl(radiusslider);
        rect.removeControl(phitext);
        rect.removeControl(phislider);
        rect.removeControl(thetatext);
        rect.removeControl(thetaslider);
        rect.removeControl(spiraltext);
        rect.removeControl(spiralslider);
        rect.height = "400px";
        menutitle.top = "-180px";
        size.text = "SCALE: 1";
        squeeze.text = "SQUEEZE: 1";

        // reset pointsize
        cloud.material.pointSize = 10;
        pointsize.text = "POINT SIZE: 10";
    });

    // creating sliders
    var pointsize = createtext("POINT SIZE: 10");
    pointsize.top = "-145px";
    var pointslider = createslider(1, 30, 10);
    pointslider.top = "-125px";
    pointslider.onValueChangedObservable.add(function (value) {
        cloud.material.pointSize = value;
        pointsize.text = "POINT SIZE: " + Math.floor(value);
    });

    var phitext = createtext("DEFORMATION (PHI): 1");
    phitext.top = "-255px";
    var phislider = createslider(0, 1, 1);
    phislider.top = "-235px";
    phislider.onValueChangedObservable.add(function (value) {
        phiconst = value;
        undodeform();
        deformsphere();
        phitext.text = "DEFORMATION (PHI): " + value.toFixed(2);
    });

    var thetatext = createtext("DEFORMATION (THETA): 1");
    thetatext.top = "-200px";
    var thetaslider = createslider(0, 1, 1);
    thetaslider.top = "-180px";
    thetaslider.onValueChangedObservable.add(function (value) {
        thetaconst = value;
        undodeform();
        deformsphere();
        thetatext.text = "DEFORMATION (THETA): " + value.toFixed(2);
    });

    var cyltext = createtext("DEFORMATION (THETA): 1");
    cyltext.top = "-255px";
    var cylslider = createslider(0, 1, 1);
    cylslider.top = "-235px";
    cylslider.onValueChangedObservable.add(function (value) {
        cylconst = value;
        undodeform();
        deformcylinder();
        cyltext.text = "DEFORMATION (THETA): " + value.toFixed(2);
    });

    var spiraltext = createtext("DEFORMATION (THETA): 1");
    spiraltext.top = "-200px";
    var spiralslider = createslider(0, 1, 1);
    spiralslider.top = "-180px";
    spiralslider.onValueChangedObservable.add(function (value) {
        spiralconst = value;
        undodeform();
        deformspiral();
        spiraltext.text = "DEFORMATION (THETA): " + value.toFixed(2);
    });

    var radiustext = createtext("RADIUS: 2");
    radiustext.top = "-200px";
    var radiusslider = createslider(-5, 5, 2);
    radiusslider.top = "-180px";
    radiusslider.onValueChangedObservable.add(function (value) {
        radius = value;
        undodeform();
        deformcylinder();
        radiustext.text = "RADIUS: " + value.toFixed(2);
    });

    var size = createtext("SCALE: 1");
    size.top = "-90px";
    var sizeslider = createslider(-5, 5, 1);
    sizeslider.top = "-70px";
    sizeslider.onValueChangedObservable.add(function (value) {
        cloud.scaling.x = value;
        cloud.scaling.y = value;
        cloud.scaling.z = value;
        size.text = "SCALE: " + value.toFixed(2);
    });

    var squeeze = createtext("SQUEEZE: 1");
    squeeze.top = "-35px";

    var squeezeslider = createslider(-5, 5, 1);
    squeezeslider.top = "-15px";
    squeezeslider.onValueChangedObservable.add(function (value) {
        cloud.scaling.z = value;
        squeeze.text = "SQUEEZE: " + value.toFixed(2);
    });

    // gui textboxes
    var colortext = createtext("COLOR");
    colortext.top = "20px";

    var deformtext = createtext("DEFORMATION");
    deformtext.top = "80px";

    var displaytext = createtext("DISPLAY");
    displaytext.top = "-45px";

    var backgroundtext = createtext("BACKGROUND");
    backgroundtext.top = "15px";

    // rectangular container to hold object properties
    var rect = new BABYLON.GUI.Rectangle();
    rect.height = "400px";
    rect.cornerRadius = 7;
    rect.thickness = 0;
    rect.background = "#827f92";
    rect.left = "-300px";
    rect.top = "190px";
    rect.width = "200px";
    UI.addControl(rect);
    var menutitle = createtext("OBJECT PROPERTIES");
    menutitle.top = "-180px";
    menutitle.color = "black";
    menutitle.fontSize = 15;
    menutitle.paddingLeft = 0;
    menutitle.outlineWidth = 0.5;
    menutitle.outlineColor = "black";
    menutitle.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rect.addControl(menutitle);
    rect.addControl(pointsize);
    rect.addControl(pointslider);
    rect.addControl(size);
    rect.addControl(sizeslider);
    rect.addControl(squeeze);
    rect.addControl(squeezeslider);
    rect.addControl(colortext);
    rect.addControl(matbutton);
    rect.addControl(deformtext);
    rect.addControl(deformbutton);
    rect.addControl(resetbutton);

    // display properties container
    var rect2 = new BABYLON.GUI.Rectangle();
    rect2.height = "200px";
    rect2.cornerRadius = 7;
    rect2.thickness = 0;
    rect2.background = "#827f92";
    rect2.left = "300px";
    rect2.top = "290px";
    rect2.width = "200px";
    UI.addControl(rect2);
    var menutitle2 = createtext("DISPLAY PROPERTIES");
    menutitle2.top = "-80px";
    menutitle2.color = "black";
    menutitle2.fontSize = 15;
    menutitle2.paddingLeft = 0;
    menutitle2.outlineWidth = 0.5;
    menutitle2.outlineColor = "black";
    menutitle2.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rect2.addControl(menutitle2);
    rect2.addControl(displaytext);
    rect2.addControl(style);
    rect2.addControl(backgroundtext);
    rect2.addControl(skybutton);

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

// export
var objexport = ["g\n"];

// render the volume
var createpointcloud = function() {
    var p = 0;
    // go through allcoords matrix to find particle positions
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 50; j++) {
            for (var k = 0; k < 100; k++) {
                // must be a double intersection and on the surface
                if (intersection(i, j, k) && isedge(i, j, k)) {
                    positions.push(-8 * i / 70, -8 * j / 70,  8 * k / 70);
                    indices.push(p);
                    var norm = calculatenormal(i, j, k);
                    normals.push(norm.x, norm.y, norm.z);
                    objexport.push("v " + (-8 * i / 70) + " " + (-8 * j / 70) + " " + (8 * k / 70) + "\n");
                    p++;
                }
            }
        }
    }
    for (var n = 0; n < normals.length; n += 3) {
        objexport.push("vn " + normals[n] + " " + normals[n + 1] + " " + normals[n + 1] + "\n");
    }
    // needs faces, but i don't have the triangles :/
    objexport.push("g");

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

    camera.setTarget(cloud.getAbsolutePivotPoint());
}

// for marching cubes, not in use
var march = function() {
    var posnorms = marchrender(positions, normals);
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, posnorms[0]);
    cloud.updateVerticesData(BABYLON.VertexBuffer.NormalKind, posnorms[1]);
}

var intersection = function(i, j, k) {
    // points from screen 1 will put a value of 5 into the matrix, points from screen 2 will add on a value of 2
    var val = allcoords[i][j][k];
    if (val <= 5) {
        return false;
    }
    if (val % 5 == 0) {
        return false;
    }
    return ((val % 5) % 2 == 0);
}

// get the needed maximums and minimums for deforming
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
        var theta = spiralconst * pos[j + 1] / ylen * Math.PI * 2;
        pos[j] = r * Math.cos(theta) + center.x;
        pos[j + 1] = r * Math.sin(theta) + center.y;
    }
    cloud.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
}

// revert back to initial arrays
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

var createboxes = function(xmin, xmax, ymin, ymax, zmin, zmax) {
    // remove existing boxes
    for (var i = 0; i < scene.meshes.length; i++) {
        if (scene.meshes[i].material.name == "boxmaterial") {
            scene.meshes[i].dispose();
            i--;
        }
    }

    var c1 = BABYLON.MeshBuilder.CreateBox("c1", {size: 0.2}, scene);
    var c2 = BABYLON.MeshBuilder.CreateBox("c2", {size: 0.2}, scene);
    var c3 = BABYLON.MeshBuilder.CreateBox("c3", {size: 0.2}, scene);
    var c4 = BABYLON.MeshBuilder.CreateBox("c4", {size: 0.2}, scene);
    var c5 = BABYLON.MeshBuilder.CreateBox("c5", {size: 0.2}, scene);
    var c6 = BABYLON.MeshBuilder.CreateBox("c6", {size: 0.2}, scene);
    var c7 = BABYLON.MeshBuilder.CreateBox("c7", {size: 0.2}, scene);
    var c8 = BABYLON.MeshBuilder.CreateBox("c8", {size: 0.2}, scene);

    c1.position = new BABYLON.Vector3(xmin, ymin, zmin);
    c2.position = new BABYLON.Vector3(xmin, ymax, zmin);
    c3.position = new BABYLON.Vector3(xmax, ymin, zmin);
    c4.position = new BABYLON.Vector3(xmax, ymax, zmin);
    c5.position = new BABYLON.Vector3(xmin, ymin, zmax);
    c6.position = new BABYLON.Vector3(xmin, ymax, zmax);
    c7.position = new BABYLON.Vector3(xmax, ymin, zmax);
    c8.position = new BABYLON.Vector3(xmax, ymax, zmax);

    var boxcolor = new BABYLON.StandardMaterial("boxmaterial", scene);
    boxcolor.emissiveColor = new BABYLON.Color3(1, 1, 1);
    boxcolor.backFaceCulling = false;

    c1.material = boxcolor;
    c2.material = boxcolor;
    c3.material = boxcolor;
    c4.material = boxcolor;
    c5.material = boxcolor;
    c6.material = boxcolor;
    c7.material = boxcolor;
    c8.material = boxcolor;
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
    // creates boxes and wireframe extrusion lines that track cursor position on 2D screens
    // for first screen
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

    // for second screen
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
 * links for self:
 *
 * textures https://github.com/BabylonJS/Babylon.js/tree/master/Playground/textures
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

