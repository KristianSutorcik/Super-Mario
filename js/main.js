"use strict";

var scene, camera, renderer, controls;
var background, ground, wall, mario, bonus, pipeTop, pipe, enemy, platform, scoreObject;
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

    addEventListeners();

    enemyList.forEach(function (e){
        e.setLinearVelocity(vector.setX(enemySpeed));
    });

    clock.start();
}

function render(){
    updateScene();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

function updateScene() {
    updateLevelStats();
    movementControls();
    movement();
    correctMariosPositionY();
    camera.position.x = mario.position.x-20;
}

function addEventListeners(){
    mario.addEventListener("collision", function(other_object, velocity, rotation, contactNormal) {
        if (contactNormal.y === -1) {
            isTouchingGround = true;
            scene.remove( scoreObject );
        }

        if (other_object.name === "enemy"){
            if (contactNormal.y <= -0.7){
                scene.remove(other_object);
                score += 100;
                scoreObject.position.set(mario.position.x, mario.position.y+5, 0);
                scene.add(scoreObject);
            } else if (window.confirm("Koniec hry! Chcete opakovať level?")){
                location.reload();
            }
        }

        if (other_object.name === "bonus") {
            score += 100;
            scene.remove(other_object);
            scoreObject.position.set(mario.position.x, mario.position.y+5, 0);
            scene.add(scoreObject);
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
}

function addLights() {
    let directionLight = new THREE.DirectionalLight('rgb(255,255,255)', 0.5);
    directionLight.position.set(0,50,50);
    directionLight.castShadow = false;
    scene.add(directionLight);

    let directionLight2 = new THREE.DirectionalLight('rgb(255,255,255)', 0.5);
    directionLight2.position.set(-50,50,50);
    directionLight2.castShadow = false;
    scene.add(directionLight2);
}

function correctMariosPositionY(){
    if (mario.position.y < 4) {
        mario.position.y = 4;
        mario.__dirtyPosition = true;
    }
}

function movementControls(){
    if ( keyboard.pressed("D" ) ){
        canMoveToRight = true;
    }
    if ( keyboard.pressed("A" ) ){
        canMoveToLeft = true;
    }
    if ( keyboard.pressed("W") && isTouchingGround){
        mario.applyCentralImpulse(new THREE.Vector3(0,marioJumpIntensity,0));
        isTouchingGround = false;
    }
    if ( keyboard.pressed("R" ) ){
        location.reload();
    }
}

function movement(){
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

    let levelText = "Level <br> 1";
    let scoreText = "Skóre " + "<br>" + score;
    let timeText = "Čas " + "<br>" + textTime;
    document.getElementById("level").innerHTML = levelText;
    document.getElementById("score").innerHTML = scoreText;
    document.getElementById("time").innerHTML = timeText;
}

init();
render();