var level1 = [
    ['ground', 350],
    ['pipe', 20],
    ['pipe', 80],
    ['pipe', 100],
    ['bonus', 50, 10],
    ['enemy', 50]
]

function buildLevel(level){
    buildMario();
    buildFinish(level);

    for (let i = 0; i < level.length; i++){
        console.log(level[i]);
        switch (level[i][0]){
            case "enemy":
                var enemyGeometry = new THREE.SphereGeometry(4,10,10);
                var enemyTexture = new THREE.ImageUtils.loadTexture('texture/carbon.png');
                var enemyMaterial = Physijs.createMaterial(
                    new THREE.MeshLambertMaterial( {map: enemyTexture} ),
                    10,
                    0
                );
                enemy = new Physijs.SphereMesh(enemyGeometry, enemyMaterial, 10);
                enemy.position.set(level[i][1], 4.2, 0);
                enemy.name = 'enemy';
                scene.add(enemy);
                enemy.setAngularFactor(new THREE.Vector3(0, 0, 0));
                break;

        }
    }
}

function buildMario(){
    var marioGeometry = new THREE.BoxGeometry(8, 8, 8);
    var marioMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(255,0,0)'} ),
        10,
        1
    );
    mario = new Physijs.BoxMesh(marioGeometry, marioMaterial, 1);
    mario.position.set(0, 4.5, 0);
    scene.add(mario);
    mario.setAngularFactor(new THREE.Vector3(0, 0, 0));
}

function buildFinish(level){
    //flag
    var flagGeometry = new THREE.BoxGeometry(10,6,0.5);
    var flagMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(255,255,0)'} ),
        0,
        0
    );
    var flag = new Physijs.BoxMesh(flagGeometry, flagMaterial, 0);
    flag.position.set(5,9,0);

    //mast
    var mastGeometry = new THREE.CylinderGeometry(0.5,0.5,24,8);
    var mastMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: 'rgb(28,28,28)'} ),
        0,
        0
    );
    var mast = new Physijs.CylinderMesh(mastGeometry, mastMaterial, 0);
    mast.add(flag);
    mast.position.set(level[0][1]-10,12,0);
    mast.name = 'flag';
    scene.add(mast);
}