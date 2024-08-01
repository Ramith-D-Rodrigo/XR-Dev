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
    scene.background = new THREE.Color('white');

    const fog = new THREE.Fog(0x262837, 1, 100);
    scene.fog = fog;

    // GEOEMTRY
        // upright plane
    const planeWidth = 256;
    const planeHeight = 256;

    const planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight);
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
    
    const textureLoader = new THREE.TextureLoader();

    const planeTextureMap = textureLoader.load('textures/pebbles/Pebbles_024_BaseColor.jpg');
    const planeNormalMap = textureLoader.load('textures/pebbles/Pebbles_024_Normal.jpg');
    const planeRoughnessMap = textureLoader.load('textures/pebbles/Pebbles_024_Roughness.jpg');
    const planeDisplacementMap = textureLoader.load('textures/pebbles/Pebbles_024_Height.png');
    const ambientOcclusionMap = textureLoader.load('textures/pebbles/Pebbles_024_AmbientOcclusion.jpg');

    //texture map wrapping
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);

    planeNormalMap.wrapS = THREE.RepeatWrapping;
    planeNormalMap.wrapT = THREE.RepeatWrapping;
    planeNormalMap.repeat.set(16, 16);

    planeRoughnessMap.wrapS = THREE.RepeatWrapping;
    planeRoughnessMap.wrapT = THREE.RepeatWrapping;
    planeRoughnessMap.repeat.set(16, 16);

    planeDisplacementMap.wrapS = THREE.RepeatWrappming;
    planeDisplacementMap.wrapT = THREE.RepeatWrapping;
    planeDisplacementMap.repeat.set(16, 16);

    ambientOcclusionMap.wrapS = THREE.RepeatWrapping;
    ambientOcclusionMap.wrapT = THREE.RepeatWrapping;
    ambientOcclusionMap.repeat.set(16, 16);

    //mipmapping
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeNormalMap.minFilter = THREE.NearestFilter;
    planeRoughnessMap.minFilter = THREE.NearestFilter;
    planeDisplacementMap.minFilter = THREE.NearestFilter;
    ambientOcclusionMap.minFilter = THREE.NearestFilter;

    //set anisotropy
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    planeNormalMap.anisotropy = gl.getMaxAnisotropy();
    planeRoughnessMap.anisotropy = gl.getMaxAnisotropy();
    planeDisplacementMap.anisotropy = gl.getMaxAnisotropy();
    ambientOcclusionMap.anisotropy = gl.getMaxAnisotropy();


    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        normalMap: planeNormalMap,
        displacementMap: planeDisplacementMap,
        aoMap: ambientOcclusionMap,
        displacementScale: 0.5,
        displacementBias: -0,
        side: THREE.DoubleSide
    });

    

    // LIGHT
    const lightColor = 0xFFFFFF;
    const lightIntensity = 1;
    const light = new THREE.DirectionalLight(lightColor, lightIntensity);
    light.position.set(0, 30, 30);
    scene.add(light);

    const ambientColor = 0xFFFFFF;
    const ambientIntensity = 0.3;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // MESH
    const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    cube.position.set(cubeSize, cubeSize, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeo, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    light.target = plane; //tilt the light towards the plane
    scene.add(light.target);

    // RENDER/DRAW
    function draw(time) {
        time *= 0.001;//convert time to seconds

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

        light.position.x = 20 * Math.cos(time);
        light.position.y = 20 * Math.sin(time);

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