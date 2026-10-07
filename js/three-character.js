```javascript
/* =========================================================
   AI STYLE LAB #01
   温柔轻熟型 3D Fashion Doll
   Three.js procedural character
   ========================================================= */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

let scene;
let camera;
let renderer;
let controls;
let character;
let animationId;
let container;

export function initCharacter3D(target) {
    container =
        typeof target === "string"
            ? document.querySelector(target)
            : target;

    if (!container) {
        console.error("AI STYLE LAB: 3D容器不存在");
        return;
    }

    // 清理旧实例
    disposeCharacter();

    /* =========================
       Scene
    ========================= */

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xf7eee3);

    /* =========================
       Camera
    ========================= */

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 520;

    camera = new THREE.PerspectiveCamera(
        35,
        width / height,
        0.1,
        100
    );

    camera.position.set(0, 2.3, 7.2);

    /* =========================
       Renderer
    ========================= */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(width, height);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    /* =========================
       Lighting
    ========================= */

    const ambient = new THREE.HemisphereLight(
        0xfff8ed,
        0xc9b7a4,
        2.2
    );

    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(
        0xfff8ef,
        3.5
    );

    keyLight.position.set(4, 7, 5);

    keyLight.castShadow = true;

    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;

    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
        0xf2e7dc,
        1.5
    );

    fillLight.position.set(-4, 3, 2);

    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(
        0xffe9d2,
        1.8
    );

    rimLight.position.set(0, 5, -5);

    scene.add(rimLight);

    /* =========================
       Character
    ========================= */

    character = createSoftMatureCharacter();

    scene.add(character);

    /* =========================
       Pedestal
    ========================= */

    const pedestal = createPedestal();

    scene.add(pedestal);

    /* =========================
       Controls
    ========================= */

    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;

    controls.dampingFactor = 0.07;

    controls.enablePan = false;

    controls.enableZoom = true;

    controls.minDistance = 5.3;
    controls.maxDistance = 8.5;

    controls.minPolarAngle = Math.PI * 0.38;
    controls.maxPolarAngle = Math.PI * 0.62;

    controls.target.set(
        0,
        2.35,
        0
    );

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.65;

    // 用户开始操作后停止自动旋转
    controls.addEventListener(
        "start",
        () => {
            controls.autoRotate = false;
        }
    );

    // 停止操作后稍后恢复
    controls.addEventListener(
        "end",
        () => {
            clearTimeout(window.__aiStyleAutoRotateTimer);

            window.__aiStyleAutoRotateTimer =
                setTimeout(() => {
                    if (controls) {
                        controls.autoRotate = true;
                    }
                }, 2200);
        }
    );

    /* =========================
       Resize
    ========================= */

    const resizeObserver =
        new ResizeObserver(() => {
            resizeCharacter();
        });

    resizeObserver.observe(container);

    container.__resizeObserver = resizeObserver;

    /* =========================
       Start
    ========================= */

    animate();
}


/* =========================================================
   创建人物
   ========================================================= */

function createSoftMatureCharacter() {

    const group = new THREE.Group();

    group.position.y = 0.18;

    /* =========================
       材质
    ========================= */

    const skinMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf3d1bd,
            roughness: 0.72,
            metalness: 0
        });

    const hairMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3d2923,
            roughness: 0.55,
            metalness: 0
        });

    const knitMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf3e8d7,
            roughness: 0.88,
            metalness: 0
        });

    const skirtMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xb99a7a,
            roughness: 0.76,
            metalness: 0
        });

    const shoeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4a3428,
            roughness: 0.42,
            metalness: 0.05
        });

    const goldMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc9a96e,
            roughness: 0.3,
            metalness: 0.75
        });

    const bagMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xa97850,
            roughness: 0.45,
            metalness: 0.05
        });

    const eyeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x35251f,
            roughness: 0.3,
            metalness: 0
        });

    /* =========================
       腿
    ========================= */

    const legGeometry =
        new THREE.CapsuleGeometry(
            0.13,
            1.35,
            8,
            16
        );

    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            skinMaterial
        );

    leftLeg.position.set(
        -0.17,
        0.95,
        0
    );

    leftLeg.rotation.z = -0.025;

    group.add(leftLeg);


    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            skinMaterial
        );

    rightLeg.position.set(
        0.17,
        0.95,
        0.04
    );

    rightLeg.rotation.z = 0.055;

    group.add(rightLeg);

    /* =========================
       鞋子
    ========================= */

    const shoeGeometry =
        new THREE.SphereGeometry(
            0.28,
            24,
            16
        );

    const leftShoe =
        new THREE.Mesh(
            shoeGeometry,
            shoeMaterial
        );

    leftShoe.scale.set(
        1.35,
        0.55,
        1.75
    );

    leftShoe.position.set(
        -0.18,
        0.22,
        0.08
    );

    group.add(leftShoe);


    const rightShoe =
        new THREE.Mesh(
            shoeGeometry,
            shoeMaterial
        );

    rightShoe.scale.set(
        1.35,
        0.55,
        1.75
    );

    rightShoe.position.set(
        0.18,
        0.22,
        0.08
    );

    group.add(rightShoe);

    /* =========================
       裙子
    ========================= */

    const skirtGeometry =
        new THREE.ConeGeometry(
            0.83,
            1.55,
            48,
            1,
            false
        );

    const skirt =
        new THREE.Mesh(
            skirtGeometry,
            skirtMaterial
        );

    skirt.position.y = 1.85;

    skirt.scale.z = 0.72;

    skirt.castShadow = true;

    group.add(skirt);

    /* =========================
       上半身
    ========================= */

    const torsoGeometry =
        new THREE.CapsuleGeometry(
            0.58,
            0.78,
            12,
            24
        );

    const torso =
        new THREE.Mesh(
            torsoGeometry,
            knitMaterial
        );

    torso.position.y = 2.75;

    torso.scale.set(
        0.9,
        1.0,
        0.58
    );

    torso.castShadow = true;

    group.add(torso);

    /* =========================
       腰带
    ========================= */

    const beltGeometry =
        new THREE.TorusGeometry(
            0.51,
            0.045,
            8,
            40
        );

    const belt =
        new THREE.Mesh(
            beltGeometry,
            shoeMaterial
        );

    belt.rotation.x = Math.PI / 2;

    belt.position.y = 2.38;

    belt.scale.z = 0.72;

    group.add(belt);

    /* =========================
       脖子
    ========================= */

    const neck =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.17,
                0.19,
                0.3,
                20
            ),
            skinMaterial
        );

    neck.position.y = 3.45;

    group.add(neck);

    /* =========================
       头
    ========================= */

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.68,
                40,
                32
            ),
            skinMaterial
        );

    head.scale.set(
        0.92,
        1.02,
        0.82
    );

    head.position.y = 4.05;

    head.castShadow = true;

    group.add(head);

    /* =========================
       头发
    ========================= */

    const hairCap =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.72,
                40,
                24,
                0,
                Math.PI * 2,
                0,
                Math.PI * 0.65
            ),
            hairMaterial
        );

    hairCap.scale.set(
        0.96,
        0.94,
        0.9
    );

    hairCap.position.set(
        0,
        4.18,
        -0.01
    );

    group.add(hairCap);

    /* =========================
       低马尾
    ========================= */

    const ponytail =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.35,
                24,
                18
            ),
            hairMaterial
        );

    ponytail.scale.set(
        0.7,
        1.45,
        0.6
    );

    ponytail.position.set(
        0,
        3.72,
        -0.54
    );

    ponytail.rotation.x = -0.2;

    group.add(ponytail);

    /* =========================
       耳朵
    ========================= */

    const earGeometry =
        new THREE.SphereGeometry(
            0.09,
            16,
            12
        );

    const leftEar =
        new THREE.Mesh(
            earGeometry,
            skinMaterial
        );

    leftEar.position.set(
        -0.61,
        4.02,
        0
    );

    group.add(leftEar);


    const rightEar =
        new THREE.Mesh(
            earGeometry,
            skinMaterial
        );

    rightEar.position.set(
        0.61,
        4.02,
        0
    );

    group.add(rightEar);

    /* =========================
       眼睛
    ========================= */

    const eyeGeometry =
        new THREE.SphereGeometry(
            0.075,
            16,
            12
        );

    const leftEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    leftEye.position.set(
        -0.235,
        4.12,
        0.68
    );

    leftEye.scale.y = 1.2;

    group.add(leftEye);


    const rightEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    rightEye.position.set(
        0.235,
        4.12,
        0.68
    );

    rightEye.scale.y = 1.2;

    group.add(rightEye);

    /* =========================
       眼睛高光
    ========================= */

    const highlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    const highlightGeometry =
        new THREE.SphereGeometry(
            0.018,
            8,
            8
        );

    const leftHighlight =
        new THREE.Mesh(
            highlightGeometry,
            highlightMaterial
        );

    leftHighlight.position.set(
        -0.255,
        4.15,
        0.745
    );

    group.add(leftHighlight);


    const rightHighlight =
        new THREE.Mesh(
            highlightGeometry,
            highlightMaterial
        );

    rightHighlight.position.set(
        0.215,
        4.15,
        0.745
    );

    group.add(rightHighlight);

    /* =========================
       手臂
    ========================= */

    const armGeometry =
        new THREE.CapsuleGeometry(
            0.13,
            0.85,
            8,
            16
        );

    const leftArm =
        new THREE.Mesh(
            armGeometry,
            knitMaterial
        );

    leftArm.position.set(
        -0.58,
        2.82,
        0
    );

    leftArm.rotation.z = 0.16;

    group.add(leftArm);


    const rightArm =
        new THREE.Mesh(
            armGeometry,
            knitMaterial
        );

    rightArm.position.set(
        0.58,
        2.82,
        0
    );

    rightArm.rotation.z = -0.12;

    group.add(rightArm);

    /* =========================
       手
    ========================= */

    const handGeometry =
        new THREE.SphereGeometry(
            0.16,
            18,
            14
        );

    const leftHand =
        new THREE.Mesh(
            handGeometry,
            skinMaterial
        );

    leftHand.position.set(
        -0.63,
        2.33,
        0.02
    );

    group.add(leftHand);


    const rightHand =
        new THREE.Mesh(
            handGeometry,
            skinMaterial
        );

    rightHand.position.set(
        0.63,
        2.33,
        0.02
    );

    group.add(rightHand);

    /* =========================
       包包
    ========================= */

    const bagBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.38,
                0.38,
                0.18
            ),
            bagMaterial
        );

    bagBody.position.set(
        0.86,
        2.3,
        0.16
    );

    bagBody.rotation.z = -0.05;

    group.add(bagBody);

    // 包带
    const strap =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                0.32,
                0.025,
                8,
                32,
                Math.PI
            ),
            bagMaterial
        );

    strap.rotation.z = Math.PI / 2;

    strap.position.set(
        0.7,
        2.6,
        0.12
    );

    group.add(strap);

    /* =========================
       珍珠耳环
    ========================= */

    const pearlMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xfaf7ef,
            roughness: 0.2,
            metalness: 0.05
        });

    const pearlGeometry =
        new THREE.SphereGeometry(
            0.055,
            16,
            16
        );

    const pearlL =
        new THREE.Mesh(
            pearlGeometry,
            pearlMaterial
        );

    pearlL.position.set(
        -0.63,
        3.91,
        0.08
    );

    group.add(pearlL);


    const pearlR =
        new THREE.Mesh(
            pearlGeometry,
            pearlMaterial
        );

    pearlR.position.set(
        0.63,
        3.91,
        0.08
    );

    group.add(pearlR);

    /* =========================
       AI 星星徽章
    ========================= */

    const badge =
        createStarBadge(goldMaterial);

    badge.position.set(
        -0.22,
        2.96,
        0.51
    );

    badge.scale.setScalar(0.055);

    group.add(badge);

    /* =========================
       整体缩放
    ========================= */

    group.scale.setScalar(1.0);

    return group;
}


/* =========================================================
   星星徽章
   ========================================================= */

function createStarBadge(material) {

    const shape = new THREE.Shape();

    const points = 4;

    for (let i = 0; i < points * 2; i++) {

        const radius =
            i % 2 === 0
                ? 1
                : 0.38;

        const angle =
            (Math.PI * 2 * i) /
            (points * 2);

        const x =
            Math.cos(angle) *
            radius;

        const y =
            Math.sin(angle) *
            radius;

        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }

    shape.closePath();

    const geometry =
        new THREE.ExtrudeGeometry(
            shape,
            {
                depth: 0.15,
                bevelEnabled: true,
                bevelThickness: 0.04,
                bevelSize: 0.03,
                bevelSegments: 2
            }
        );

    return new THREE.Mesh(
        geometry,
        material
    );
}


/* =========================================================
   展示台
   ========================================================= */

function createPedestal() {

    const group = new THREE.Group();

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xf0e4d6,
            roughness: 0.82,
            metalness: 0
        });

    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.25,
                1.32,
                0.18,
                64
            ),
            material
        );

    base.position.y = 0.05;

    base.receiveShadow = true;

    group.add(base);

    const top =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.18,
                1.18,
                0.08,
                64
            ),
            material
        );

    top.position.y = 0.16;

    group.add(top);

    return group;
}


/* =========================================================
   Resize
   ========================================================= */

function resizeCharacter() {

    if (!container || !camera || !renderer) {
        return;
    }

    const width =
        container.clientWidth || 360;

    const height =
        container.clientHeight || 520;

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );
}


/* =========================================================
   Animation
   ========================================================= */

function animate() {

    animationId =
        requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    if (renderer && scene && camera) {

        renderer.render(
            scene,
            camera
        );
    }
}


/* =========================================================
   销毁
   ========================================================= */

export function disposeCharacter() {

    if (animationId) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }

    if (container?.__resizeObserver) {

        container.__resizeObserver.disconnect();

        container.__resizeObserver = null;
    }

    if (controls) {

        controls.dispose();

        controls = null;
    }

    if (renderer) {

        renderer.dispose();

        if (
            renderer.domElement &&
            renderer.domElement.parentNode
        ) {

            renderer.domElement.parentNode.removeChild(
                renderer.domElement
            );
        }

        renderer = null;
    }

    if (scene) {

        scene.traverse(
            object => {

                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {

                    if (Array.isArray(object.material)) {

                        object.material.forEach(
                            material => material.dispose()
                        );

                    } else {

                        object.material.dispose();
                    }
                }
            }
        );

        scene.clear();

        scene = null;
    }

    character = null;
}


/* =========================================================
   暴露到全局，方便旧项目调用
   ========================================================= */

window.AIStyleLab3D = {
    init: initCharacter3D,
    dispose: disposeCharacter
};
```
