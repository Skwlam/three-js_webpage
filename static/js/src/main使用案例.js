/* 
    使用案例
*/

// 现在开始拍电影
const scene = init_scene();
let rst = init_camera(-200, 25, 0, scene);
let camera = rst[0];
let fsControls = rst[1];
// console.log("camera",camera);
const renderer = init_renderer("body");
init_light(scene);
rst = init_model(scene);
let mesh1 = rst[0] ;
let mesh2 = rst[1] ;
let mesh3 = rst[2] ;
init_audio(camera,mesh1,mesh2,mesh3)


add_axesHelper(scene);
const stats = add_stats()
add_contrls()
add_ground_helper(scene)

init_render(stats,fsControls,renderer,scene,camera)

add_resize(camera,renderer)