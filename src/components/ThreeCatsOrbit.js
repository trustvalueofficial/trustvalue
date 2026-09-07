"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCatsOrbit() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 13.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdfba, 2.3);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x4488ff, 1.8);
    blueRimLight.position.set(-8, -4, -6);
    scene.add(blueRimLight);

    const centerGlowLight = new THREE.PointLight(0xffa238, 2.5, 14);
    centerGlowLight.position.set(0, -1.0, 0);
    scene.add(centerGlowLight);

    // --- Procedural 3D Cat Generator ---
    function createStylizedCat({ furColor, innerEarColor, eyeColor, scale = 1 }) {
      const catGroup = new THREE.Group();

      const furMat = new THREE.MeshStandardMaterial({
        color: furColor,
        roughness: 0.45,
        metalness: 0.1,
      });

      const innerEarMat = new THREE.MeshStandardMaterial({
        color: innerEarColor,
        roughness: 0.6,
      });

      const eyeMat = new THREE.MeshStandardMaterial({
        color: eyeColor,
        roughness: 0.1,
        metalness: 0.8,
        emissive: eyeColor,
        emissiveIntensity: 0.35,
      });

      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      const noseMat = new THREE.MeshStandardMaterial({ color: 0xff8899, roughness: 0.4 });
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        roughness: 0.2,
        metalness: 0.85,
        emissive: 0xff9900,
        emissiveIntensity: 0.3,
      });

      // Body (capsule-like smoothed sphere)
      const bodyGeo = new THREE.SphereGeometry(0.72, 24, 18);
      bodyGeo.scale(1, 0.88, 1.35);
      const body = new THREE.Mesh(bodyGeo, furMat);
      body.position.set(0, 0, 0);
      body.castShadow = true;
      catGroup.add(body);

      // Head
      const headGeo = new THREE.SphereGeometry(0.58, 24, 20);
      const head = new THREE.Mesh(headGeo, furMat);
      head.position.set(0, 0.55, 0.82);
      head.castShadow = true;
      catGroup.add(head);

      // Cheeks (cute rounded sides)
      const leftCheekGeo = new THREE.SphereGeometry(0.24, 16, 12);
      leftCheekGeo.scale(1.2, 0.9, 0.8);
      const leftCheek = new THREE.Mesh(leftCheekGeo, furMat);
      leftCheek.position.set(0.3, 0.42, 1.15);
      catGroup.add(leftCheek);

      const rightCheek = leftCheek.clone();
      rightCheek.position.set(-0.3, 0.42, 1.15);
      catGroup.add(rightCheek);

      // Ears
      const earGeo = new THREE.ConeGeometry(0.25, 0.48, 5);
      earGeo.scale(1, 1, 0.6);

      const leftEar = new THREE.Mesh(earGeo, furMat);
      leftEar.position.set(0.36, 1.05, 0.78);
      leftEar.rotation.set(-0.15, -0.2, -0.35);
      leftEar.castShadow = true;
      catGroup.add(leftEar);

      const leftInnerEarGeo = new THREE.ConeGeometry(0.16, 0.35, 4);
      leftInnerEarGeo.scale(1, 1, 0.4);
      const leftInnerEar = new THREE.Mesh(leftInnerEarGeo, innerEarMat);
      leftInnerEar.position.set(0.35, 1.02, 0.84);
      leftInnerEar.rotation.set(-0.15, -0.2, -0.35);
      catGroup.add(leftInnerEar);

      const rightEar = new THREE.Mesh(earGeo, furMat);
      rightEar.position.set(-0.36, 1.05, 0.78);
      rightEar.rotation.set(-0.15, 0.2, 0.35);
      rightEar.castShadow = true;
      catGroup.add(rightEar);

      const rightInnerEar = new THREE.Mesh(leftInnerEarGeo, innerEarMat);
      rightInnerEar.position.set(-0.35, 1.02, 0.84);
      rightInnerEar.rotation.set(-0.15, 0.2, 0.35);
      catGroup.add(rightInnerEar);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.14, 16, 14);
      eyeGeo.scale(1, 1.1, 0.7);

      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(0.22, 0.62, 1.25);
      catGroup.add(leftEye);

      const leftPupilGeo = new THREE.SphereGeometry(0.065, 12, 10);
      leftPupilGeo.scale(0.55, 1.3, 0.6);
      const leftPupil = new THREE.Mesh(leftPupilGeo, pupilMat);
      leftPupil.position.set(0.22, 0.62, 1.33);
      catGroup.add(leftPupil);

      const rightEye = leftEye.clone();
      rightEye.position.set(-0.22, 0.62, 1.25);
      catGroup.add(rightEye);

      const rightPupil = leftPupil.clone();
      rightPupil.position.set(-0.22, 0.62, 1.33);
      catGroup.add(rightPupil);

      // Nose & Muzzle
      const noseGeo = new THREE.ConeGeometry(0.065, 0.08, 4);
      noseGeo.rotateX(Math.PI);
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.48, 1.36);
      catGroup.add(nose);

      // Collar with Gold Bell
      const collarGeo = new THREE.TorusGeometry(0.55, 0.075, 12, 28);
      collarGeo.rotateX(Math.PI / 2.3);
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.set(0, 0.28, 0.58);
      catGroup.add(collar);

      const bellGeo = new THREE.SphereGeometry(0.11, 14, 12);
      const bell = new THREE.Mesh(bellGeo, collarMat);
      bell.position.set(0, 0.16, 1.05);
      catGroup.add(bell);

      // Paws
      const pawGeo = new THREE.SphereGeometry(0.18, 14, 10);
      pawGeo.scale(1, 0.75, 1.3);

      const frontLeftPaw = new THREE.Mesh(pawGeo, furMat);
      frontLeftPaw.position.set(0.38, -0.42, 0.72);
      frontLeftPaw.castShadow = true;
      catGroup.add(frontLeftPaw);

      const frontRightPaw = new THREE.Mesh(pawGeo, furMat);
      frontRightPaw.position.set(-0.38, -0.42, 0.72);
      frontRightPaw.castShadow = true;
      catGroup.add(frontRightPaw);

      const backLeftPaw = new THREE.Mesh(pawGeo, furMat);
      backLeftPaw.position.set(0.44, -0.38, -0.65);
      backLeftPaw.castShadow = true;
      catGroup.add(backLeftPaw);

      const backRightPaw = new THREE.Mesh(pawGeo, furMat);
      backRightPaw.position.set(-0.44, -0.38, -0.65);
      backRightPaw.castShadow = true;
      catGroup.add(backRightPaw);

      // Articulated Tail
      const tailSegments = [];
      const tailRoot = new THREE.Group();
      tailRoot.position.set(0, 0.15, -1.2);
      catGroup.add(tailRoot);

      let prevSeg = tailRoot;
      const segCount = 6;
      for (let s = 0; s < segCount; s++) {
        const segGeo = new THREE.CylinderGeometry(0.1 - s * 0.012, 0.12 - s * 0.01, 0.28, 12);
        segGeo.rotateX(Math.PI / 3);
        const segMesh = new THREE.Mesh(segGeo, furMat);
        segMesh.position.set(0, 0.14, -0.18);
        prevSeg.add(segMesh);
        tailSegments.push(segMesh);
        prevSeg = segMesh;
      }

      catGroup.scale.set(scale, scale, scale);

      return {
        group: catGroup,
        head,
        leftEar,
        rightEar,
        frontLeftPaw,
        frontRightPaw,
        tailSegments,
      };
    }

    // --- Cat Definitions with personal cylindrical helical profiles ---
    const catConfigs = [
      {
        name: "Tabby",
        furColor: 0xe68a35, // Amber ginger tabby
        innerEarColor: 0xffb09c,
        eyeColor: 0x48e5c2, // Emerald cyan
        radius: 4.8,
        speed: 0.52,
        yBase: -0.7,
        phase: 0,
        scale: 0.82,
        tilt: 0.1,
      },
      {
        name: "Stealth",
        furColor: 0x222228, // Midnight stealth black
        innerEarColor: 0x554455,
        eyeColor: 0xffd166, // Golden amber glow
        radius: 5.7,
        speed: 0.44,
        yBase: -1.3,
        phase: Math.PI * 0.5,
        scale: 0.76,
        tilt: -0.1,
      },
      {
        name: "Snow",
        furColor: 0xf5eedb, // Snow cream white
        innerEarColor: 0xffa0b0,
        eyeColor: 0x5e9eff, // Sapphire blue
        radius: 5.1,
        speed: 0.48,
        yBase: -0.45,
        phase: Math.PI,
        scale: 0.74,
        tilt: 0.12,
      },
      {
        name: "Calico",
        furColor: 0xb57c50, // Mocha calico
        innerEarColor: 0xf5c3a6,
        eyeColor: 0x80ed99, // Mint green
        radius: 6.2,
        speed: 0.4,
        yBase: -1.0,
        phase: Math.PI * 1.5,
        scale: 0.84,
        tilt: -0.08,
      },
    ];

    const cats = catConfigs.map((cfg) => {
      const cat = createStylizedCat({
        furColor: cfg.furColor,
        innerEarColor: cfg.innerEarColor,
        eyeColor: cfg.eyeColor,
        scale: cfg.scale,
      });
      scene.add(cat.group);
      return { ...cat, config: cfg, currentYaw: -cfg.phase };
    });

    // --- Ambient Technical Dust Particles ---
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 26;
      particlePos[i + 1] = (Math.random() - 0.5) * 16;
      particlePos[i + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- Scroll & Mouse Tracking with Smooth Damping ---
    let targetScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let currentScrollY = targetScrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let targetCameraX = 0;
    let targetCameraY = 0.2;

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = x * 0.9;
      targetCameraY = 0.2 + y * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // --- Render Loop & Continuous Phase Accumulators ---
    const startTime = performance.now();
    let lastTime = performance.now();
    let currentActivity = 1.0;
    let pawPhase = 0;
    let tailPhase = 0;
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) * 0.001;

      // Smooth scroll interpolation (lerp)
      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.075;
      scrollVelocity = currentScrollY - prevScrollY;

      // Smoothly interpolate activity rate to prevent any phase jumps or glitching
      const targetActivity = 1.0 + Math.min(1.25, Math.abs(scrollVelocity) * 0.035);
      currentActivity += (targetActivity - currentActivity) * 0.08;

      // Accumulate continuous phases smoothly
      pawPhase += delta * 3.2 * currentActivity;
      tailPhase += delta * 2.8 * currentActivity;

      // Camera parallax with responsive lookAt
      const isMobile = window.innerWidth < 640;
      const targetLookY = isMobile ? -0.7 : -0.9;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, targetLookY, 0);

      // Normalized journey factor (0 at hero, 1 when deep into content)
      const journeyFactor = Math.min(1, Math.max(0, currentScrollY / 550));

      // Animate cats along cylindrical helical trajectory
      cats.forEach((catObj) => {
        const { config, group, head, leftEar, rightEar, frontLeftPaw, frontRightPaw, tailSegments } =
          catObj;

        // Responsive cat scale and radius for mobile viewports
        const baseRadius = isMobile ? config.radius * 0.85 : config.radius;
        const currentScale = isMobile ? config.scale * 0.78 : config.scale;

        // Expanded 3D orbital radius around the sections during the journey
        const journeyRadius = isMobile ? baseRadius * 1.38 : baseRadius * 1.62;
        const dynamicRadius = THREE.MathUtils.lerp(
          baseRadius,
          journeyRadius,
          journeyFactor
        );

        // Cylindrical angle: idle orbital rotation + continuous scroll progression
        const scrollAngle = currentScrollY * 0.0034;
        const idleAngle = elapsed * config.speed * 0.48;
        const theta = idleAngle + scrollAngle + config.phase;

        // 3D Cylindrical Coordinates revolving around the sections
        const x = Math.cos(theta) * dynamicRadius;
        const z = Math.sin(theta) * dynamicRadius;

        // Dynamic 3D spiral wave carrying the cats across the vertical height of the sections
        const verticalSpan = isMobile ? 2.2 : 3.4;
        const helixWave = Math.sin(theta + config.phase * 0.4) * (0.28 + journeyFactor * verticalSpan);
        const idleBob = Math.sin(elapsed * 1.9 + config.phase) * 0.16;
        const inertiaLift = THREE.MathUtils.clamp(-scrollVelocity * 0.035, -1.2, 1.2);
        const y = config.yBase + helixWave + idleBob + inertiaLift;

        // Depth-dependent scale modulation: cat appears naturally closer in front (z > 0) and deeper in back (z < 0)
        const depthScaleMod = 1.0 + (z / dynamicRadius) * 0.14;
        const finalScale = currentScale * depthScaleMod;
        group.scale.set(finalScale, finalScale, finalScale);

        group.position.set(x, y, z);

        // Detect if net motion is forward or reversed (scrolling up)
        const netAngularRate = config.speed * 0.48 + (scrollVelocity * 0.0034);
        const isReversing = netAngularRate < -0.04;

        // When scrolling up/reversing, flip target heading by Math.PI (180 deg) so cat turns around and leads with its face
        const targetYaw = -theta + (isReversing ? Math.PI : 0);

        // Smooth shortest-arc yaw interpolation (graceful U-turn)
        let yawDiff = (targetYaw - catObj.currentYaw) % (Math.PI * 2);
        if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        catObj.currentYaw += yawDiff * 0.12;

        group.rotation.y = catObj.currentYaw;

        // Banking roll into the curve + reactive bank on scroll velocity
        const bankRoll = Math.sin(theta) * 0.18 + (isReversing ? -0.12 : 0.12) * (scrollVelocity * 0.012);
        group.rotation.z = THREE.MathUtils.clamp(bankRoll, -0.45, 0.45) + config.tilt;

        // Pitch angle: dive during downward scroll and descent, climb during upward spiral
        const verticalSlope = Math.cos(theta + config.phase * 0.4) * (journeyFactor * 0.18);
        const scrollPitch = THREE.MathUtils.clamp((isReversing ? 1 : -1) * scrollVelocity * 0.018, -0.28, 0.28);
        const pitchAngle = scrollPitch + (isReversing ? -verticalSlope : verticalSlope);
        group.rotation.x = pitchAngle + Math.sin(elapsed * 1.5 + config.phase) * 0.06;

        // Head gentle curiosity
        head.rotation.y = Math.sin(elapsed * 1.2 + config.phase) * 0.14;
        head.rotation.x = Math.sin(elapsed * 1.6) * 0.08;

        // Paws floating paddle with continuous accumulated phase
        frontLeftPaw.position.y = -0.42 + Math.sin(pawPhase + config.phase) * 0.08;
        frontRightPaw.position.y = -0.42 + Math.cos(pawPhase + config.phase) * 0.08;

        // Ear twitching
        const twitch = Math.sin(elapsed * 4.2 + config.phase) > 0.88 ? 0.09 : 0;
        leftEar.rotation.z = -0.35 - twitch;
        rightEar.rotation.z = 0.35 + twitch;

        // Tail swish wave propagation with continuous accumulated phase (ZERO GLITCH)
        tailSegments.forEach((seg, idx) => {
          const damping = 1 - idx * 0.06;
          seg.rotation.y = Math.sin(tailPhase - idx * 0.35 + config.phase) * (0.24 * damping);
          seg.rotation.z = Math.cos(tailPhase * 0.7 - idx * 0.25) * 0.08;
        });
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsed * 0.03 + currentScrollY * 0.0004;

      renderer.render(scene, camera);
    }

    animate();

    // --- Window Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;

      if (width < 640) {
        camera.position.z = 17.5;
        camera.position.y = 0.0;
      } else if (width < 1024) {
        camera.position.z = 15.0;
        camera.position.y = 0.1;
      } else {
        camera.position.z = 13.5;
        camera.position.y = 0.2;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-cats-canvas"
      aria-label="3D Cats Cylindrical Scroll Journey"
    />
  );
}
