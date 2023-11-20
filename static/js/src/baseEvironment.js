/* 
    创建环境的元素
    1.场景
    2.相机
    3.渲染器
    4.光照
    5.模型
    6.音效
    7.递归调用渲染场景
    8.窗口更新
*/

function init_scene(){
    // 物理场场景——普通场景的包装器
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0035);
    return scene;
}

function init_camera(x,y,z,scene){
    const array = [];
    // 相机
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
    // 调整相机的位置和朝向
    // 设置相机的位置
    camera.position.set(x, y, z);
    // 设置相机拍照的方向，场景中心
    camera.lookAt(scene.position);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    array.push(camera)

    // 初始化控制场景中相机对象，经过测试：添加了此对象后，鼠标点击失效
    // var trackballControls = initTrackballControls(camera, renderer);
    var fsControls = new THREE.FirstPersonControls(camera);
    fsControls.movementSpeed = 70;
    fsControls.lookSpeed = 0.15;
    fsControls.noFly = true;
    fsControls.lookVertical = false;
    array.push(fsControls);

    return array;
}

function init_renderer(id="body"){
    // 摄影师：renderer渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    // 将摄影师拍摄的内容，放入到网页中
    // document.getElementById("webgl-output").appendChild(renderer.domElement);
    document.getElementById(id).appendChild(renderer.domElement);

    return renderer;
}

function init_light(scene){
    // 添加光照
    // 添加环境光
    const ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);
    
    // 添加聚光灯，用于产生光影
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 50, 120);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    // 光源务必要添加到场景中才能起作用
    scene.add(spotLight);
    
    // 平行光
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0.5, 1).normalize();
    scene.add(light);
}

// 按下快门拍照，这个务必要放在最后
// render the scene
// renderer.render(scene, camera);

function init_model(scene){
    const array = [];
    // 模型
    const cube = new THREE.BoxGeometry(40, 40, 40);
    
    const material_1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: THREE.ImageUtils.loadTexture("static/assets/textures/animals/cow.png")
    });
    
    const material_2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: THREE.ImageUtils.loadTexture("static/assets/textures/animals/dog.jpg")
    });
    
    const material_3 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: THREE.ImageUtils.loadTexture("static/assets/textures/animals/cat.jpg")
    });

    // sound spheres
    const mesh1 = new THREE.Mesh(cube, material_1);
    mesh1.position.set(0, 20, 100);
    const mesh2 = new THREE.Mesh(cube, material_2);
    mesh2.position.set(0, 20, 0);
    const mesh3 = new THREE.Mesh(cube, material_3);
    mesh3.position.set(0, 20, -100);
    
    scene.add(mesh1);
    scene.add(mesh2);
    scene.add(mesh3);

    array.push(mesh1);
    array.push(mesh2);
    array.push(mesh3);

    return array;
}

function init_audio(camera,mesh1,mesh2,mesh3){    
    // 场景中加入声音
    const startButton = document.getElementById( 'startButton' );
    startButton.addEventListener( 'click', init );
    function init(){
        // 创建虚拟的声音监听者
        const listener1 = new THREE.AudioListener();
        // 监听者绑定到相机对象
        camera.add(listener1);
        const listener3 = new THREE.AudioListener();
        camera.add(listener3);
    
        // 非位置音频可用于不考虑位置的背景音乐
        // 创建监听者
        const listener2 = new THREE.AudioListener();
        // camera.add(listener2);
        // 创建一个非位置音频对象，用来控制播放
        const audio2 = new THREE.Audio(listener2)
        // 创建一个音频加载器对象
        const audioLoader2 = new THREE.AudioLoader();
        // 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
        audioLoader2.load("/static/assets/audio/cat.ogg",function(AudioBuffer){
            // console.log(AudioBuffer);
            // 音频缓冲区对象关联到音频对象audio2
            audio2.setBuffer(AudioBuffer);
            audio2.setLoop(true);//是否循环
            audio2.setVolume(0.5);//音量
            // 播放缓冲区中的音频数据
            audio2.play();//play播放;stop停止;pause暂停
        })
    
        // 创建位置音频对象，监听者作为参数，音频和监听者关联
        const posSound1 = new THREE.PositionalAudio( listener1 );
        const posSound2 = new THREE.PositionalAudio( listener1 );
        const posSound3 = new THREE.PositionalAudio( listener1 );
    
        // 创建音频加载器对象
        const audioLoader = new THREE.AudioLoader();
        // 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
        audioLoader.load('static/assets/audio/cow.ogg', function(buffer) {
            // console.log(AudioBuffer);
            posSound1.setBuffer( buffer );
            posSound1.setRefDistance( 30 );
            posSound1.play();
            posSound1.setRolloffFactor(10);
            posSound1.setLoop(true);
        });
    
        audioLoader.load('static/assets/audio/dog.ogg', function(buffer) {
            posSound2.setBuffer( buffer );
            posSound2.setRefDistance( 30 );
            posSound2.play();
            posSound2.setRolloffFactor(10);
            posSound2.setLoop(true);
        });
    
        audioLoader.load('static/assets/audio/cat.ogg', function(buffer) {
            posSound3.setBuffer( buffer );
            posSound3.setRefDistance( 30 );
            posSound3.play();
            posSound3.setRolloffFactor(10);
            posSound3.setLoop(true);
        });
    
        // 音源绑定到网格模型上
        mesh1.add(posSound1);
        mesh2.add(posSound2);
        mesh3.add(posSound3);
    }
}

function init_render(stats,fsControls,renderer,scene,camera){
    // 时钟对象
    const clock = new THREE.Clock();
    // 调用递归函数
    render();
    // 添加动画
    function render() {
        // 更新帧率显示
        stats.update();
        // 更新控制对象
        let delta = clock.getDelta();
        // trackballControls.update(delta);
        fsControls.update(delta);
        
        // 递归调用生成动画
        requestAnimationFrame(render);
        // 按下快门拍照
        renderer.render(scene, camera);
    }
}

function add_resize(camera,renderer){
    // 注册一个事件监听
    window.addEventListener('resize', onResize, false);
    // 定义回调函数
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}