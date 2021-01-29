"use strict";

var scene, camera, renderer, controls;
var background, ground, wall, mario, bonus, pipeTop, pipe, enemy, platform;
var enemyList = [];

var keyboard = new THREEx.KeyboardState();

Physijs.scripts.worker = "physijs_worker.js";
Physijs.scripts.ammo = "js/physijs/ammo.js";

var isTouchingGround = true;
var canMoveToRight = false;
var canMoveToLeft = false;

var vector = new THREE.Vector3(0,0,0);

var marioSpeed = 30;
var marioMaxVelocity = 20;
var marioJumpIntensity = 60;

var enemySpeed = 30;

var clock = new THREE.Clock(false);
var textTime = "00:00";
var score = 0;

function init() {
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -80, 0));

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(0, 20, 90);
    camera.rotation.y = -0.5;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    buildLevel(level1);
    addLights();

    for(let i=0; i < enemyList.length; i++){
        enemyList[i].setLinearVelocity(vector.setX(enemySpeed));
    }

    mario.addEventListener("collision", function(other_object, velocity, rotation, contactNormal) {
        if (contactNormal.y === -1) {
            isTouchingGround = true;
        }

        if (other_object.name === "enemy"){
            if (contactNormal.y  <= -0.7){
                scene.remove(other_object);
                score += 500;
            } else if (window.confirm("Koniec hry! Chcete opakovať level?")){
                location.reload();
            }
        }

        if (other_object.name === "bonus") {
            score += 100;
            scene.remove(other_object);
        }

        if (other_object.name === "finish") {
            clock.stop();
            if (window.confirm("Gratulujem, level dokončený. Chcete hrať znova?")){
                location.reload();
            }
        }
    });

    for(let i=0; i < enemyList.length; i++){
        enemyList[i].addEventListener("collision", function(other_object, velocity, rotation, contactNormal) {
            if (other_object.name === "pipe") {
                enemyList[i].setLinearVelocity(new THREE.Vector3(enemyList[i].getLinearVelocity().x*-1),0,0);
            }
        });
    }

    clock.start();
}

function render(){
    updateScene();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

function updateScene() {

    for(let i=0; i < enemyList.length; i++){
        console.log(enemyList[i].getLinearVelocity());
    }

    updateLevelStats();
    correctMariosPositionY();

    if ( keyboard.pressed("D" ) ){
        canMoveToRight = true;
    }
    if ( keyboard.pressed("A" ) ){
        canMoveToLeft = true;
    }
    if ( keyboard.pressed("W") && isTouchingGround){
        mario.applyCentralImpulse(new THREE.Vector3(0,marioJumpIntensity,0,));
        isTouchingGround = false;
    }

    if (canMoveToRight && mario.getLinearVelocity().x < marioMaxVelocity) {
        if (isTouchingGround) {
            mario.setLinearVelocity(vector.setX(marioSpeed));
        } else {
            mario.applyCentralImpulse(vector.setX(0.2));
        }
    }

    if (canMoveToLeft && mario.getLinearVelocity().x > -marioMaxVelocity){
        if (isTouchingGround) {
            mario.setLinearVelocity(vector.setX(-marioSpeed));
        } else {
            mario.applyCentralImpulse(vector.setX(-0.2));
        }
    }

    canMoveToRight = false;
    canMoveToLeft = false;

    camera.position.x = mario.position.x-20;
}

function addLights() {
    let directionLight = new THREE.DirectionalLight(0xffffff, 1);
    directionLight.position.set(0,50,50);
    directionLight.castShadow = false;
    scene.add(directionLight);
}

function correctMariosPositionY(){
    if (mario.position.y < 4) {
        mario.position.y = 4;
        mario.__dirtyPosition = true;
    }
}

function updateLevelStats(){
    if (clock.running){
        let timeInSeconds = clock.getElapsedTime();
        let m = Math.floor(timeInSeconds % 3600 / 60);
        let s = Math.floor(timeInSeconds % 3600 % 60);

        if (m < 10) m = "0"+m;

        if (s < 10) s = "0"+s;
        textTime = m + ":" + s;
    }

    let firstLine = "Čas: " + textTime;
    let secondLine = "Skóre: " + score;
    let thirdLine = "Level: 1";
    document.getElementById("stats").innerHTML =
        firstLine + "<br>" +
        secondLine + "<br>" +
        thirdLine;
}

init();
render();