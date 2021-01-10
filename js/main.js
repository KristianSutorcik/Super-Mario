'use strict';

var scene, camera, renderer, controls;
var backGround, plane, cube, cylinder, enemy;

var keyboard = new THREEx.KeyboardState();

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/physijs/ammo.js';

var isTouchingGround = true;
var canMoveToRight = false;
var canMoveToLeft = false;

var speed = 50;
var vector = new THREE.Vector3(0,0,0,);

var enemySpeed = 20;

function init() {
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -70, 0));

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(0, 5, 170);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    addObjects();
    addLights();

    cube.addEventListener('collision', function(other_object, velocity, rotation, contactNormal) {
        if (contactNormal.y === -1) {
            isTouchingGround = true;
        }
        if (other_object.name === 'enemy'){
            console.log(contactNormal.y);
            if (contactNormal.y  <= -0.8){
                console.log('enemy is dead');
                scene.remove(other_object);
            }
            // if (window.confirm('Game Over. Do you want to repeat?')){
            //     window.open('index.html');
            // }
        }
    });

    enemy.addEventListener('collision', function(other_object, velocity, rotation, contactNormal) {
        if (contactNormal.x === -1 || contactNormal.x === 1) {
            enemySpeed = enemySpeed * -1;
        }
    });



}

function render(){
    update();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

function update() {

    if (cube.position.y < 4) {
        cube.position.y = 4;
        cube.__dirtyPosition = true;
    }

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

    if (cube.position.x >= 200) {
        if (window.confirm('Level Completed. Do you want to repeat?')){
            window.open('index.html');
        }
    }

    if (enemy.parent === scene){
        enemy.setLinearVelocity(vector.setX(-enemySpeed));
    }

    // console.log(cube.position.y);
    // console.log(cube.getLinearVelocity());
}

function addObjects(){

    //background
    var backgroundGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var backgroundTexture = new THREE.ImageUtils.loadTexture( 'texture/desert.jpg' );
    var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture,
        transparent: true, side: THREE.BackSide} );
    backGround = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
    backGround.position.set(0, 0, 0);
    scene.add( backGround );

    //invisible walls - left, top
    var planeMaterial = Physijs.createMaterial(
        // new THREE.MeshLambertMaterial( {transparent: true, opacity: 0} ),
        new THREE.MeshBasicMaterial( {color: 'rgb(0,0,255)'} ),
        0,
        0
    );

    var planeGeometry = new THREE.PlaneGeometry( 8, 100, 1, 1);
    plane = new Physijs.PlaneMesh(planeGeometry, planeMaterial, 0);
    plane.position.set(-4.5, 50, 0);
    plane.rotation.y = Math.PI / 2;
    scene.add(plane);

    var planeGeometry = new THREE.PlaneGeometry( 400, 8, 1, 1);
    plane = new Physijs.PlaneMesh(planeGeometry, planeMaterial, 0);
    plane.position.set(196, 100, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    //boxes - ground
    var planeGeometry = new THREE.CubeGeometry(8, 8, 8);
    var planeTexture = new THREE.ImageUtils.loadTexture('texture/box.jpg');
    var planeMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: planeTexture } ),
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
        5,
        1
    );
    cube = new Physijs.BoxMesh(cubeGeometry, cubeMaterial, 1);
    cube.position.set(0, 4, 0);
    scene.add(cube);
    cube.setAngularFactor(new THREE.Vector3(0, 0, 0));

    //obstacles
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
    cylinder.name = 'cylinder';
    scene.add(cylinder);

    //obstacle
    var cylinderGeometry = new THREE.CylinderGeometry(4, 4, 16, 40);
    var cylinderMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(0,255,0)'} ),
        10,
        0
    );
    cylinder = new Physijs.CylinderMesh(cylinderGeometry, cylinderMaterial, 0);
    cylinder.position.set(94,8, 0);

    var cylinderGeometry = new THREE.CylinderGeometry(6, 6, 2, 40);
    var cylinderMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(0,255,0)'} ),
        10,
        0
    );
    var smallcylinder = new Physijs.CylinderMesh(cylinderGeometry, cylinderMaterial, 0);
    smallcylinder.position.set(0,9,0);
    cylinder.add(smallcylinder);
    cylinder.name = 'cylinder';
    scene.add(cylinder);

    //enemy
    var enemyGeometry = new THREE.SphereGeometry(4,10,10);
    var enemyTexture = new THREE.ImageUtils.loadTexture('texture/carbon.png');
    var enemyMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: enemyTexture} ),
        10,
        0
    );
    enemy = new Physijs.SphereMesh(enemyGeometry, enemyMaterial, 10);
    enemy.position.set(85, 4, 0);
    enemy.name = 'enemy';
    scene.add(enemy);
    enemy.setAngularFactor(new THREE.Vector3(0, 0, 0));

}

function addLights() {

    var directionLight = new THREE.DirectionalLight(0xffffff, 1);
    directionLight.position.set(0,50,50);
    directionLight.castShadow = true;
    scene.add(directionLight);
}

init();
render();