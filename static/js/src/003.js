var camera;
var scene;
var renderer;

function init() {
    // 现在开始拍电影
    // 建立场景
    var scene = new THREE.Scene();
    // 摄像机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 摄影师
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth,
    window.innerHeight);
    renderer.shadowMap.enabled = true;



    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);



    // 场记
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    function initStats(type) {
        var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
        var stats = new Stats();
        stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        return stats;
    }

    var stats = initStats();


    var controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);


    

    // 演员
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath("./static/assets/models/butterfly/")
    mtlLoader.load('butterfly.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./static/assets/models/butterfly/butterfly.obj', function (object) {
            // move wings to more horizontal position
            [0, 2, 4, 6].forEach(function (i) {
                object.children[i].rotation.z = 0.3 * Math.PI
            });
            [1, 3, 5, 7].forEach(function (i) {
                object.children[i].rotation.z = -0.3 * Math.PI
            });
            // configure the wings,
            var wing2 = object.children[5];
            var wing1 = object.children[4];
            wing1.material.opacity = 0.9;
            wing1.material.transparent = true;
            wing1.material.depthTest = false;
            wing1.material.side = THREE.DoubleSide;
            wing2.material.opacity = 0.9;
            wing2.material.depthTest = false;
            wing2.material.transparent = true;
            wing2.material.side = THREE.DoubleSide;
            object.scale.set(140, 140, 140);
            mesh = object;
            object.rotation.x = 0.2;
            object.rotation.y = -1.3;
            
            scene.add(mesh);
            renderScene()
        });
    });



    // position and point the camera to the center of the scene
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);


    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // add the two lines below
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();


    renderScene();
    var step = 0;
    function renderScene() {
        stats.update();

        trackballControls.update(clock.getDelta());


        

        requestAnimationFrame(renderScene);
        // render the scene
        renderer.render(scene, camera);
    }


    window.addEventListener('resize', onResize, false);
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}