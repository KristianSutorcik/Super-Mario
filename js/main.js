"use strict";

Physijs.scripts.worker = "physijs_worker.js";
Physijs.scripts.ammo = "js/physijs/ammo.js";

var scene, camera, renderer, controls;
var background, ground, wall, mario, bonus, pipeTop, pipe, enemy, platform, scoreObject, mast, flag;
var objectList = [];
var enemyList = [];

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock(false);
var textTime;
var score;

var vector;

var marioSpeed = 30;
var marioMaxVelocity = 20;
var marioJumpIntensity = 60;
var marioRotationY = 0;
var isTouchingGround;
var marioCanMoveRight;
var marioCanMoveLeft;

var enemySpeed = 30;

var level = level1;

function init() {

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -80, 0));

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 20, 90);
    camera.rotation.y = -0.5;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // controls = controls = new THREE.OrbitControls(camera, renderer.domElement);

    resetGUI();
    buildLevel(level);
    addEventListeners();
    addLights();
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

    enemyList.forEach(function (e){
        e.setLinearVelocity(vector.setX(enemySpeed));
    });

    // controls.update();
    console.log(mario)
}

function addEventListeners(){
    mario.addEventListener("collision", function(other_object, velocity, rotation, contactNormal) {
        if (contactNormal.y === -1) {
            isTouchingGround = true;
            scene.remove( scoreObject );
            console.log(other_object);
        }

        if (other_object.name === "enemy"){
            if (contactNormal.y <= -0.7){
                for (let i = 0; i < enemyList.length; i++){
                    if(enemyList[i] === other_object) enemyList.splice(i, 1);
                }
                showScoreObject(other_object);
            } else if (window.confirm("Koniec hry!")){
                nextLevel(level);
            } else {
                nextLevel(level);
            }
        }

        if (other_object.name === "bonus") {
            showScoreObject(other_object);
        }

        if (other_object.name === "finish") {
            clock.stop();
            if (window.confirm("Gratulujem, Level " + level[0][1] + " dokončený." +
                            "\nSkóre: "+ score + "    Čas: " + textTime +
                            "\n\nChcete pokračovať na ďalší level?")){
                level = level[level.length-1][1];
                nextLevel(level);
            } else {
                nextLevel(level);
            }
        }
    });

    for(let i=0; i < enemyList.length; i++){
        enemyList[i].addEventListener("collision", function(other_object, velocity, rotation, contactNormal) {
            if (other_object.name === "pipe") {
                enemySpeed = enemySpeed * -1;
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

    // let ambientLight = new THREE.AmbientLight;
    // scene.add(ambientLight);
}

function correctMariosPositionY(){
    if (mario.position.y < 5) {
        mario.position.y = 5;
        mario.__dirtyPosition = true;
    }
}

function movementControls(){
    if ( keyboard.pressed("D" ) ){
        marioCanMoveRight = true;
        marioRotationY = 0;
    }
    if ( keyboard.pressed("A" ) ){
        marioCanMoveLeft = true;
        marioRotationY = Math.PI;
    }
    if ( keyboard.pressed("W") && isTouchingGround){
        mario.applyCentralImpulse(new THREE.Vector3(0,marioJumpIntensity,0));
        isTouchingGround = false;
    }
    if ( keyboard.pressed("R") ){
        nextLevel(level);
    }
    mario.rotation.y = marioRotationY;
}

function movement(){
    if (marioCanMoveRight && mario.getLinearVelocity().x < marioMaxVelocity) {
        if (isTouchingGround) {
            mario.setLinearVelocity(vector.setX(marioSpeed));
        } else {
            mario.applyCentralImpulse(vector.setX(0.2));
        }
    }

    if (marioCanMoveLeft && mario.getLinearVelocity().x > -marioMaxVelocity){
        if (isTouchingGround) {
            mario.setLinearVelocity(vector.setX(-marioSpeed));
        } else {
            mario.applyCentralImpulse(vector.setX(-0.2));
        }
    }

    marioCanMoveRight = false;
    marioCanMoveLeft = false;
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
    let levelText = "Level<br>" + level[0][1];
    let scoreText = "Skóre<br>" + score;
    let timeText = "Čas<br>" + textTime;

    document.getElementById("level").innerHTML = levelText;
    document.getElementById("score").innerHTML = scoreText;
    document.getElementById("time").innerHTML = timeText;
}

function showScoreObject(other_object){
    scene.remove(other_object);
    score += 100;
    scoreObject.position.set(mario.position.x, mario.position.y+5, 0);
    objectList.push(scoreObject);
    scene.add(scoreObject);
}

function nextLevel(level){
    objectList.forEach(function (o){
        scene.remove(o);
    });
    resetGUI();
    buildLevel(level);
    addEventListeners();
    keyboard = new THREEx.KeyboardState();
}

function resetGUI(){
    // isTouchingGround = true;
    // marioCanMoveRight = false;
    // marioCanMoveLeft = false;
    marioRotationY = 0;
    vector = new THREE.Vector3(0,0,0);
    textTime = "00:00";
    score = 0;
    clock.start();
}

init();
render();