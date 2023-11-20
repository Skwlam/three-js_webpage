/* 
    辅助开发用的对象
    1.坐标系
    2.帧率状态
    3.控制UI
    4.地面辅助网格
*/

function add_axesHelper(scene){
    // 辅助坐标系
    /* 红色x蓝色z绿色y */
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);
}

function add_stats(){
    // 帧率辅助工具
    const stats = initStats();
    return stats;
}

function add_contrls(){
    // 交互调试控制界面
    var controls = new function () {
        this.velocity = -2;
        this.wheelAngle = 0.5;
    
        this.loosenXRight = 0.0001;
        this.loosenXLeft = 0.0001;
    
        this.changeVelocity = function () {
           console.log("变速");
        };
    
        this.changeOrientation = function () {
            console.log("变方向");
        }
    
    };
    
    var gui = new dat.GUI();
    gui.add(controls, 'velocity', -10, 10).onChange(controls.changeVelocity);
    gui.add(controls, 'wheelAngle', -1, 1).onChange(controls.changeOrientation);
    gui.add(controls, 'loosenXRight', 0, 0.5).step(0.01).onChange(controls.changeOrientation);
    gui.add(controls, 'loosenXLeft', 0, 0.6).step(-0.01).onChange(controls.changeOrientation);
    controls.loosenXLeft = 0;
    controls.loosenXRight = 0;
}

function add_ground_helper(scene){
    // ground
    const helper = new THREE.GridHelper(500, 10);
    helper.position.y = 0.1;
    scene.add(helper);
}