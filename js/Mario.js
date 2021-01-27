class Mario {
    constructor() {
        // this.group = new THREE.Group();
        // this.group.position.y = 0.4;
        //
        // this.woolMaterial = new THREE.MeshStandardMaterial({
        //     color: 0xffffff,
        //     roughness: 1,
        //     shading: THREE.FlatShading
        // });
        // this.skinMaterial = new THREE.MeshStandardMaterial({
        //     color: 0xffaf8b,
        //     roughness: 1,
        //     shading: THREE.FlatShading
        // });
        // this.darkMaterial = new THREE.MeshStandardMaterial({
        //     color: 0x4b4553,
        //     roughness: 1,
        //     shading: THREE.FlatShading
        // });
        //
        // this.vAngle = 0;
        //
        // this.drawBody();
        this.marioGeometry = new THREE.BoxGeometry(8, 8, 8);
        this.marioMaterial = Physijs.createMaterial(
            new THREE.MeshLambertMaterial( {color: 'rgb(255,0,0)'} ),
            10,
            1
        );
        mario = new Physijs.BoxMesh(marioGeometry, marioMaterial, 1);
        mario.position.set(0, 4.5, 0);
        scene.add(this);
        this.setAngularFactor(new THREE.Vector3(0, 0, 0));

    }
}