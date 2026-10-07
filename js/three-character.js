/* ============================================================
   js/three-character.js
   3D 穿搭人格公仔
   ============================================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PERSONA_PALETTE = {
  cream_rabbit:{ outfit:'#F4E4E2', hair:'#E8D5C4', accent:'#D8B6A0' },
  moon_cat:    { outfit:'#2A2825', hair:'#1A1714', accent:'#B89562' },
  honey_fox:   { outfit:'#E8B48A', hair:'#C67B5C', accent:'#B89562' },
  gummy_bear:  { outfit:'#D4C4B0', hair:'#8B6F5C', accent:'#B89562' },
  butterfly:   { outfit:'#F4D5E0', hair:'#D4A0A8', accent:'#C4909A' },
  forest_deer: { outfit:'#C9D6C0', hair:'#8B6F5C', accent:'#9CAF8B' },
  panda:       { outfit:'#F0EAE1', hair:'#1A1714', accent:'#B7AC9C' },
  tiger:       { outfit:'#1A1714', hair:'#2A241D', accent:'#D9C09A' },
  dolphin:     { outfit:'#B8D4E0', hair:'#6B8B9A', accent:'#8BAFC0' },
  swan:        { outfit:'#F8F4EC', hair:'#D8C4A8', accent:'#B89562' }
};

const CHARACTER_MODEL_MAP = {
  cream_rabbit:'assets/models/cream_rabbit.glb',
  moon_cat:    'assets/models/moon_cat.glb',
  honey_fox:   'assets/models/honey_fox.glb',
  gummy_bear:  'assets/models/gummy_bear.glb',
  butterfly:   'assets/models/butterfly.glb',
  forest_deer: 'assets/models/forest_deer.glb',
  panda:       'assets/models/panda.glb',
  tiger:       'assets/models/tiger.glb',
  dolphin:     'assets/models/dolphin.glb',
  swan:        'assets/models/swan.glb'
};

let scene, camera, renderer, controls, animationId;
let currentObject = null;
let containerEl = null;
let onResizeHandler = null;
let autoRotateResumeTimer = null;

function initCharacter3D(container, personality){
  if(!container) return;
  disposeCharacter();
  containerEl = container;

  const width  = container.clientWidth  || 320;
  const height = container.clientHeight || 440;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 1.55, 4.4);
  camera.lookAt(0, 0.95, 0);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(2.2, 4.2, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0015;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xF4E4E2, 0.55);
  fillLight.position.set(-3, 1.4, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xB89562, 0.4);
  rimLight.position.set(-1.2, 2.4, -3.2);
  scene.add(rimLight);

  scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xE9E0D0, 0.35));

  const groundGeo = new THREE.CircleGeometry(1.8, 64);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.14 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const ringGeo = new THREE.RingGeometry(0.78, 0.815, 96);
  const ringMat = new THREE.MeshBasicMaterial({ color:0xB89562, side:THREE.DoubleSide, transparent:true, opacity:0.32 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.004;
  scene.add(ring);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.rotateSpeed = 0.75;
  controls.zoomSpeed = 0.7;
  controls.minDistance = 2.6;
  controls.maxDistance = 6.5;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;
  controls.target.set(0, 0.95, 0);
  controls.update();

  const pauseAuto = ()=>{
    if(controls) controls.autoRotate = false;
    if(autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
    autoRotateResumeTimer = setTimeout(()=>{ if(controls) controls.autoRotate = true; }, 3000);
  };
  controls.addEventListener('start', pauseAuto);

  const modelUrl = CHARACTER_MODEL_MAP[personality.id];
  loadGLBModel(modelUrl)
    .then(obj=>{ currentObject = obj; scene.add(obj); hideLoading(); })
    .catch(()=>{ currentObject = buildFallbackCharacter(personality); scene.add(currentObject); hideLoading(); });

  const tick = ()=>{
    animationId = requestAnimationFrame(tick);
    if(controls) controls.update();
    if(renderer && scene && camera) renderer.render(scene, camera);
  };
  tick();

  onResizeHandler = ()=>{
    if(!containerEl || !renderer || !camera) return;
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    if(!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', onResizeHandler);
  window.addEventListener('orientationchange', onResizeHandler);
}

function hideLoading(){
  const el = document.getElementById('characterLoading');
  if(!el) return;
  el.classList.add('hide');
  setTimeout(()=>{ el.style.display = 'none'; }, 400);
}

function loadGLBModel(url){
  return new Promise((resolve, reject)=>{
    if(!url) return reject(new Error('no model url'));
    const loader = new GLTFLoader();
    loader.load(url, (gltf)=>{
      try{
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const targetH = 1.85;
        const scale = targetH / (size.y || 1);
        model.scale.setScalar(scale);
        const box2 = new THREE.Box3().setFromObject(model);
        model.position.x = -((box2.min.x + box2.max.x) / 2);
        model.position.z = -((box2.min.z + box2.max.z) / 2);
        model.position.y = -box2.min.y;
        model.traverse(o=>{
          if(o.isMesh){
            o.castShadow = true;
            o.receiveShadow = true;
            if(o.material){
              if(Array.isArray(o.material)) o.material.forEach(m=>{ m.envMapIntensity = 0.6; });
              else o.material.envMapIntensity = 0.6;
            }
          }
        });
        resolve(model);
      }catch(e){ reject(e); }
    }, undefined, (err)=> reject(err));
  });
}

function buildFallbackCharacter(personality){
  const palette = PERSONA_PALETTE[personality.id] || PERSONA_PALETTE.cream_rabbit;
  const group = new THREE.Group();

  const mat = (color, opts = {})=> new THREE.MeshStandardMaterial({
    color: new THREE.Color(color), roughness: 0.55, metalness: 0.03, ...opts
  });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 40, 40), mat(palette.hair));
  head.position.y = 1.6; head.castShadow = true; group.add(head);

  const faceMat = mat('#FBEFE2', { roughness: 0.7 });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.295, 40, 40), faceMat);
  face.position.set(0, 1.6, 0.06); face.castShadow = true; group.add(face);

  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.335, 40, 40, 0, Math.PI*2, 0, Math.PI*0.52), mat(palette.hair));
  fringe.position.y = 1.63; fringe.castShadow = true; group.add(fringe);

  const sideHairGeo = new THREE.CapsuleGeometry(0.13, 0.55, 8, 16);
  const sideL = new THREE.Mesh(sideHairGeo, mat(palette.hair));
  sideL.position.set(-0.29, 1.25, -0.03); sideL.rotation.z = 0.1; sideL.castShadow = true; group.add(sideL);
  const sideR = sideL.clone(); sideR.position.x = 0.29; sideR.rotation.z = -0.1; group.add(sideR);

  const eyeGeo = new THREE.SphereGeometry(0.028, 16, 16);
  const eyeMat = mat('#1A1714');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.11, 1.62, 0.31); group.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.11; group.add(eyeR);

  const blushGeo = new THREE.CircleGeometry(0.045, 20);
  const blushMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#E8B8B0'), transparent: true, opacity: 0.55 });
  const blushL = new THREE.Mesh(blushGeo, blushMat); blushL.position.set(-0.19, 1.53, 0.28); blushL.rotation.y = -0.5; group.add(blushL);
  const blushR = blushL.clone(); blushR.position.x = 0.19; blushR.rotation.y = 0.5; group.add(blushR);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.09, 0.1, 20), faceMat);
  neck.position.y = 1.28; neck.castShadow = true; group.add(neck);

  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 40, 1, true), mat(palette.outfit));
  skirt.position.y = 0.88; skirt.castShadow = true; skirt.receiveShadow = true; group.add(skirt);

  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.595, 0.012, 8, 64), mat(palette.accent));
  hem.rotation.x = Math.PI/2; hem.position.y = 0.39; group.add(hem);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.235, 0.32, 10, 20), mat(palette.outfit, { roughness: 0.5 }));
  torso.position.y = 1.13; torso.castShadow = true; group.add(torso);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.022, 8, 40), mat(palette.accent, { roughness: 0.35 }));
  belt.rotation.x = Math.PI/2; belt.position.y = 0.98; group.add(belt);

  const armGeo = new THREE.CapsuleGeometry(0.072, 0.36, 8, 14);
  const armMat = mat(palette.outfit, { roughness: 0.55 });
  const armL = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.3, 1.1, 0); armL.rotation.z = 0.15; armL.castShadow = true; group.add(armL);
  const armR = armL.clone(); armR.position.x = 0.3; armR.rotation.z = -0.15; group.add(armR);

  const handGeo = new THREE.SphereGeometry(0.072, 16, 16);
  const handL = new THREE.Mesh(handGeo, faceMat); handL.position.set(-0.365, 0.86, 0); handL.castShadow = true; group.add(handL);
  const handR = handL.clone(); handR.position.x = 0.365; group.add(handR);

  const legGeo = new THREE.CapsuleGeometry(0.068, 0.28, 8, 14);
  const legL = new THREE.Mesh(legGeo, faceMat); legL.position.set(-0.13, 0.24, 0); legL.castShadow = true; group.add(legL);
  const legR = legL.clone(); legR.position.x = 0.13; group.add(legR);

  const shoeGeo = new THREE.SphereGeometry(0.085, 16, 16); shoeGeo.scale(1, 0.6, 1.35);
  const shoeMat = mat(palette.accent, { roughness: 0.35 });
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat); shoeL.position.set(-0.13, 0.055, 0.025); shoeL.castShadow = true; group.add(shoeL);
  const shoeR = shoeL.clone(); shoeR.position.x = 0.13; group.add(shoeR);

  const bowTorus = new THREE.TorusGeometry(0.045, 0.016, 8, 20);
  const bowMat = mat(palette.accent, { roughness: 0.3 });
  const bowA = new THREE.Mesh(bowTorus, bowMat);
  bowA.position.set(0.14, 1.83, 0.12); bowA.rotation.x = Math.PI/2; bowA.rotation.z = 0.5; group.add(bowA);
  const bowB = bowA.clone(); bowB.position.set(0.2, 1.84, 0.06); bowB.rotation.z = -0.5; group.add(bowB);

  const bagGeo = new THREE.BoxGeometry(0.18, 0.14, 0.07);
  const bag = new THREE.Mesh(bagGeo, mat(palette.accent, { roughness: 0.4 }));
  bag.position.set(0.36, 0.84, 0.08); bag.castShadow = true; group.add(bag);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.006, 6, 24, Math.PI), mat(palette.accent, { roughness: 0.4 }));
  strap.position.set(0.36, 0.94, 0.08); strap.rotation.z = Math.PI; group.add(strap);

  return group;
}

function disposeCharacter(){
  if(autoRotateResumeTimer){ clearTimeout(autoRotateResumeTimer); autoRotateResumeTimer = null; }
  if(animationId){ cancelAnimationFrame(animationId); animationId = null; }
  if(onResizeHandler){
    window.removeEventListener('resize', onResizeHandler);
    window.removeEventListener('orientationchange', onResizeHandler);
    onResizeHandler = null;
  }
  if(controls){ try{ controls.dispose(); }catch(e){} controls = null; }
  if(scene){
    scene.traverse(obj=>{
      if(obj.geometry){ try{ obj.geometry.dispose(); }catch(e){} }
      if(obj.material){
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m=>{
          if(!m) return;
          for(const k in m){
            const v = m[k];
            if(v && v.isTexture){ try{ v.dispose(); }catch(e){} }
          }
          try{ m.dispose(); }catch(e){}
        });
      }
    });
    scene = null;
  }
  if(renderer){
    try{
      renderer.dispose();
      if(renderer.domElement && renderer.domElement.parentNode){
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }catch(e){}
    renderer = null;
  }
  camera = null;
  currentObject = null;
  containerEl = null;
}

window.Character3D = { initCharacter3D, disposeCharacter };
