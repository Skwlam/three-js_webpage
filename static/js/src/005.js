var camera;
var scene;
var renderer;    // 设置 场景、渲染器、摄像机 全局变量

function init() {
    // 建立场景
    var scene = new THREE.Scene();
    // 设置摄像机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 添加渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth,
        window.innerHeight);
    renderer.shadowMap.enabled = true;


    // 设置聚光灯
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);



    // 设置坐标轴
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

    // 调速 UI 初始值
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    // 设置调速 UI
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    // 设置模型对象
    var loader = new THREE.ThreeMFLoader();
    loader.load("static/assets/models/all.3mf", function (geometry) {
        var mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1,
            roughness: 0.5,
        });
        var group = new THREE.Mesh(geometry, mat);
        group.rotation.x = -0.5 * Math.PI;
        group.scale.set(0.3, 0.3, 0.3);
        scene.add(group);
        renderScene();
    });

    // 设置摄像机位置
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);


    // 输出场景内容到 webgl-output
    document.getElementById("webgl-output").appendChild(renderer.domElement);
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();


    // 渲染场景
    renderScene();
    var step = 0;
    function renderScene() {
        stats.update();
        trackballControls.update(clock.getDelta());
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    // 窗口移动检测事件监听器，和根据缩放改变窗口尺寸
    window.addEventListener('resize', onResize, false);
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
