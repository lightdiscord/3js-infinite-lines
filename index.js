const size = 16;

const canvas = document.querySelector('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
const geometry = new THREE.BoxGeometry( 0.9, 1, 0.9 );
const material = new THREE.MeshDepthMaterial();
const box = new THREE.Mesh( geometry, material );

const matrix = [...Array(size)].map(() => ([...Array(size)].map(() => box.clone())));

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const matrixMax = () => Math.max(...matrix.flat().map(x => x.position.y));

const nextY = (current) => {
  if (current <= 0) {
    return current + 1;
  } else if (current >= size) {
    return current - 1;
  } else {
    return current + random(-1, 1);
  }
};

const animate = () => {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setSize( window.innerWidth, window.innerHeight );


matrix.forEach((line, z) => line.forEach((box, x) => {
  box.position.x = x;
  box.position.z = z;
  box.position.y = 0;
  scene.add(box);
}));

camera.position.z = size / 2;
camera.position.x = size / 2;
camera.position.y = size * 1.5;
camera.lookAt(size / 2, 0, size / 2);

setInterval(() => {
  for (const line of matrix) {
    for (let x = 0; x < line.length - 1; x += 1) {
      line[x].position.y = line[x + 1].position.y;
    }

    line[line.length - 1].position.y = nextY(line[line.length - 2].position.y);
  }
}, 50);

animate();
