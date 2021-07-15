// const { SolidParticle } = require("babylonjs/Particles/solidParticle");
// const { SolidParticleSystem } = require("babylonjs/Particles/solidParticleSystem");
// import * as BABYLON from 'babylonjs';

var createScene = function () {
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
var timer = 0;
var frontshape = [];
var sideshape = [];
var intersection = [];
var indices = [];
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

var createpoint = function (x, y, z) {
    var point = BABYLON.MeshBuilder.CreateBox("point", {size: 1}, scene);
    point.position.x = -1 * x/70;
    point.position.y = -1 * y/70;
    point.position.z = z/70;
    return point;
}

var createmesh = function() {
    // for (var i = 0; i < scene.meshes.length; i++) {
    //     scene.meshes[i].dispose();
    // }
    // const SPS = new BABYLON.SolidParticleSystem("SPS", scene);
    // const sphere = BABYLON.MeshBuilder.CreateSphere("s", {});
    // const poly = BABYLON.MeshBuilder.CreatePolyhedron("p", { type: 2 });
    // SPS.addShape(sphere, 20); // 20 spheres
    // SPS.addShape(poly, 120); // 120 polyhedrons
    // SPS.addShape(sphere, 80); // 80 other spheres
    // sphere.dispose(); //dispose of original model sphere
    // poly.dispose(); //dispose of original model poly

    // const mesh = SPS.buildMesh(); // finally builds and displays the SPS mesh

    // // initiate particles function
    // SPS.initParticles = () => {
    //     for (let p = 0; p < SPS.nbParticles; p++) {
    //         const particle = SPS.particles[p];
    //   	    particle.position.x = BABYLON.Scalar.RandomRange(-50, 50);
    //         particle.position.y = BABYLON.Scalar.RandomRange(-50, 50);
    //         particle.position.z = BABYLON.Scalar.RandomRange(-50, 50);
    //     }
    // };

    // //Update SPS mesh
    // SPS.initParticles();
    // SPS.setParticles();

    const SPS = new BABYLON.SolidParticleSystem("SPS", scene, {expandable: true});
    const poly = BABYLON.MeshBuilder.CreatePolyhedron("p", {type: 2});
    SPS.addShape(poly, 500);
    const mesh = SPS.buildMesh();
    const count = 0;

    const x = 0;
    const y = 0;
    const z = 0;
    const done = false;

    SPS.initParticles = () => {
            for (let p = 0; p < SPS.nbParticles; p++) {
                const particle = SPS.particles[p];

                for (const i = x; i < 800; i += 8) {
                    for (const j = y; j < 400; j += 8) {
                        for (const k = z; k < 800; k += 8) {
                            // never gets into the if statement ; why tho.
                            if (allcoords[i/8][j/8][k/8] != 0) {
                                particle.position.x = -1 * i/70;
                                particle.position.y = -1 * j/70;
                                particle.position.z = k/70;


                                x = i;
                                y = j;
                                z = k;
                                done = true;
                                break;
                            }
                        }
                        if (done) {
                            break;
                        }
                    }
                    if (done) {
                        break;
                    }
                }
                done = false;


                // particle.position.x = BABYLON.Scalar.RandomRange(-50, 50);
                // particle.position.y = BABYLON.Scalar.RandomRange(-50, 50);
                // particle.position.z = BABYLON.Scalar.RandomRange(-50, 50);
            }
        };

    // SPS.initParticles = () => {
    //     for (const i = 0; i < 800; i += 8) {
    //         for (const j = 0; j < 400; j += 8) {
    //             for (const k = 0; k < 800; k += 8) {
    //                 // if (time >= 100) {
    //                 //     break;
    //                 // }


    //                 if (allcoords[i/8][j/8][k/8] > 0) {
    //                     const particle = SPS.particles[count];
    //                     particle.position.x = -1 * i/70;
    //                     particle.position.y = -1 * j/70;
    //                     particle.position.z = k/70;
    //                     var cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);
    //                     cube.position.x = 10 + count;


    //                     count++;
    //                 }

    //                 if (count == SPS.nbParticles) {
    //                     var sphere = BABYLON.MeshBuilder.CreateSphere("cube", {diameter: 0.2}, scene);
    //                     sphere.position.x = Math.random() * 1000;
    //                     SPS.addShape(poly, 100);
    //                 }
    //             }
    //             // time = 0;
    //         }
    //     }
    // };

    // clean up remaining particles
    // if (SPS.nbParticles > count) {
    //     const removed = SPS.removeParticles(count + 1, SPS.nbParticles - 1);
    // }
    SPS.initParticles();
    SPS.setParticles();
    SPS.buildMesh();
    poly.dispose();
}

engine.runRenderLoop(function() {


    // if (coordinates.length > numshapes) {
    //     var cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 0.2}, scene);
    //     cube.position.x = -1 * coordinates[coordinates.length - 1][0] / 70;
    //     cube.position.y = -1 * coordinates[coordinates.length - 1][1] / 70;
    //     var vec = new BABYLON.Vector3(cube.position.x, cube.position.y, 0);
    //     frontshape.push(vec);
    //     if (frontshape.length == 3) {
    //         frontshape.shift();
    //     }
    //     var extruded = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: frontshape, path: frontpath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
    //     extruded.material = material;
    //     cube.material = material;

    //     numshapes++;
    // }
    // if (coordinates2.length > numshapes2) {
    //     var box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
    //     box.position.z = coordinates2[coordinates2.length - 1][0] / 70;
    //     box.position.y = -1 * coordinates2[coordinates2.length - 1][1] / 70;
    //     var vector = new BABYLON.Vector3(box.position.z, box.position.y, 0);
    //     sideshape.push(vector);
    //     if (sideshape.length == 3) {
    //         sideshape.shift();
    //     }
    //     var sideextrude = BABYLON.MeshBuilder.ExtrudeShape("side extrusion", {shape: sideshape, path: sidepath, cap: BABYLON.Mesh.CAP_ALL, updatable: true}, scene);
    //     sideextrude.material = material;
    //     box.material = material;
    //     box.isPickable = false;
    //     sideextrude.isPickable = false;

    //     var dir = new BABYLON.Vector3(-1, 0, 0);
    //     // out = BABYLON.Vector3.TransformCoordinates(out, box.getWorldMatrix());
    //     // var dir = out.subtract(box.position);
    //     var ray = new BABYLON.Ray(box.position, dir, 10);
    //     // var rayHelper = new BABYLON.RayHelper(ray);
	// 	// rayHelper.show(scene);
    //     var hit = scene.multiPickWithRay(ray);
    //     if (hit) {
    //         for (var i = 0; i < hit.length; i++) {
    //             if (hit[i].pickedMesh.id == "extruded") {
    //                 var collision = BABYLON.MeshBuilder.CreateBox("collision", {size: 0.1}, scene);

    //                 // var clone = collision.clone("clone");
    //                 collision.position = hit[i].pickedPoint;
    //                 collision.material = red;
    //                 intersection.push(collision.position.x, collision.position.y, collision.position.z);
    //             }
    //         }

    //         /** WORKING ON THIS !! fix the mesh basically, make mesh from points
    //          * - https://doc.babylonjs.com/divingDeeper/particles/point_cloud_system/pcs_creation#add-surface--volume-points
    //          * - try and simplify and clone instead so less laggy? https://blog.raananweber.com/2015/09/03/scene-optimization-in-babylon-js/
    //          * - https://doc.babylonjs.com/divingDeeper/mesh/creation/custom/updatingVertices
    //          */

    //         // make mesh
    //         for (var i = 0; i < intersection.length; i += 3) {
    //             indices.push(i/3);
    //         }
    //         var mesh = new BABYLON.Mesh("intersected", scene);
    //         var vertex = new BABYLON.VertexData();
    //         vertex.positions = intersection;
    //         vertex.indices = indices;
    //         vertex.applyToMesh(mesh, true);

    //         var pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
    //         pcs.addSurfacePoints(mesh, 1000, BABYLON.PointColor.Stated, new BABYLON.Color3(1, 0, 0));
    //         pcs.buildMeshAsync().then(() => mesh.dispose());
    //     }

    //     numshapes2++;
    // }

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

