'use strict';

var scene, camera, renderer, controls;
var axes, plane, cube, backGround, cylinder;

var keyboard = new THREEx.KeyboardState();

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/physijs/ammo.js';

var isTouchingGround = false;
var cylinders = [];

function init() {
    // scene = new THREE.Scene();
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -70, 0));

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(0, 5, 170);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor('rgb(255,255,255)');
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    addObjects();
    addLights();

    cube.addEventListener('collision', function(other_object, velocity, rotation, contactNormal) {
        console.log('collision');
        console.log(contactNormal);
        if (contactNormal.y === -1) {
            isTouchingGround = true;
        }
    });

}

function render(){
    update();
    // camera.lookAt(cube);
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

var canMoveToRight = false;
var canMoveToLeft = false;
// var canJump = true;
var speed = 50;
var vector = new THREE.Vector3(0,0,0,);

function update() {

    if ( keyboard.pressed("D" ) ){
        canMoveToRight = true;
    }

    if ( keyboard.pressed("A" ) ){
        canMoveToLeft = true;
    }

    if ( keyboard.pressed("W") && isTouchingGround){
        cube.applyCentralImpulse(new THREE.Vector3(0,60,0,));
        isTouchingGround = false;
        // if (cylinder.parent === scene) {
        //     scene.remove(cylinder);
        // }
    }

    if (canMoveToRight) {
        if (isTouchingGround) {
            cube.setLinearVelocity(vector.setX(speed));
        } else {
            cube.applyCentralImpulse(new THREE.Vector3(0.2,0,0,));
        }
    }

    if (canMoveToLeft){
        if (isTouchingGround) {
            cube.setLinearVelocity(vector.setX(-speed));
        } else {
            cube.applyCentralImpulse(new THREE.Vector3(-0.2,0,0,));
        }
    }

    canMoveToRight = false;
    canMoveToLeft = false;

    camera.position.x = cube.position.x;

    // console.log(cube.position.y);
    // console.log(cube.getLinearVelocity());
}

function addObjects(){
    axes = new THREE.AxesHelper(50);
    scene.add(axes);

    //background
    var backgroundGeometry = new THREE.SphereGeometry(1100, 50, 50);
    var backgroundTexture = new THREE.ImageUtils.loadTexture( 'texture/desert.jpg' );
    var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture,
        transparent: true, side: THREE.BackSide} );
    backGround = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
    backGround.position.set(0, 0, 0);
    scene.add( backGround );

    //invisible wall - left side
    var planeGeometry = new THREE.CubeGeometry(8, 100, 8);
    var planeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {transparent: true, opacity: 0} ),
        0,
        0
    );
    plane = new Physijs.BoxMesh(planeGeometry, planeMaterial, 0);
    plane.position.set(-8, 50, 0);
    scene.add(plane);

    //boxes - ground
    var planeGeometry = new THREE.CubeGeometry(8, 8, 8);
    var planeTexture = new THREE.ImageUtils.loadTexture('texture/box.jpg');
    var planeMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: planeTexture, wireframe: false } ),
        0,
        0
    );
    for (let i = 0; i < 50; i++){
        plane = new Physijs.BoxMesh(planeGeometry, planeMaterial, 0);
        plane.position.set(i*8, -4, 0);
        scene.add(plane);
    }
    for (let i = 0; i < 5; i++){
        plane = new Physijs.BoxMesh(planeGeometry, planeMaterial, 0);
        plane.position.set(i*8+40, 30, 0);
        scene.add(plane);
    }

    //player - controllable object
    var cubeGeometry = new THREE.CubeGeometry(8, 8, 8);
    var cubeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(255,0,0)'} ),
        10,
        1
    );
    cube = new Physijs.BoxMesh(cubeGeometry, cubeMaterial, 1);
    cube.position.set(0, 4.1, 0);
    scene.add(cube);
    cube.setAngularFactor(new THREE.Vector3(0, 0, 0));

    //obstacle
    var cylinderGeometry = new THREE.CylinderGeometry(4, 4, 16, 40);
    var cylinderMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(0,255,0)'} ),
        10,
        0
    );
    cylinder = new Physijs.CylinderMesh(cylinderGeometry, cylinderMaterial, 0);
    cylinder.position.set(20,8, 0);

    var cylinderGeometry = new THREE.CylinderGeometry(6, 6, 2, 40);
    var cylinderMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(0,255,0)'} ),
        10,
        0
    );
    var smallcylinder = new Physijs.CylinderMesh(cylinderGeometry, cylinderMaterial, 0);
    smallcylinder.position.set(0,9,0);
    cylinder.add(smallcylinder);
    scene.add(cylinder);

    cylinders.push(cylinder);
}

function addLights() {
    var ambientLight = new THREE.AmbientLight('rgb(255,255,255)');
    ambientLight.intensity = 0.7;
    scene.add(ambientLight);

    // var spotLight = new THREE.SpotLight();
    // spotLight.position.set(0,20,20);
    // spotLight.intensity = 1;
    // scene.add(spotLight);
}

init();
render();