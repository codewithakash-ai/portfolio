// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------
// 1. Three.js Background Implementation
// --------------------------------------------------------
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
// Slight fog
scene.fog = new THREE.FogExp2(0x05050a, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00f2fe, 2);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xf8049c, 2);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

// Create floating particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x4facfe,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create some 3D shapes (Torus, Icosahedron) floating around
const shapeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 1,
    clearcoat: 1,
    transparent: true,
    opacity: 0.6
});

const shapes = [];
const geometries = [
    new THREE.TorusGeometry(1.5, 0.4, 16, 50),
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.OctahedronGeometry(1.5, 0)
];

for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(geometries[i], shapeMaterial);

    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 5 - 4;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    scene.add(mesh);
    shapes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.01,
        floatSpeed: Math.random() * 0.02 + 0.01,
        initialY: mesh.position.y
    });
}

camera.position.z = 5;

// Animation Loop
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth camera movement based on mouse
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.z += 0.001;

    // Animate shapes
    shapes.forEach((shape) => {
        shape.mesh.rotation.x += shape.rotSpeedX;
        shape.mesh.rotation.y += shape.rotSpeedY;
        shape.mesh.position.y = shape.initialY + Math.sin(elapsedTime * shape.floatSpeed * 10) * 0.5;
    });

    // Subtly move point lights
    pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 5;
    pointLight1.position.z = Math.cos(elapsedTime * 0.5) * 5;

    renderer.render(scene, camera);
}
animate();

// Resize Handle
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --------------------------------------------------------
// 2. GSAP Animations & Interactions
// --------------------------------------------------------

// Fade in elements on scroll
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Stagger skills
gsap.from(".skill-card", {
    scrollTrigger: {
        trigger: ".skills",
        start: "top 70%"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.7)"
});

// Tilt Effect for Project Cards
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
