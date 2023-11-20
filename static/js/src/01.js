function init() {
    // 场景
    var scene = new THREE.Scene();

    // 摄像机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 渲染
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));      // 添加阴影
    renderer.setSize(window.innerWidth,
    window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 灯光
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near =
    scene.add(spotLight);

    // 坐标轴
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 创建 plane: 灰色平面
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color:
            0xffffff
    })
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // 创建 cube: 红色正方体
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color:
            0xff0000
    })
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 创建 Sphere: 蓝色球体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color:
            0x7777ff
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    // 调整摄像机位置与方向
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // 渲染内容并展示在 webgl-output 这个 ID 中。
    document.getElementById("webgl-output").appendChild(renderer.domElement);
    // render the scene
    renderer.render(scene, camera);
}