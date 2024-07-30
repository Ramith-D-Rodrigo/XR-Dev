import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r99/three.module.min.js"

main();

function main() {
    // create the context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({canvas, antialias: true});

    // create and set the camera
    const fov = 75; //field of view in radians
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.set(0, 8,30);

    // create the scene
    const scene = new THREE.Scene();

    // GEOEMTRY
        // upright plane
        // cube
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        // sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);
    
    // MATERIAL
    const cubeMaterial = new THREE.MeshPhongMaterial({color: 'red'});
    const sphereMaterial = new THREE.MeshPhongMaterial({color: 'tan'});

    // LIGHT
    const lightColor = 0xFFFFFF;
    const lightIntensity = 1;
    const light = new THREE.DirectionalLight(lightColor, lightIntensity);
    scene.add(light);

    // MESH
    const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);


    // RENDER/DRAW
    function draw() {

        if(resizeGLToDisplaySize(gl)) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        sphere.rotation.y += 0.01;

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    // ANIMATION LOOP
    requestAnimationFrame(draw);

    //UPDATE
}

function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width != width || canvas.height != height;

    if(needResize){
        gl.setSize(width, height, false);
    }

    return needResize;
}