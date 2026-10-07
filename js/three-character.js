/* ============================================================
   js/three-character.js
   3D 穿搭人格公仔（Three.js r128 传统版）
   按 AI STYLE LAB 规格还原 #01 温柔轻熟型
   ============================================================ */

(function(){
  'use strict';

  /* ============================================================
     10 套配色（#01 温柔轻熟为标准，其余为派生）
     ============================================================ */
  var PERSONA_PALETTE = {
    cream_rabbit:{  // #01 温柔轻熟型
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#3A2618', hairHi:'#5A3A28',
      top:'#F3E8D7', skirt:'#B99A7A',
      belt:'#5A3A28', buckle:'#C9A96E',
      shoe:'#4A3428', shoeStrap:'#3A2618',
      bag:'#8B5A3C', bagClasp:'#C9A96E',
      pearl:'#F5EFE2', gold:'#C9A96E',
      podium:'#F3E8D7', podiumSide:'#E0D0BC'
    },
    moon_cat:{     // #02 清冷极简
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#1A1714', hairHi:'#3A3028',
      top:'#3A3A3A', skirt:'#1A1714',
      belt:'#0A0A0A', buckle:'#B89562',
      shoe:'#1A1714', shoeStrap:'#0A0A0A',
      bag:'#2A2825', bagClasp:'#B89562',
      pearl:'#D8D8D8', gold:'#B89562',
      podium:'#EDEAE4', podiumSide:'#D4CFC4'
    },
    honey_fox:{    // #03 蜜糖狐
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#8B4A28', hairHi:'#A86A48',
      top:'#E8B48A', skirt:'#C68B5A',
      belt:'#7A4A28', buckle:'#C9A96E',
      shoe:'#6A3A20', shoeStrap:'#4A2A18',
      bag:'#B86838', bagClasp:'#C9A96E',
      pearl:'#F5EFE2', gold:'#C9A96E',
      podium:'#F8E8D5', podiumSide:'#E0C8A8'
    },
    gummy_bear:{   // #04 软糖熊
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#6A4A38', hairHi:'#8A6A50',
      top:'#D4C4B0', skirt:'#B0A090',
      belt:'#6A5A4A', buckle:'#B89562',
      shoe:'#4A3A2A', shoeStrap:'#3A2A1A',
      bag:'#8A7A60', bagClasp:'#B89562',
      pearl:'#F0EAE0', gold:'#B89562',
      podium:'#F0EAE0', podiumSide:'#DCD0BC'
    },
    butterfly:{    // #05 蝴蝶小姐
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#8B5A48', hairHi:'#B88870',
      top:'#F4D5E0', skirt:'#E8B0C0',
      belt:'#8B5060', buckle:'#D9C09A',
      shoe:'#8B5060', shoeStrap:'#6A3A48',
      bag:'#D4A0B0', bagClasp:'#D9C09A',
      pearl:'#F5EFE2', gold:'#D9C09A',
      podium:'#FAEFF2', podiumSide:'#E8D0D8'
    },
    forest_deer:{  // #06 森林小鹿
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#5A4030', hairHi:'#7A5A40',
      top:'#C9D6C0', skirt:'#8B9A7A',
      belt:'#5A4A30', buckle:'#B89562',
      shoe:'#4A3A20', shoeStrap:'#3A2A10',
      bag:'#7A8A60', bagClasp:'#B89562',
      pearl:'#F0EAE0', gold:'#B89562',
      podium:'#EEF2E8', podiumSide:'#D4DCC8'
    },
    panda:{        // #07 糯米熊猫
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#1A1714', hairHi:'#3A3028',
      top:'#F0EAE1', skirt:'#C4C0B8',
      belt:'#6A5A50', buckle:'#B7AC9C',
      shoe:'#4A4844', shoeStrap:'#3A3834',
      bag:'#B7AC9C', bagClasp:'#8B8270',
      pearl:'#F5F0E8', gold:'#B7AC9C',
      podium:'#F5F2ED', podiumSide:'#E0DCD4'
    },
    tiger:{        // #08 酷感小虎
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#1A1714', hairHi:'#3A3028',
      top:'#1A1714', skirt:'#0A0A0A',
      belt:'#000000', buckle:'#D9C09A',
      shoe:'#1A1714', shoeStrap:'#0A0A0A',
      bag:'#2A241D', bagClasp:'#D9C09A',
      pearl:'#C0C0C0', gold:'#D9C09A',
      podium:'#EDE6DA', podiumSide:'#D4C8B4'
    },
    dolphin:{      // #09 海盐海豚
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#4A6A78', hairHi:'#6A8A98',
      top:'#E8F0F4', skirt:'#B8D4E0',
      belt:'#5A7A88', buckle:'#C9A96E',
      shoe:'#3A5A68', shoeStrap:'#2A4A58',
      bag:'#8BAFC0', bagClasp:'#C9A96E',
      pearl:'#F5EFE2', gold:'#C9A96E',
      podium:'#EEF5F8', podiumSide:'#D4E2E8'
    },
    swan:{         // #10 珍珠天鹅
      skin:'#F8E4D2', skinShadow:'#E8C8B0',
      hair:'#8B6848', hairHi:'#B89878',
      top:'#F8F4EC', skirt:'#E0D2BE',
      belt:'#8B7858', buckle:'#C9A96E',
      shoe:'#6A5848', shoeStrap:'#4A3828',
      bag:'#E0D2BE', bagClasp:'#C9A96E',
      pearl:'#F8F4EC', gold:'#C9A96E',
      podium:'#FBF7EF', podiumSide:'#E8DCC8'
    }
  };

  var CHARACTER_MODEL_MAP = {
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

  var scene, camera, renderer, controls, animationId;
  var currentObject = null;
  var containerEl = null;
  var onResizeHandler = null;
  var autoRotateResumeTimer = null;

  /* ---------- 初始化 ---------- */
  function initCharacter3D(container, personality){
    if(!container) return;
    if(typeof THREE === 'undefined'){
      console.warn('[3D] THREE not loaded');
      hideLoading(true);
      return;
    }
    disposeCharacter();
    containerEl = container;

    var width  = container.clientWidth  || 320;
    var height = container.clientHeight || 440;

    scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 1.55, 4.6);
    camera.lookAt(0, 1.0, 0);

    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    /* ---- 灯光（按规格：Key + Fill + Rim） ---- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    var keyLight = new THREE.DirectionalLight(0xFFF6E8, 1.25);
    keyLight.position.set(2.2, 4.2, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0012;
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(0xF8EFE0, 0.5);
    fillLight.position.set(-3.2, 1.6, 1.2);
    scene.add(fillLight);

    var rimLight = new THREE.DirectionalLight(0xFFE8C8, 0.7);
    rimLight.position.set(-1.2, 3.0, -3.5);
    scene.add(rimLight);

    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xE9E0D0, 0.3));

    /* ---- 圆形展示台（陶瓷质感） ---- */
    var podiumGroup = new THREE.Group();
    var podiumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xF3E8D7),
      roughness: 0.7,
      metalness: 0.0
    });
    var podiumTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.06, 64),
      podiumMat
    );
    podiumTop.position.y = 0.03;
    podiumTop.receiveShadow = true;
    podiumTop.castShadow = true;
    podiumGroup.add(podiumTop);

    var podiumEdge = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.008, 8, 96),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xC9A96E),
        roughness: 0.4,
        metalness: 0.6
      })
    );
    podiumEdge.rotation.x = Math.PI / 2;
    podiumEdge.position.y = 0.06;
    podiumGroup.add(podiumEdge);
    scene.add(podiumGroup);

    /* ---- 脚下柔和阴影 ---- */
    var shadowGeo = new THREE.CircleGeometry(0.75, 48);
    var shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    var shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.061;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    /* ---- OrbitControls ---- */
    if(typeof THREE.OrbitControls === 'function'){
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.6;
      controls.minDistance = 2.8;
      controls.maxDistance = 6.8;
      controls.minPolarAngle = Math.PI / 3.2;
      controls.maxPolarAngle = Math.PI / 2.15;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.45;
      controls.target.set(0, 1.0, 0);
      controls.update();

      var pauseAuto = function(){
        if(controls) controls.autoRotate = false;
        if(autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
        autoRotateResumeTimer = setTimeout(function(){
          if(controls) controls.autoRotate = true;
        }, 3500);
      };
      controls.addEventListener('start', pauseAuto);
    }

    /* ---- 尝试 GLB，失败走程序化公仔 ---- */
    var modelUrl = CHARACTER_MODEL_MAP[personality.id];
    loadGLBModel(modelUrl).then(function(obj){
      currentObject = obj;
      scene.add(obj);
      hideLoading(false);
    }).catch(function(){
      currentObject = buildStylizedDoll(personality);
      scene.add(currentObject);
      hideLoading(false);
    });

    /* ---- 渲染循环 ---- */
    var tick = function(){
      animationId = requestAnimationFrame(tick);
      if(controls) controls.update();
      if(renderer && scene && camera) renderer.render(scene, camera);
    };
    tick();

    onResizeHandler = function(){
      if(!containerEl || !renderer || !camera) return;
      var w = containerEl.clientWidth;
      var h = containerEl.clientHeight;
      if(!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResizeHandler);
    window.addEventListener('orientationchange', onResizeHandler);
  }

  function hideLoading(failed){
    var el = document.getElementById('characterLoading');
    if(!el) return;
    if(failed){
      el.innerHTML = '<span style="opacity:.5">3D 加载失败</span>';
      return;
    }
    el.classList.add('hide');
    setTimeout(function(){ el.style.display = 'none'; }, 400);
  }

  function loadGLBModel(url){
    return new Promise(function(resolve, reject){
      if(!url) return reject(new Error('no model url'));
      if(typeof THREE.GLTFLoader !== 'function'){
        return reject(new Error('no GLTFLoader'));
      }
      var loader = new THREE.GLTFLoader();
      loader.load(url, function(gltf){
        try{
          var model = gltf.scene;
          var box = new THREE.Box3().setFromObject(model);
          var size = box.getSize(new THREE.Vector3());
          var scale = 1.9 / (size.y || 1);
          model.scale.setScalar(scale);
          var box2 = new THREE.Box3().setFromObject(model);
          model.position.x = -((box2.min.x + box2.max.x) / 2);
          model.position.z = -((box2.min.z + box2.max.z) / 2);
          model.position.y = -box2.min.y + 0.06;
          model.traverse(function(o){
            if(o.isMesh){
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          resolve(model);
        }catch(e){ reject(e); }
      }, undefined, function(err){ reject(err); });
    });
  }

  /* ============================================================
     工具函数：几何体组合成胶囊（r128 没有 CapsuleGeometry）
     ============================================================ */
  function capsuleMesh(radius, length, mat, seg){
    seg = seg || 20;
    var group = new THREE.Group();
    var cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length, seg),
      mat
    );
    cyl.castShadow = true;
    group.add(cyl);
    var top = new THREE.Mesh(new THREE.SphereGeometry(radius, seg, seg), mat);
    top.position.y = length / 2;
    top.castShadow = true;
    group.add(top);
    var bottom = new THREE.Mesh(new THREE.SphereGeometry(radius, seg, seg), mat);
    bottom.position.y = -length / 2;
    bottom.castShadow = true;
    group.add(bottom);
    return group;
  }

  /* ============================================================
     程序化还原 #01 温柔轻熟型公仔
     ============================================================ */
  function buildStylizedDoll(personality){
    var pal = PERSONA_PALETTE[personality.id] || PERSONA_PALETTE.cream_rabbit;

    var root = new THREE.Group();
    /* 站在展示台上：脚在 y=0.06（台面高度） */
    var bodyRoot = new THREE.Group();
    bodyRoot.position.y = 0.06;
    root.add(bodyRoot);

    /* ---- 材质工厂 ---- */
    function skinMat(){
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(pal.skin),
        roughness: 0.62,
        metalness: 0.0
      });
    }
    function fabricMat(color, rough){
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: rough != null ? rough : 0.85,
        metalness: 0.0
      });
    }
    function leatherMat(color){
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.45,
        metalness: 0.05
      });
    }
    function metalMat(color){
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.7
      });
    }
    function hairMat(color){
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.55,
        metalness: 0.03
      });
    }

    var matSkin   = skinMat();
    var matHair   = hairMat(pal.hair);
    var matTop    = fabricMat(pal.top, 0.9);
    var matSkirt  = fabricMat(pal.skirt, 0.85);
    var matBelt   = leatherMat(pal.belt);
    var matBuckle = metalMat(pal.buckle);
    var matShoe   = leatherMat(pal.shoe);
    var matStrap  = leatherMat(pal.shoeStrap);
    var matBag    = leatherMat(pal.bag);
    var matClasp  = metalMat(pal.bagClasp);
    var matPearl  = metalMat(pal.pearl);
    var matGold   = metalMat(pal.gold);
    var matEye    = new THREE.MeshStandardMaterial({ color: 0x1A1714, roughness: 0.2, metalness: 0.1 });
    var matEyeHi  = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    var matBlush  = new THREE.MeshBasicMaterial({ color: 0xE8B8A8, transparent: true, opacity: 0.35 });
    var matLip    = new THREE.MeshStandardMaterial({ color: 0xB87060, roughness: 0.4 });

    /* ============================================================
       1. 腿（纤细笔直，从下往上建）
       比例：脚到裙摆约 0.55，裙摆到腰约 0.55，腰到肩约 0.6，肩到头顶约 0.5
       总高约 2.2
       ============================================================ */

    /* ---- 腿：用胶囊 ---- */
    var legH = 0.62;
    var legR = 0.055;
    var legY = 0.06 + legH / 2; // 腿中心 y

    var legL = capsuleMesh(legR, legH - legR*2, matSkin, 16);
    legL.position.set(-0.11, legY, 0);
    bodyRoot.add(legL);

    var legR_mesh = capsuleMesh(legR, legH - legR*2, matSkin, 16);
    legR_mesh.position.set(0.11, legY, 0);
    bodyRoot.add(legR_mesh);

    /* ---- 鞋：玛丽珍（圆头 + 横带 + 小扣） ---- */
    function makeShoe(){
      var g = new THREE.Group();
      /* 鞋身：圆润的椭球 */
      var body = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 20, 16),
        matShoe
      );
      body.scale.set(1.0, 0.65, 1.35);
      body.position.y = 0.055;
      body.castShadow = true;
      g.add(body);
      /* 鞋底薄片 */
      var sole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.012, 20),
        matStrap
      );
      sole.scale.set(1.0, 1.0, 1.35);
      sole.position.y = 0.012;
      g.add(sole);
      /* 玛丽珍横带 */
      var strap = new THREE.Mesh(
        new THREE.TorusGeometry(0.062, 0.007, 8, 24, Math.PI),
        matStrap
      );
      strap.rotation.y = Math.PI / 2;
      strap.rotation.z = 0;
      strap.position.set(0, 0.10, 0);
      g.add(strap);
      /* 小扣 */
      var buckle = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 8, 8),
        matBuckle
      );
      buckle.position.set(0, 0.10, 0.06);
      g.add(buckle);
      return g;
    }
    var shoeL = makeShoe();
    shoeL.position.set(-0.11, 0, 0);
    bodyRoot.add(shoeL);
    var shoeR = makeShoe();
    shoeR.position.set(0.11, 0, 0);
    bodyRoot.add(shoeR);

    /* ============================================================
       2. 裙子（高腰 A 字）
       ============================================================ */
    var skirtTopY = 0.72;
    var skirtBottomY = 0.60; // 裙摆位置
    var skirtHeight = skirtTopY - skirtBottomY + 0.18;
    /* 圆锥台：上窄下宽 */
    var skirtGeo = new THREE.CylinderGeometry(0.16, 0.42, skirtHeight, 40, 1, true);
    var skirt = new THREE.Mesh(skirtGeo, matSkirt);
    skirt.position.y = skirtBottomY + skirtHeight / 2 - 0.02;
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    bodyRoot.add(skirt);

    /* 裙摆下沿装饰线 */
    var skirtHem = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.006, 6, 64),
      matBelt
    );
    skirtHem.rotation.x = Math.PI / 2;
    skirtHem.position.y = skirtBottomY - 0.02;
    bodyRoot.add(skirtHem);

    /* ============================================================
       3. 上身（针织衫）
       ============================================================ */
    var torsoBottomY = 0.68;
    var torsoTopY = 1.22;
    var torsoH = torsoTopY - torsoBottomY;
    /* 用略微收窄的圆柱台，做出腰部线条 */
    var torsoGeo = new THREE.CylinderGeometry(0.155, 0.17, torsoH, 32, 1);
    var torso = new THREE.Mesh(torsoGeo, matTop);
    torso.position.y = torsoBottomY + torsoH / 2;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyRoot.add(torso);

    /* 肩部圆润 */
    var shoulderGeo = new THREE.SphereGeometry(0.16, 24, 16);
    var shoulderL = new THREE.Mesh(shoulderGeo, matTop);
    shoulderL.scale.set(1, 0.6, 1);
    shoulderL.position.set(-0.09, 1.19, 0);
    shoulderL.castShadow = true;
    bodyRoot.add(shoulderL);
    var shoulderR = shoulderL.clone();
    shoulderR.position.x = 0.09;
    bodyRoot.add(shoulderR);

    /* ---- 腰带（细棕 + 金色小扣） ---- */
    var belt = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.018, 8, 48),
      matBelt
    );
    belt.rotation.x = Math.PI / 2;
    belt.position.y = 0.7;
    belt.scale.set(1.0, 1.0, 1.0);
    bodyRoot.add(belt);

    var buckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.028, 0.012),
      matBuckle
    );
    buckle.position.set(0, 0.7, 0.175);
    bodyRoot.add(buckle);

    /* ---- 领口（圆领） ---- */
    var collarGeo = new THREE.TorusGeometry(0.06, 0.012, 8, 24);
    var collar = new THREE.Mesh(collarGeo, matTop);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.26;
    bodyRoot.add(collar);

    /* ============================================================
       4. 手臂（自然下垂，微微外扩）
       ============================================================ */
    var armLen = 0.5;
    var armR = 0.048;

    function makeArm(side){
      /* side: -1 左, 1 右 */
      var g = new THREE.Group();
      var upper = capsuleMesh(armR, armLen - armR*2, matSkin, 14);
      upper.rotation.z = side * 0.14;
      upper.position.set(0, -armLen / 2, 0);
      g.add(upper);
      /* 袖口 */
      var cuff = new THREE.Mesh(
        new THREE.TorusGeometry(armR + 0.008, 0.012, 8, 20),
        matTop
      );
      cuff.rotation.x = Math.PI / 2;
      cuff.position.y = -armLen + 0.05;
      g.add(cuff);
      /* 手 */
      var hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 12),
        matSkin
      );
      hand.scale.set(1, 1.05, 0.85);
      hand.position.y = -armLen + 0.02;
      g.add(hand);
      return g;
    }

    /* 左臂（拿包的那只） */
    var armL = makeArm(-1);
    armL.position.set(-0.22, 1.15, 0);
    armL.rotation.z = 0.12;
    bodyRoot.add(armL);

    /* 右臂（自然下垂） */
    var armR_mesh = makeArm(1);
    armR_mesh.position.set(0.22, 1.15, 0);
    armR_mesh.rotation.z = -0.12;
    bodyRoot.add(armR_mesh);

    /* ============================================================
       5. 头 + 脸（圆润鹅蛋，比例约 4.5 头身）
       ============================================================ */
    var headGroup = new THREE.Group();
    /* 头部中心 y，站位：头顶约 2.05，下巴约 1.5 */
    headGroup.position.y = 1.78;
    /* 头略向右偏 3° */
    headGroup.rotation.y = 0.05;
    bodyRoot.add(headGroup);

    /* 脖子 */
    var neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.055, 0.12, 16),
      matSkin
    );
    neck.position.y = -0.28;
    headGroup.add(neck);

    /* 头部：略拉长的球，形成鹅蛋脸 */
    var headGeo = new THREE.SphereGeometry(0.23, 40, 40);
    var head = new THREE.Mesh(headGeo, matSkin);
    head.scale.set(0.94, 1.05, 0.96);
    head.castShadow = true;
    headGroup.add(head);

    /* 面部略向前推（形成鹅蛋的正面） */
    var faceGeo = new THREE.SphereGeometry(0.225, 40, 40);
    var face = new THREE.Mesh(faceGeo, matSkin);
    face.scale.set(0.92, 1.02, 1.0);
    face.position.z = 0.02;
    headGroup.add(face);

    /* ---- 耳朵 ---- */
    var earGeo = new THREE.SphereGeometry(0.035, 12, 12);
    var earL = new THREE.Mesh(earGeo, matSkin);
    earL.scale.set(0.6, 1, 0.7);
    earL.position.set(-0.22, -0.02, 0.01);
    headGroup.add(earL);
    var earR = earL.clone();
    earR.position.x = 0.22;
    headGroup.add(earR);

    /* ---- 珍珠耳钉 ---- */
    var pearlGeo = new THREE.SphereGeometry(0.014, 12, 12);
    var pearlL = new THREE.Mesh(pearlGeo, matPearl);
    pearlL.position.set(-0.235, -0.02, 0.015);
    headGroup.add(pearlL);
    var pearlR = pearlL.clone();
    pearlR.position.x = 0.235;
    headGroup.add(pearlR);

    /* ---- 眼睛（杏仁形 + 高光） ---- */
    function makeEye(){
      var g = new THREE.Group();
      /* 眼白略呈杏仁：椭圆 */
      var eyeWhite = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 20, 16),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 })
      );
      eyeWhite.scale.set(1.15, 0.85, 0.5);
      g.add(eyeWhite);
      /* 虹膜：深棕 */
      var iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 16, 16),
        matEye
      );
      iris.scale.set(1.0, 1.0, 0.5);
      iris.position.z = 0.018;
      g.add(iris);
      /* 高光：右上一点 */
      var hi = new THREE.Mesh(
        new THREE.SphereGeometry(0.006, 8, 8),
        matEyeHi
      );
      hi.position.set(0.008, 0.008, 0.032);
      g.add(hi);
      return g;
    }
    var eyeL = makeEye();
    eyeL.position.set(-0.082, 0.02, 0.195);
    headGroup.add(eyeL);
    var eyeR = makeEye();
    eyeR.position.set(0.082, 0.02, 0.195);
    headGroup.add(eyeR);

    /* ---- 眉毛（细弧） ---- */
    var browGeo = new THREE.TorusGeometry(0.028, 0.004, 6, 16, Math.PI * 0.55);
    var matBrow = new THREE.MeshStandardMaterial({ color: 0x2A1A10, roughness: 0.6 });
    var browL = new THREE.Mesh(browGeo, matBrow);
    browL.rotation.x = Math.PI / 2;
    browL.rotation.z = Math.PI - 0.3;
    browL.position.set(-0.082, 0.075, 0.20);
    headGroup.add(browL);
    var browR = new THREE.Mesh(browGeo, matBrow);
    browR.rotation.x = Math.PI / 2;
    browR.rotation.z = 0.3;
    browR.position.set(0.082, 0.075, 0.20);
    headGroup.add(browR);

    /* ---- 鼻子（极小） ---- */
    var nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 10, 10),
      matSkin
    );
    nose.scale.set(0.8, 0.9, 1.1);
    nose.position.set(0, -0.025, 0.222);
    headGroup.add(nose);

    /* ---- 嘴（小弧线） ---- */
    var mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.02, 0.005, 6, 16, Math.PI * 0.7),
      matLip
    );
    mouth.rotation.x = Math.PI;
    mouth.rotation.z = Math.PI;
    mouth.position.set(0, -0.085, 0.215);
    headGroup.add(mouth);

    /* ---- 腮红 ---- */
    var blushGeo = new THREE.CircleGeometry(0.03, 20);
    var blushL = new THREE.Mesh(blushGeo, matBlush);
    blushL.scale.set(1, 0.7, 1);
    blushL.rotation.y = -0.6;
    blushL.position.set(-0.15, -0.05, 0.17);
    headGroup.add(blushL);
    var blushR = new THREE.Mesh(blushGeo, matBlush);
    blushR.scale.set(1, 0.7, 1);
    blushR.rotation.y = 0.6;
    blushR.position.set(0.15, -0.05, 0.17);
    headGroup.add(blushR);

    /* ============================================================
       6. 头发（低马尾 + 刘海 + 两侧碎发）
       ============================================================ */
    var hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    /* 头顶发盖：略大于头，形成头发轮廓 */
    var capGeo = new THREE.SphereGeometry(0.245, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.65);
    var cap = new THREE.Mesh(capGeo, matHair);
    cap.scale.set(0.97, 1.08, 1.0);
    cap.position.y = 0.005;
    cap.castShadow = true;
    hairGroup.add(cap);

    /* 中分刘海：两个斜向的扁球 */
    var fringeGeo = new THREE.SphereGeometry(0.15, 24, 24);
    var fringeL = new THREE.Mesh(fringeGeo, matHair);
    fringeL.scale.set(0.5, 0.85, 0.55);
    fringeL.position.set(-0.11, 0.08, 0.16);
    fringeL.rotation.z = -0.25;
    fringeL.rotation.x = 0.15;
    hairGroup.add(fringeL);
    var fringeR = new THREE.Mesh(fringeGeo, matHair);
    fringeR.scale.set(0.5, 0.85, 0.55);
    fringeR.position.set(0.11, 0.08, 0.16);
    fringeR.rotation.z = 0.25;
    fringeR.rotation.x = 0.15;
    hairGroup.add(fringeR);

    /* 两侧鬓角碎发 */
    function makeSideHair(side){
      var g = new THREE.Group();
      var strand = capsuleMesh(0.035, 0.22, matHair, 12);
      strand.position.set(0, -0.13, 0);
      strand.rotation.z = side * 0.08;
      g.add(strand);
      return g;
    }
    var sideL = makeSideHair(-1);
    sideL.position.set(-0.225, 0.05, 0.05);
    hairGroup.add(sideL);
    var sideR = makeSideHair(1);
    sideR.position.set(0.225, 0.05, 0.05);
    hairGroup.add(sideR);

    /* 低马尾：从后脑勺向下的圆柱，微微弯曲 */
    var ponytail = new THREE.Group();
    /* 顶部发根 */
    var root1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 20, 16),
      matHair
    );
    root1.scale.set(1.0, 0.8, 0.9);
    root1.position.set(0, 0.06, -0.20);
    ponytail.add(root1);
    /* 马尾主体 */
    var tailSeg1 = capsuleMesh(0.052, 0.28, matHair, 16);
    tailSeg1.position.set(0, -0.14, -0.24);
    tailSeg1.rotation.x = 0.15;
    ponytail.add(tailSeg1);
    var tailSeg2 = capsuleMesh(0.045, 0.22, matHair, 16);
    tailSeg2.position.set(0, -0.40, -0.27);
    tailSeg2.rotation.x = -0.1;
    ponytail.add(tailSeg2);
    /* 发尾 */
    var tailEnd = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 12),
      matHair
    );
    tailEnd.position.set(0, -0.52, -0.25);
    ponytail.add(tailEnd);
    hairGroup.add(ponytail);

    /* ---- 发丝高光：极淡的一小片 ---- */
    var hairHi = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 16, 0, Math.PI*0.5, 0, Math.PI*0.5),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(pal.hairHi),
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
      })
    );
    hairHi.scale.set(1.1, 0.9, 1.0);
    hairHi.position.set(0.06, 0.14, 0.10);
    hairGroup.add(hairHi);

    /* ============================================================
       7. 品牌徽章：左胸 4 角星
       ============================================================ */
    var starShape = new THREE.Shape();
    (function(){
      var pts = 8;
      var outer = 0.016;
      var inner = 0.006;
      for(var i = 0; i < pts * 2; i++){
        var r = (i % 2 === 0) ? outer : inner;
        var a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
        var x = Math.cos(a) * r;
        var y = Math.sin(a) * r;
        if(i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
      }
      starShape.closePath();
    })();
    var starGeo = new THREE.ShapeGeometry(starShape);
    var star = new THREE.Mesh(starGeo, matGold);
    star.position.set(-0.09, 1.03, 0.163);
    bodyRoot.add(star);

    /* ============================================================
       8. 小方包（圆角矩形 + 提手 + 金属扣）
       ============================================================ */
    var bag = new THREE.Group();
    /* 包身：用圆角方式近似，简化成 BoxGeometry */
    var bagBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.14, 0.06),
      matBag
    );
    bagBody.castShadow = true;
    bag.add(bagBody);
    /* 包盖 */
    var bagFlap = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.09, 0.062),
      matBag
    );
    bagFlap.position.set(0, 0.03, 0.001);
    bag.add(bagFlap);
    /* 金属扣 */
    var clasp = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.015, 0.008),
      matClasp
    );
    clasp.position.set(0, 0.005, 0.034);
    bag.add(clasp);
    /* 提手 */
    var handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.035, 0.005, 6, 16, Math.PI),
      matBag
    );
    handle.rotation.x = Math.PI / 2;
    handle.rotation.z = 0;
    handle.position.set(0, 0.085, 0);
    bag.add(handle);

    /* 放在左手边（角色左=观察者右） */
    bag.position.set(0.28, 0.86, 0.04);
    bag.rotation.z = -0.08;
    bodyRoot.add(bag);

    /* 左臂轻搭在包上（微调左臂位置） */
    armL.position.set(-0.26, 1.15, 0.02);
    armL.rotation.z = 0.05;

    /* ============================================================
       9. 整体轻微倾斜，形成自然 S 曲线
       ============================================================ */
    bodyRoot.rotation.y = -0.05;
    headGroup.rotation.y = 0.08;

    return root;
  }

  /* ============================================================
     清理
     ============================================================ */
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
      scene.traverse(function(obj){
        if(obj.geometry){ try{ obj.geometry.dispose(); }catch(e){} }
        if(obj.material){
          var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(function(m){
            if(!m) return;
            for(var k in m){
              var v = m[k];
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

  window.Character3D = {
    initCharacter3D: initCharacter3D,
    disposeCharacter: disposeCharacter
  };
})();
