function init() {
    // 建立场景
    var scene = new THREE.Scene();
    // 摄像机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 渲染
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth,
        window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 左上角帧数显示窗口
    var stats = initStats();
    function initStats(type) {
        var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
        var stats = new Stats();
        stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        return stats;
    }

    // 调速初始值
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    // 调速 UI
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    // timing
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    // 灯光
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    // 坐标轴
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 创建对象
    var loader = new THREE.OBJLoader();
    loader.load('./static/assets/models/pinecone/pinecone.obj', function (mesh) {
        var material = new THREE.MeshLambertMaterial({    // 添加颜色
            color: 0xAAAA00
        });
        // 遍历 mesh 集合，为每一项添加 material
        mesh.children.forEach(function (child) {
            child.material = material;
            child.geometry.computeVertexNormals();
            child.geometry.computeFaceNormals();
        });
        mesh.scale.set(120, 120, 120)    // 设置对象大小
        scene.add(mesh);    // 将对象加入场景
        renderScene();
    });

    // 摄像机设置
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // 将渲染结果添加至 html 相应的 webgl-output 这一 ID
    document.getElementById("webgl-output").appendChild(renderer.domElement);


    // 调用 renderScene 函数
    renderScene();
    var step = 0;
    // 新建用于动画的函数
    function renderScene() {
        stats.update();

        trackballControls.update(clock.getDelta());


        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);    // 渲染场景
    }

    // 根据浏览器窗口大小，修改界面大小
    window.addEventListener('resize', onResize, false);    // 监听窗口大小变动
    function onResize() {    // 修改窗口大小
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}