'use strict';

var scene, camera, renderer, controls;
var axes, plane, cube, sphere, cylinder;

// var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

// var sheep;
// var mouseDown;
// var max = 0;

var jumpRaycaster;

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/physijs/ammo.js';

function init() {
    // scene = new THREE.Scene();
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(0, 5, 700);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor('rgb(255,255,255)');
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    addObjects();
    addLights();

    // sheep = new Sheep();
    // scene.add(sheep.group);
}

function render(){
    update();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

var canMoveToRight = false;
var canMoveToLeft = false;
var canJump = true;
var speed = 100;
var vector = new THREE.Vector3(0,0,0,);

function update() {

    if ( keyboard.pressed("D") ){
        canMoveToRight = true;
    }
    if ( keyboard.pressed("A") ){
        canMoveToLeft = true;
    }
    if ( keyboard.pressed("W") && canJump){
        cube.applyCentralImpulse(new THREE.Vector3(0,30,0,));
        canJump = false;
    }
    if ( keyboard.pressed("S")){
        canJump = true;
    }

    if (canMoveToRight) {
        cube.setLinearVelocity(vector.setX(speed));
    }
    // else if (!canMoveToRight) {
    //     cube.setLinearVelocity(vector.setX(0));
    // }
    if (canMoveToLeft){
        cube.setLinearVelocity(vector.setX(-speed));
    }

    canMoveToRight = false;
    canMoveToLeft = false;

    var velo = cube.getLinearVelocity();
    console.log(velo.y);
}

function addObjects(){
    axes = new THREE.AxesHelper(50);
    scene.add(axes);

    for (let i = 0; i < 50; i++){
        var planeGeometry = new THREE.CubeGeometry(8, 8, 8);
        var planeTexture = new THREE.ImageUtils.loadTexture('texture/box.jpg');
        var planeMaterial = new THREE.MeshLambertMaterial( {map: planeTexture, wireframe: false } );
        plane = new Physijs.BoxMesh(planeGeometry, planeMaterial, 0);
        plane.position.set(i*8, -4, 0);
        scene.add(plane);
    }

    var geometrySphere = new THREE.SphereGeometry(1100, 50, 50);
    var sphereTexture = new THREE.ImageUtils.loadTexture( 'texture/desert.jpg' );
    var materialSphere = new THREE.MeshBasicMaterial( {map: sphereTexture, transparent: true, side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );

    // var cubeGeometry = new THREE.CubeGeometry(8, 8, 8);
    // var cubeMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(255,0, 0)'} );
    // cube = new Physijs.BoxMesh(cubeGeometry, cubeMaterial, 1);
    // cube.position.set(0, 4, 0);
    // scene.add(cube);
    // cube.setAngularFactor(new THREE.Vector3(0, 0, 0));

    var cubeGeometry = new THREE.CubeGeometry(8, 8, 8);
    var cubeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(255,0, 0)'} ),
        100,
        0
    );
    cube = new Physijs.BoxMesh(cubeGeometry, cubeMaterial, 1);
    cube.position.set(0, 4, 0);
    scene.add(cube);
    cube.setAngularFactor(new THREE.Vector3(0, 0, 0));

    // var sphereGeometry = new THREE.SphereGeometry(4, 40, 40);
    // var sphereMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(0,255,0)'} );
    // sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(-10, 4, 0);
    // scene.add(sphere);

    var cylinderGeometry = new THREE.CylinderGeometry(4, 4, 8, 40);
    var cylinderMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(0,0,255)'} );
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(-20, 4, 0);
    scene.add(cylinder);
}

function addLights() {
    // var ambientLight = new THREE.AmbientLight('rgb(255,255,255)');
    // ambientLight.intensity = 0.7;
    // scene.add(ambientLight);

    var spotLight = new THREE.SpotLight();
    spotLight.position.set(0,20,20);
    scene.add(spotLight);
}

// function onMouseDown(e) {
//     if (e.key === "w"){
//         mouseDown = true;
//     }
//     // mouseDown = true;
// }
//
// function onMouseUp() {
//     mouseDown = false;
// }
//
// function rad(degrees) {
//     return degrees * (Math.PI / 180);
// }
//
// function drawSheep() {
//     sheep = new Sheep();
//     scene.add(sheep.group);
// }
//
// class Sheep {
//     constructor() {
//         this.group = new THREE.Group();
//         this.group.position.y = 0.4;
//
//         this.woolMaterial = new THREE.MeshStandardMaterial({
//             color: 0xffffff,
//             roughness: 1,
//             shading: THREE.FlatShading
//         });
//
//         this.skinMaterial = new THREE.MeshStandardMaterial({
//             color: 0xffaf8b,
//             roughness: 1,
//             shading: THREE.FlatShading
//         });
//
//         this.darkMaterial = new THREE.MeshStandardMaterial({
//             color: 0x4b4553,
//             roughness: 1,
//             shading: THREE.FlatShading
//         });
//
//
//         this.vAngle = 0;
//
//         this.drawBody();
//         this.drawHead();
//         this.drawLegs();
//     }
//
//     drawBody() {
//         const bodyGeometry = new THREE.IcosahedronGeometry(1.7, 0);
//         const body = new THREE.Mesh(bodyGeometry, this.woolMaterial);
//         body.castShadow = true;
//         body.receiveShadow = true;
//         this.group.add(body);
//     }
//
//     drawHead() {
//         const head = new THREE.Group();
//         head.position.set(0, 0.65, 1.6);
//         head.rotation.x = rad(-20);
//         this.group.add(head);
//
//         const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7);
//         const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
//         forehead.castShadow = true;
//         forehead.receiveShadow = true;
//         forehead.position.y = -0.15;
//         head.add(forehead);
//
//         const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1);
//         const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
//         face.castShadow = true;
//         face.receiveShadow = true;
//         face.position.y = -0.65;
//         face.rotation.y = rad(45);
//         head.add(face);
//
//         const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9);
//         const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
//         wool.position.set(0, 0.12, 0.07);
//         wool.rotation.x = rad(20);
//         head.add(wool);
//
//         const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
//         const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
//         rightEye.castShadow = true;
//         rightEye.receiveShadow = true;
//         rightEye.position.set(0.35, -0.48, 0.33);
//         rightEye.rotation.set(rad(130.8), 0, rad(-45));
//         head.add(rightEye);
//
//         const leftEye = rightEye.clone();
//         leftEye.position.x = -rightEye.position.x;
//         leftEye.rotation.z = -rightEye.rotation.z;
//         head.add(leftEye);
//
//         const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3);
//         rightEarGeometry.translate(0, -0.25, 0);
//         this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial);
//         this.rightEar.castShadow = true;
//         this.rightEar.receiveShadow = true;
//         this.rightEar.position.set(0.35, -0.12, -0.07);
//         this.rightEar.rotation.set(rad(20), 0, rad(50));
//         head.add(this.rightEar);
//
//         this.leftEar = this.rightEar.clone();
//         this.leftEar.position.x = -this.rightEar.position.x;
//         this.leftEar.rotation.z = -this.rightEar.rotation.z;
//         head.add(this.leftEar);
//     }
//
//     drawLegs() {
//         const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4);
//         legGeometry.translate(0, -0.5, 0);
//         this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
//         this.frontRightLeg.castShadow = true;
//         this.frontRightLeg.receiveShadow = true;
//         this.frontRightLeg.position.set(0.7, -0.8, 0.5);
//         this.frontRightLeg.rotation.x = rad(-12);
//         this.group.add(this.frontRightLeg);
//
//         this.frontLeftLeg = this.frontRightLeg.clone();
//         this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
//         this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
//         this.group.add(this.frontLeftLeg);
//
//         this.backRightLeg = this.frontRightLeg.clone();
//         this.backRightLeg.position.z = -this.frontRightLeg.position.z;
//         this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
//         this.group.add(this.backRightLeg);
//
//         this.backLeftLeg = this.frontLeftLeg.clone();
//         this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
//         this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
//         this.group.add(this.backLeftLeg);
//     }
// }

init();
render();