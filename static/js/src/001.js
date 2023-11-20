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

    // 创景 plane：灰色平面
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color:
            0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // 创景 cube：正方体红色
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color:
            0xff0000
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 创建 sphere：蓝色球体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color:
            0x7777ff
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

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

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        /*  旧的普通运动
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.02;
            cube.rotation.z += 0.
    
            step += 0.04;
            sphere.position.x = 20 + 10 * (Math.cos(step));
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
        */

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