// three.js variables
var mesh, mesh2, mesh3, camera, scene, renderer;
var maxRotation = 2 * Math.PI;

// open link when object clicked
function objectClickHandler1() {
        window.open('https://github.com/steph-bot', '_blank');
}

function objectClickHandler2() {
        window.open('https://steph-bot.github.io', '_blank');
}

function objectClickHandler3() {
        window.open('https://steph-bot.github.io/geometry-landing-page/', '_blank');
}

// window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();
    
    var material = new THREE.MeshNormalMaterial({
        // wireframe: true 
    });
    var objectSize = 100;
    
    // Create a cube
    var boxGeometry = new THREE.BoxGeometry(objectSize, objectSize, objectSize);
    mesh = new THREE.Mesh(boxGeometry, material);
    mesh.position.set(objectSize * -2, 0, 0);
    // mesh.position.set(0, objectSize * -1.5, 0); // VERTICAL CONFIG

    mesh.callback = objectClickHandler1;

    // create second shape object
    var sphereGeometry = new THREE.DodecahedronGeometry(objectSize/1.5, 0); 
    // new THREE.SphereGeometry( objectSize / 2, 32, 32 );
    mesh2 = new THREE.Mesh(sphereGeometry, material);
    mesh2.position.set(0, 0, 0);
    mesh2.callback = objectClickHandler2;

    // create a cylinder
    var cylinderGeometry = new THREE.CylinderGeometry( objectSize/2, objectSize / 2, 64, 32 );
    mesh3 = new THREE.Mesh(cylinderGeometry, material);
    mesh3.position.set(objectSize * 2, 0, 0);
    // mesh3.position.set(0, objectSize * 1.5, 0); // VERTICAL CONFIG
    mesh3.callback = objectClickHandler3;

    scene.add(mesh);
    scene.add(mesh2);
    scene.add(mesh3);

    renderer = new THREE.WebGLRenderer({
            alpha: true
        });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var container = document.getElementById('canvasContainer');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.y = (mesh.rotation.y + 0.005) % maxRotation;
    mesh2.rotation.y = (mesh2.rotation.y + 0.005) % maxRotation;
    mesh3.rotation.y = (mesh3.rotation.y + 0.005) % maxRotation;
    
    renderer.render(scene, camera);
}

window.onload = function() {
    init();
    animate();

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // determine if object clicked and trigger its callback
    function onDocumentMouseDown(event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        meshObjects = [mesh, mesh2, mesh3]; // three.js objects with click handlers we are interested in
        
        var intersects = raycaster.intersectObjects(meshObjects);

        if (intersects.length > 0) {
            intersects[0].object.callback();
        }

    }

    // on hover, adjust the animation to provide visual feedback
    function onDocumentMouseMove(event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects([mesh, mesh2, mesh3]);
        var canvas = document.body.getElementsByTagName('canvas')[0];

        if (intersects.length > 0) {
            intersects[0].object.rotation.x += .05;
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
        }

    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
};