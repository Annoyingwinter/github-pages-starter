(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const canvas = document.getElementById('pressure-canvas');
  const stageState = document.querySelector('.stage-state');
  const modeButtons = [...document.querySelectorAll('[data-mode-target]')];
  const modeSections = modeButtons.map((button) => document.getElementById(button.dataset.modeTarget)).filter(Boolean);
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const methodWords = [...document.querySelectorAll('.method-word')];
  const methodSection = document.getElementById('method');
  const trackedCopies = [...document.querySelectorAll('.chapter-copy, .anatomy-copy')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('js');

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const smooth = (value) => value * value * (3 - 2 * value);
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const envelope = (value, inStart, inEnd, outStart, outEnd) => (
    smooth(range(value, inStart, inEnd)) * (1 - smooth(range(value, outStart, outEnd)))
  );

  let scrollTarget = 0;
  let scrollCurrent = 0;
  let frame = 0;
  let pageHidden = document.hidden;
  let lastTimestamp = 0;
  let dirty = true;

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    strength: 0,
    targetStrength: 0,
    lastInput: 0
  };
  let manualMode = null;

  const sceneState = {
    reveal: 0,
    stress: 0,
    rupture: 0,
    anatomy: 0,
    assemble: 0,
    impact: 0,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    fov: 34,
    eyeX: 0,
    eyeY: 0,
    eyeZ: 4,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    roll: 0
  };

  const cameraKeyframes = [
    { p: 0, eye: [0.6, 0.1, 5.0], target: [-1.15, 0.18, 0], rotation: [-0.16, -0.42, 0.24], scale: 1.12, fov: 33, roll: 0 },
    { p: 0.12, eye: [0.15, 0.12, 4.7], target: [0.22, 0, 0], rotation: [0.02, 0.12, 0.03], scale: 1.08, fov: 35, roll: 0 },
    { p: 0.29, eye: [-0.35, 0.04, 4.35], target: [0.7, 0, 0], rotation: [0.08, 0.5, -0.04], scale: 1.02, fov: 37, roll: 0 },
    { p: 0.34, eye: [0, 0, 4.0], target: [0, 0, 0], rotation: [-0.08, 0.8, 0.06], scale: 1.16, fov: 34, roll: 0.08 },
    { p: 0.39, eye: [0.4, -0.08, 4.15], target: [-0.45, 0, 0], rotation: [-0.12, 1.0, 0.09], scale: 1.1, fov: 35, roll: 0.05 },
    { p: 0.5, eye: [0.72, -0.12, 4.2], target: [0.62, 0, 0], rotation: [-0.16, 1.08, 0.12], scale: 1.08, fov: 35, roll: 0.04 },
    { p: 0.575, eye: [-0.15, 0.08, 4.15], target: [-0.92, -0.02, 0], rotation: [0.18, -0.48, -0.06], scale: 1.04, fov: 36, roll: -0.03 },
    { p: 0.602, eye: [-0.15, 0.08, 4.15], target: [-0.92, -0.02, 0], rotation: [0.18, -0.48, -0.06], scale: 1.04, fov: 36, roll: -0.03 },
    { p: 0.612, eye: [1.05, 0.28, 3.45], target: [0.18, 0.02, 0], rotation: [0.34, -1.08, -0.08], scale: 1.16, fov: 31, roll: -0.04 },
    { p: 0.68, eye: [1.2, 0.2, 3.5], target: [0.25, 0.02, 0], rotation: [0.28, -1.18, -0.1], scale: 1.14, fov: 31.5, roll: -0.04 },
    { p: 0.72, eye: [-0.8, 0.2, 4.6], target: [-0.35, 0, 0], rotation: [0.15, -0.72, -0.1], scale: 0.98, fov: 39, roll: -0.08 },
    { p: 0.82, eye: [0, 0.05, 4.8], target: [0, 0, 0], rotation: [0.02, 0.05, 0], scale: 0.9, fov: 37, roll: 0 },
    { p: 0.93, eye: [0, 0, 4.8], target: [0, 0.16, 0], rotation: [0, 0.12, 0], scale: 0.82, fov: 35, roll: 0 },
    { p: 1, eye: [0, 0, 4.45], target: [0, 0.3, 0], rotation: [0, 0.18, 0], scale: 0.92, fov: 33, roll: 0 }
  ];

  const readScrollTarget = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollTarget = clamp(window.scrollY / maxScroll);
  };

  const updateScrollTarget = () => {
    readScrollTarget();
    dirty = true;
    schedule();
  };

  const setCurrentLink = (href) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === href) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const updateDomState = (progress) => {
    root.style.setProperty('--page-progress', progress.toFixed(4));
    root.style.setProperty('--shadow-x', `${clamp(50 - sceneState.targetX * 38, 24, 76).toFixed(1)}%`);
    const typePressure = reducedMotion.matches ? 0 : clamp(sceneState.stress * 0.72 + sceneState.impact * 0.46 + pointer.strength * 0.62);
    root.style.setProperty('--pressure-tight', (1 - typePressure * 0.045).toFixed(4));
    root.style.setProperty('--pressure-wide', (1 + typePressure * 0.032).toFixed(4));

    let label = 'EDGE';
    if (progress >= 0.12) label = 'FOLD';
    if (progress >= 0.3) label = 'STRESS';
    if (progress >= 0.46) label = 'RUPTURE';
    if (progress >= 0.58) label = 'ANATOMY';
    if (progress >= 0.77) label = 'RELEASE';
    if (progress >= 0.92) label = 'REST';
    if (manualMode === 'surface') label = 'SURFACE';
    if (manualMode === 'stress') label = 'STRESS';
    if (manualMode === 'structure') label = 'ANATOMY';
    if (stageState && stageState.textContent !== label) stageState.textContent = label;

    body.dataset.zone = sceneState.impact > 0.62 ? 'impact' : 'dark';

    if (progress < 0.08) navLinks.forEach((link) => link.removeAttribute('aria-current'));
    else if (progress < 0.36) setCurrentLink('#field');
    else if (progress < 0.78) setCurrentLink('#anatomy');
    else if (progress > 0.9) setCurrentLink('#contact');
    else navLinks.forEach((link) => link.removeAttribute('aria-current'));

    let activeMode = manualMode || 'surface';
    const modeProbe = window.innerHeight * 0.42;
    if (!manualMode) {
      modeSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= modeProbe && rect.bottom > modeProbe) activeMode = section.id;
      });
    }
    modeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.modeTarget === activeMode));
    });

    if (methodSection && methodWords.length) {
      const rect = methodSection.getBoundingClientRect();
      const travel = Math.max(1, methodSection.offsetHeight - window.innerHeight);
      const local = clamp(-rect.top / travel);
      const activeIndex = Math.min(methodWords.length - 1, Math.floor(local * methodWords.length));
      methodWords.forEach((word, index) => word.classList.toggle('is-current', index === activeIndex));
    }

    trackedCopies.forEach((copy) => {
      const owner = copy.closest('.chapter, .anatomy-step');
      if (!owner) return;
      const rect = owner.getBoundingClientRect();
      const viewport = Math.max(1, window.innerHeight);
      const enter = clamp((viewport * 0.46 - rect.top) / (viewport * 0.2));
      const copyHeight = Math.min(copy.offsetHeight, viewport * 0.72);
      const exitAnchor = viewport * 0.12 + copyHeight * 0.62;
      const exit = clamp((rect.bottom - exitAnchor) / (viewport * 0.22));
      let displayPresence = Math.min(enter, exit) >= 0.5 ? 1 : 0;
      if (copy.classList.contains('impact-copy')) displayPresence = progress >= 0.24 && progress <= 0.37 ? 1 : 0;
      if (copy.closest('.anatomy-step--structure') && progress >= 0.605 && progress <= 0.69) displayPresence = 0;
      const minimumCopyTop = window.innerWidth < 768 ? 110 : 64;
      if (copy.getBoundingClientRect().top < minimumCopyTop) displayPresence = 0;
      copy.style.setProperty('--copy-presence', displayPresence.toFixed(3));
    });
  };

  const computeScene = (progress) => {
    sceneState.reveal = smooth(range(progress, 0.035, 0.25));
    sceneState.stress = envelope(progress, 0.18, 0.32, 0.64, 0.82);
    sceneState.rupture = envelope(progress, 0.36, 0.48, 0.76, 0.9);
    sceneState.anatomy = envelope(progress, 0.535, 0.585, 0.66, 0.72);
    sceneState.assemble = smooth(range(progress, 0.75, 0.95));
    sceneState.impact = envelope(progress, 0.295, 0.325, 0.465, 0.495);

    if (manualMode === 'surface') {
      sceneState.reveal = 1;
      sceneState.stress = 0;
      sceneState.rupture = 0;
      sceneState.anatomy = 0;
      sceneState.assemble = 0;
    } else if (manualMode === 'stress') {
      sceneState.reveal = 1;
      sceneState.stress = 1;
      sceneState.rupture = 0.08;
      sceneState.anatomy = 0;
      sceneState.assemble = 0;
    } else if (manualMode === 'structure') {
      sceneState.reveal = 1;
      sceneState.stress = 0.5;
      sceneState.rupture = 1;
      sceneState.anatomy = 1;
      sceneState.assemble = 0;
    }

    let keyIndex = 0;
    while (keyIndex < cameraKeyframes.length - 2 && progress > cameraKeyframes[keyIndex + 1].p) keyIndex += 1;
    const from = cameraKeyframes[keyIndex];
    const to = cameraKeyframes[keyIndex + 1];
    const cameraMix = smooth(range(progress, from.p, to.p));

    sceneState.eyeX = mix(from.eye[0], to.eye[0], cameraMix);
    sceneState.eyeY = mix(from.eye[1], to.eye[1], cameraMix);
    sceneState.eyeZ = mix(from.eye[2], to.eye[2], cameraMix);
    sceneState.targetX = mix(from.target[0], to.target[0], cameraMix);
    sceneState.targetY = mix(from.target[1], to.target[1], cameraMix);
    sceneState.targetZ = mix(from.target[2], to.target[2], cameraMix);
    sceneState.rotationX = mix(from.rotation[0], to.rotation[0], cameraMix);
    sceneState.rotationY = mix(from.rotation[1], to.rotation[1], cameraMix);
    sceneState.rotationZ = mix(from.rotation[2], to.rotation[2], cameraMix);
    sceneState.scale = mix(from.scale, to.scale, cameraMix);
    sceneState.fov = mix(from.fov, to.fov, cameraMix);
    sceneState.roll = mix(from.roll, to.roll, cameraMix);

    if (window.innerWidth < 768) {
      const mobileRelease = smooth(range(progress, 0.74, 1));
      const mobileSurfaceSafe = envelope(progress, 0.31, 0.37, 0.46, 0.52);
      const mobileStructureSafe = envelope(progress, 0.48, 0.54, 0.68, 0.74);
      const mobileMacro = envelope(progress, 0.603, 0.62, 0.68, 0.72);
      const heroEdge = 1 - smooth(range(progress, 0.02, 0.12));
      const mobileScale = mix(mix(0.72, 0.86, mobileRelease), 0.82, sceneState.anatomy);
      sceneState.eyeX *= 0.55;
      sceneState.targetX = sceneState.targetX * 0.22 - heroEdge * 0.18;
      sceneState.targetY += heroEdge * 0.18 + mobileSurfaceSafe * 0.34 + mobileStructureSafe * mix(0.78, 0.0, mobileMacro);
      sceneState.scale *= mobileScale * mix(1, 0.92, mobileStructureSafe) * mix(1, 0.78, mobileMacro);
      sceneState.fov += mix(7, 4, mobileRelease) - sceneState.anatomy * 2 + mobileMacro * 2.5;
      sceneState.rotationZ += mix(0.38, 0.1, progress);
    }

    sceneState.rotationY += pointer.x * 0.11;
    sceneState.rotationX -= pointer.y * 0.07;
    sceneState.eyeX += pointer.x * 0.12;
    sceneState.eyeY -= pointer.y * 0.07;
  };

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      manualMode = button.dataset.modeTarget;
      dirty = true;
      schedule();
      document.getElementById(button.dataset.modeTarget)?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
  });

  const releaseManualMode = () => {
    manualMode = null;
    dirty = true;
    schedule();
  };

  window.addEventListener('wheel', releaseManualMode, { passive: true });
  window.addEventListener('touchstart', releaseManualMode, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) releaseManualMode();
  });

  window.addEventListener('resize', () => {
    dirty = true;
    resizeRenderer();
    updateScrollTarget();
  });

  window.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;
    pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    pointer.targetStrength = event.pointerType === 'mouse' ? 0.9 : 0.55;
    pointer.lastInput = performance.now();
    dirty = true;
    schedule();
  }, { passive: true });

  window.addEventListener('pointerdown', (event) => {
    if (reducedMotion.matches) return;
    pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    pointer.targetStrength = 1;
    pointer.lastInput = performance.now();
    dirty = true;
    schedule();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    pageHidden = document.hidden;
    if (!pageHidden) {
      dirty = true;
      schedule();
    }
  });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      pointer.x = 0;
      pointer.y = 0;
      pointer.targetX = 0;
      pointer.targetY = 0;
      pointer.strength = 0;
      pointer.targetStrength = 0;
    }
    dirty = true;
    schedule();
  });

  document.addEventListener('scroll', updateScrollTarget, { passive: true });

  const sectionObserver = new IntersectionObserver(() => updateScrollTarget(), {
    root: null,
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
  });
  document.querySelectorAll('.chapter, .anatomy-step').forEach((section) => sectionObserver.observe(section));

  let gl = null;
  let program = null;
  let vao = null;
  let edgeVao = null;
  let indexCount = 0;
  let edgeIndexCount = 0;
  let uniforms = null;
  let rendererReady = false;
  let firstFrameDrawn = false;
  let qualityScale = 1;
  let averageFrame = 16;
  let qualitySamples = 0;

  const projection = new Float32Array(16);
  const view = new Float32Array(16);
  const viewProjection = new Float32Array(16);
  const eye = new Float32Array(3);
  const target = new Float32Array(3);
  const up = new Float32Array(3);

  const vertexShaderSource = `#version 300 es
    precision highp float;

    layout(location = 0) in vec2 aUv;
    layout(location = 1) in float aShellAttribute;
    layout(location = 2) in float aEdge;

    uniform mat4 uViewProjection;
    uniform float uTime;
    uniform float uReveal;
    uniform float uStress;
    uniform float uRupture;
    uniform float uAnatomy;
    uniform float uAssemble;
    uniform float uLayer;
    uniform float uShell;
    uniform float uEdgePass;
    uniform float uScale;
    uniform vec2 uViewport;
    uniform vec2 uPointer;
    uniform float uPointerStrength;
    uniform vec3 uRotation;

    out vec3 vWorld;
    out vec3 vNormal;
    out vec3 vTangent;
    out vec2 vUv;
    out float vStress;
    out float vEdge;

    const float PI = 3.141592653589793;

    mat2 rotate2d(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat2(c, -s, s, c);
    }

    mat3 rotateX(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
    }

    mat3 rotateY(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
    }

    mat3 rotateZ(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
    }

    float pointerPressure(vec2 uv) {
      vec2 mappedPointer = vec2(uPointer.x * 0.84, -uPointer.y * 0.72);
      vec2 delta = uv - mappedPointer;
      return exp(-dot(delta, delta) * 7.5) * uPointerStrength;
    }

    vec3 pressureFold(vec2 uv) {
      float u = uv.x;
      float v = uv.y;
      float reveal = 0.22 + uReveal * 0.78;
      float edgeTaper = 0.12 + 0.88 * smoothstep(0.0, 0.32, 1.0 - abs(u));
      float notch = 1.0 - 0.34 * exp(-pow((u - 0.34) * 6.2, 2.0));
      notch *= 1.0 - 0.16 * exp(-pow((u + 0.42) * 7.0, 2.0));
      float width = 0.38 * (0.8 + 0.2 * cos(u * PI)) * edgeTaper * notch;
      float foldWave = 0.63662 * asin(sin((u + 0.9) * PI * 1.42));
      float twistWave = 0.63662 * asin(sin((u + 0.74) * PI * 1.16));
      float twist = (twistWave * 1.42 + u * 0.28) * (0.52 + reveal * 0.66);

      vec3 center = vec3(
        u * 1.9,
        sin(u * PI * 1.25) * 0.08 + foldWave * 0.2,
        cos(u * PI * 0.82) * 0.12 + foldWave * 0.42 * reveal
      );

      vec3 across = normalize(vec3(0.08 * sin(u * PI), cos(twist), sin(twist)));
      float blade = sign(v) * pow(abs(v), 1.08);
      vec3 position = center + across * blade * width;
      position.z += (1.0 - abs(v)) * foldWave * 0.14 * reveal;

      float ridge = pow(abs(v), 1.65);
      position.z += ridge * 0.12 * sin(u * PI * 1.45);

      float segmentedFold = abs(fract((u + 1.0) * 1.18) - 0.5) * 2.0;
      position.z += (segmentedFold - 0.5) * 0.2 * reveal;
      position.y += (segmentedFold - 0.5) * 0.055 * sign(v);
      position.y += sin(v * PI) * 0.035;

      position.x *= 1.0 - uStress * 0.22;
      position.y *= 1.0 - uStress * 0.08;
      position.z += uStress * 0.23 * sin(u * PI * 2.7) * (1.0 - abs(v) * 0.42);

      float pressure = pointerPressure(uv);
      position.z -= pressure * 0.3;
      position.y += pressure * 0.045 * sin(u * 8.0);

      float layerMagnitude = abs(uLayer);
      float separation = uLayer * uRupture * (0.88 + layerMagnitude * 0.09);
      position.y += separation * 0.22 * (0.55 + 0.45 * cos(u * PI));
      position.z += separation * 0.11;
      position.xz = rotate2d(separation * 0.085) * position.xz;
      position.z += uRupture * layerMagnitude * 0.026 * sin((u * 2.1 + uLayer * 0.37) * PI);
      position.y += uRupture * uLayer * 0.018 * cos((u * 1.35 - uLayer * 0.21) * PI);
      position.y += uLayer * uAnatomy * 0.065;
      position.z += abs(uLayer) * uAnatomy * 0.035;

      float settle = uAssemble * 0.1;
      position.y *= 1.0 - settle;
      position.z *= 1.0 - settle * 0.35;

      return position * uScale;
    }

    void main() {
      vec3 position = pressureFold(aUv);
      vec3 positionU = pressureFold(aUv + vec2(0.0025, 0.0));
      vec3 positionV = pressureFold(aUv + vec2(0.0, 0.0025));
      vec3 tangent = normalize(positionU - position);
      vec3 normal = normalize(cross(positionU - position, positionV - position));
      vec3 acrossNormal = normalize(cross(normal, tangent));
      vec3 shadeNormal = normal;
      if (aEdge > 0.5 && aEdge < 1.5) shadeNormal = -tangent;
      if (aEdge > 1.5 && aEdge < 2.5) shadeNormal = tangent;
      if (aEdge > 2.5 && aEdge < 3.5) shadeNormal = -acrossNormal;
      if (aEdge > 3.5) shadeNormal = acrossNormal;

      float shell = mix(uShell, aShellAttribute, uEdgePass);
      float layerThickness = 0.009 + (2.0 - min(abs(uLayer), 2.0)) * 0.004;
      position += normal * shell * layerThickness;

      mat3 rotation = rotateZ(uRotation.z) * rotateY(uRotation.y) * rotateX(uRotation.x);
      position = rotation * position;
      shadeNormal = normalize(rotation * shadeNormal);
      tangent = normalize(rotation * tangent);

      float pressure = pointerPressure(aUv);
      float curvature = abs(sin(aUv.x * PI * 2.3 + aUv.y * 0.8));
      vStress = clamp(curvature * 0.28 + pressure * 0.9 + uStress * 0.48 + uRupture * (1.0 - abs(aUv.y)) * 0.22, 0.0, 1.0);
      vWorld = position;
      vNormal = shadeNormal;
      vTangent = tangent;
      vUv = aUv;
      vEdge = aEdge;
      gl_Position = uViewProjection * vec4(position, 1.0);
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec3 vWorld;
    in vec3 vNormal;
    in vec3 vTangent;
    in vec2 vUv;
    in float vStress;
    in float vEdge;

    uniform float uTime;
    uniform float uMaterial;
    uniform float uAlpha;
    uniform float uImpact;
    uniform float uLayer;
    uniform float uShell;
    uniform float uReveal;
    uniform float uAnatomy;
    uniform float uEdgePass;
    uniform vec2 uViewport;
    uniform vec3 uCamera;

    out vec4 outColor;

    float hash21(vec2 point) {
      point = fract(point * vec2(123.34, 345.45));
      point += dot(point, point + 34.345);
      return fract(point.x * point.y);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / max(uViewport, vec2(1.0));
      float diagonalReveal = screenUv.x + (1.0 - screenUv.y) * 0.24;
      float revealGate = mix(0.88, -0.2, smoothstep(0.0, 1.0, uReveal));
      if (diagonalReveal < revealGate) discard;

      float anatomyCut = smoothstep(0.2, 0.92, uAnatomy);
      float cutLimit = mix(1.05, 0.32, anatomyCut);
      float crossSection = step(4.5, vEdge);
      if (crossSection < 0.5 && vUv.x > cutLimit) discard;
      if (crossSection > 0.5 && anatomyCut < 0.08) discard;

      vec3 normal = normalize(vNormal);
      if (!gl_FrontFacing) normal = -normal;
      vec3 geometricNormal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
      if (!gl_FrontFacing) geometricNormal = -geometricNormal;
      normal = normalize(mix(normal, geometricNormal, 0.08));

      vec3 viewDirection = normalize(uCamera - vWorld);
      vec3 keyLight = normalize(vec3(-0.46, 0.64, 0.61));
      vec3 fillLight = normalize(vec3(0.68, -0.14, 0.52));
      float nDotV = max(dot(normal, viewDirection), 0.0);
      float diffuse = max(dot(normal, keyLight), 0.0);
      float fill = max(dot(normal, fillLight), 0.0);
      float fresnel = 0.055 + 0.945 * pow(1.0 - nDotV, 5.0);

      vec3 reflected = reflect(-viewDirection, normal);
      float sky = smoothstep(-0.58, 0.78, reflected.y);
      float horizon = exp(-pow(reflected.y * 4.4, 2.0));
      vec3 environment = mix(vec3(0.003, 0.006, 0.014), vec3(0.13, 0.18, 0.24), sky);
      environment += horizon * vec3(0.24, 0.28, 0.32);

      float grain = hash21(floor((vUv + 1.0) * vec2(118.0, 54.0)));
      float roughness = clamp(0.17 + grain * 0.055 + abs(uLayer) * 0.03, 0.16, 0.34);
      vec3 halfVector = normalize(keyLight + viewDirection);
      float specular = pow(max(dot(normal, halfVector), 0.0), mix(220.0, 48.0, roughness));
      float tangentFlash = pow(max(abs(dot(normalize(vTangent), halfVector)), 0.0), 10.0) * specular;

      float scanCoordinate = dot(vWorld, normalize(vec3(0.84, 0.08, 0.32))) + sin(uTime * 0.16) * 1.18;
      float scanLight = exp(-abs(scanCoordinate) * 12.0) * (0.35 + 0.65 * fresnel);

      float seamCurve = 0.2 * sin(vUv.x * 3.4 + uLayer * 0.18) + 0.055 * sin(vUv.x * 9.0);
      float seam = exp(-abs(vUv.y - seamCurve) * 76.0);
      float stressLine = seam * smoothstep(0.12, 0.58, vStress) * mix(1.0, 0.28, uEdgePass);

      vec3 signal = mix(vec3(0.72, 0.96, 0.015), vec3(0.015, 0.024, 0.012), uImpact);
      vec3 spectral = vec3(0.28, 0.13, 0.46);
      vec3 metalBase = vec3(0.002, 0.004, 0.009);

      vec3 metalColor = metalBase * (0.42 + diffuse * 0.58 + fill * 0.12);
      metalColor += environment * (0.04 + fresnel * 0.4);
      metalColor += vec3(0.82, 0.88, 0.94) * specular * mix(1.9, 0.9, roughness);
      metalColor += vec3(0.52, 0.58, 0.64) * tangentFlash * 0.24;
      metalColor += vec3(0.74, 0.82, 0.92) * scanLight * 0.52;
      metalColor += mix(vec3(0.11, 0.15, 0.2), spectral, 0.34) * fresnel * 0.22;

      vec3 resinColor = mix(vec3(0.018, 0.03, 0.055), environment, 0.34 + fresnel * 0.32);
      resinColor += mix(vec3(0.13, 0.19, 0.28), spectral, 0.44) * fresnel * 0.62;
      resinColor += vec3(0.52, 0.62, 0.7) * specular * 0.34;

      float layerDepth = clamp(abs(uLayer) * 0.5, 0.0, 1.0);
      float layerSide = step(0.0, uLayer);
      vec3 layerTint = mix(vec3(0.02, 0.055, 0.085), vec3(0.085, 0.035, 0.12), layerSide);
      resinColor = mix(resinColor, layerTint, 0.12 + layerDepth * 0.12);

      vec3 color = mix(resinColor, metalColor, uMaterial);
      color = mix(color, signal, stressLine * mix(0.84, 0.38, uImpact));
      color *= mix(0.5, 1.0, step(0.0, uShell));
      vec3 sealColor = vec3(0.012, 0.018, 0.025);
      sealColor += vec3(0.28, 0.34, 0.4) * (fresnel * 0.18 + specular * 0.08);
      color = mix(color, sealColor, uEdgePass);
      color *= 1.0 - (1.0 - fresnel) * (0.05 + uAnatomy * 0.08) * (0.45 + layerDepth * 0.55);
      color = mix(color, color * 0.42, uImpact * 0.78);

      float alpha = mix((0.15 + fresnel * 0.32) * uAlpha, uAlpha, uMaterial);
      float coreLayer = 1.0 - smoothstep(0.05, 0.35, abs(uLayer));
      float bondLayer = smoothstep(0.35, 0.75, abs(uLayer)) * (1.0 - smoothstep(1.25, 1.75, abs(uLayer)));
      vec3 crossColor = mix(vec3(0.01, 0.016, 0.023), vec3(0.035, 0.075, 0.11), bondLayer);
      crossColor = mix(crossColor, vec3(0.19, 0.21, 0.23), coreLayer);
      crossColor += signal * (0.018 + bondLayer * 0.035 + coreLayer * 0.14) * (0.35 + fresnel * 0.65);
      color = mix(color, crossColor, crossSection * anatomyCut);
      alpha = mix(alpha, 1.0, crossSection * anatomyCut);
      color = color / (color + vec3(0.74));
      color = pow(max(color, 0.0), vec3(0.4545));

      outColor = vec4(color, alpha);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'Shader compilation failed');
    }
    return shader;
  };

  const createProgram = () => {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const nextProgram = gl.createProgram();
    gl.attachShader(nextProgram, vertexShader);
    gl.attachShader(nextProgram, fragmentShader);
    gl.linkProgram(nextProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(nextProgram);
      gl.deleteProgram(nextProgram);
      throw new Error(message || 'Program linking failed');
    }
    return nextProgram;
  };

  const createGeometry = () => {
    const columns = window.innerWidth < 768 ? 74 : 118;
    const rows = window.innerWidth < 768 ? 26 : 40;
    const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
    const indices = new Uint16Array(columns * rows * 6);
    let vertexOffset = 0;
    let indexOffset = 0;

    for (let row = 0; row <= rows; row += 1) {
      for (let column = 0; column <= columns; column += 1) {
        vertices[vertexOffset] = (column / columns) * 2 - 1;
        vertices[vertexOffset + 1] = (row / rows) * 2 - 1;
        vertexOffset += 2;
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const topLeft = row * (columns + 1) + column;
        const topRight = topLeft + 1;
        const bottomLeft = topLeft + columns + 1;
        const bottomRight = bottomLeft + 1;
        indices[indexOffset] = topLeft;
        indices[indexOffset + 1] = bottomLeft;
        indices[indexOffset + 2] = topRight;
        indices[indexOffset + 3] = topRight;
        indices[indexOffset + 4] = bottomLeft;
        indices[indexOffset + 5] = bottomRight;
        indexOffset += 6;
      }
    }

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(1);
    gl.vertexAttrib1f(1, 0);
    gl.disableVertexAttribArray(2);
    gl.vertexAttrib1f(2, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    indexCount = indices.length;

    const edgeVertices = [];
    const edgeIndices = [];
    const addBoundary = (points, edgeType) => {
      const base = edgeVertices.length / 4;
      points.forEach(([u, v]) => {
        edgeVertices.push(u, v, -1, edgeType, u, v, 1, edgeType);
      });
      for (let point = 0; point < points.length - 1; point += 1) {
        const a = base + point * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        edgeIndices.push(a, c, b, b, c, d);
      }
    };

    const leftEdge = [];
    const rightEdge = [];
    for (let row = 0; row <= rows; row += 1) {
      const v = (row / rows) * 2 - 1;
      leftEdge.push([-1, v]);
      rightEdge.push([1, v]);
    }

    const lowerEdge = [];
    const upperEdge = [];
    const crossSectionEdge = [];
    for (let column = 0; column <= columns; column += 1) {
      const u = (column / columns) * 2 - 1;
      lowerEdge.push([u, -1]);
      upperEdge.push([u, 1]);
    }
    for (let row = 0; row <= rows; row += 1) {
      const v = (row / rows) * 2 - 1;
      crossSectionEdge.push([0.32, v]);
    }

    addBoundary(leftEdge, 1);
    addBoundary(rightEdge, 2);
    addBoundary(lowerEdge, 3);
    addBoundary(upperEdge, 4);
    addBoundary(crossSectionEdge, 5);

    edgeVao = gl.createVertexArray();
    gl.bindVertexArray(edgeVao);

    const edgeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, edgeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgeVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 8);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 16, 12);

    const edgeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edgeIndices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    edgeIndexCount = edgeIndices.length;
  };

  const perspective = (out, fieldOfView, aspect, near, far) => {
    const f = 1 / Math.tan(fieldOfView / 2);
    out.fill(0);
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[14] = (2 * far * near) / (near - far);
  };

  const lookAt = (out, eyePosition, center, upVector) => {
    let z0 = eyePosition[0] - center[0];
    let z1 = eyePosition[1] - center[1];
    let z2 = eyePosition[2] - center[2];
    let length = Math.hypot(z0, z1, z2) || 1;
    z0 /= length;
    z1 /= length;
    z2 /= length;

    let x0 = upVector[1] * z2 - upVector[2] * z1;
    let x1 = upVector[2] * z0 - upVector[0] * z2;
    let x2 = upVector[0] * z1 - upVector[1] * z0;
    length = Math.hypot(x0, x1, x2) || 1;
    x0 /= length;
    x1 /= length;
    x2 /= length;

    const y0 = z1 * x2 - z2 * x1;
    const y1 = z2 * x0 - z0 * x2;
    const y2 = z0 * x1 - z1 * x0;

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyePosition[0] + x1 * eyePosition[1] + x2 * eyePosition[2]);
    out[13] = -(y0 * eyePosition[0] + y1 * eyePosition[1] + y2 * eyePosition[2]);
    out[14] = -(z0 * eyePosition[0] + z1 * eyePosition[1] + z2 * eyePosition[2]);
    out[15] = 1;
  };

  const multiply = (out, a, b) => {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  };

  function resizeRenderer() {
    if (!gl || !rendererReady) return;
    const mobile = window.innerWidth < 768;
    const maxRatio = mobile ? 1.15 : 1.45;
    const ratio = Math.min(window.devicePixelRatio || 1, maxRatio) * qualityScale;
    const width = Math.max(1, Math.floor(window.innerWidth * ratio));
    const height = Math.max(1, Math.floor(window.innerHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, width, height);
    }
  }

  const drawLayer = (layer, material, alpha, shell) => {
    gl.uniform1f(uniforms.layer, layer);
    gl.uniform1f(uniforms.shell, shell);
    gl.uniform1f(uniforms.edgePass, 0);
    gl.uniform1f(uniforms.material, material);
    gl.uniform1f(uniforms.alpha, alpha);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
  };

  const drawEdges = (layer, material, alpha) => {
    gl.uniform1f(uniforms.layer, layer);
    gl.uniform1f(uniforms.shell, 1);
    gl.uniform1f(uniforms.edgePass, 1);
    gl.uniform1f(uniforms.material, material);
    gl.uniform1f(uniforms.alpha, alpha);
    gl.bindVertexArray(edgeVao);
    gl.drawElements(gl.TRIANGLES, edgeIndexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(vao);
    gl.uniform1f(uniforms.edgePass, 0);
  };

  const drawWebGL = (time) => {
    const impact = sceneState.impact;
    const fieldImpact = impact > 0.62 ? 1 : 0;
    const dark = [0.006, 0.009, 0.014];
    const acid = [0.7, 0.94, 0.012];
    gl.clearColor(
      mix(dark[0], acid[0], fieldImpact),
      mix(dark[1], acid[1], fieldImpact),
      mix(dark[2], acid[2], fieldImpact),
      1
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye[0] = sceneState.eyeX;
    eye[1] = sceneState.eyeY;
    eye[2] = sceneState.eyeZ;
    target[0] = sceneState.targetX;
    target[1] = sceneState.targetY;
    target[2] = sceneState.targetZ;
    up[0] = Math.sin(sceneState.roll);
    up[1] = Math.cos(sceneState.roll);
    up[2] = 0;

    perspective(projection, sceneState.fov * Math.PI / 180, canvas.width / canvas.height, 0.1, 40);
    lookAt(view, eye, target, up);
    multiply(viewProjection, projection, view);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(uniforms.viewProjection, false, viewProjection);
    gl.uniform1f(uniforms.time, reducedMotion.matches ? 0 : time * 0.001);
    gl.uniform1f(uniforms.reveal, sceneState.reveal);
    gl.uniform1f(uniforms.stress, sceneState.stress);
    gl.uniform1f(uniforms.rupture, sceneState.rupture);
    gl.uniform1f(uniforms.anatomy, sceneState.anatomy);
    gl.uniform1f(uniforms.assemble, sceneState.assemble);
    gl.uniform1f(uniforms.scale, sceneState.scale);
    gl.uniform2f(uniforms.viewport, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.pointerStrength, pointer.strength);
    gl.uniform3f(uniforms.rotation, sceneState.rotationX, sceneState.rotationY, sceneState.rotationZ);
    gl.uniform3f(uniforms.camera, eye[0], eye[1], eye[2]);
    gl.uniform1f(uniforms.impact, sceneState.impact);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    drawLayer(-2, 0.02, 0.1, -1);
    drawLayer(-2, 0.08, 0.24, 1);
    drawLayer(2, 0.02, 0.1, -1);
    drawLayer(2, 0.08, 0.24, 1);
    drawLayer(-1, 0.18, 0.16, -1);
    drawLayer(-1, 0.3, 0.42, 1);
    drawLayer(1, 0.14, 0.16, -1);
    drawLayer(1, 0.26, 0.42, 1);
    drawEdges(-2, 0.18, 0.82);
    drawEdges(2, 0.18, 0.82);
    drawEdges(-1, 0.28, 0.9);
    drawEdges(1, 0.28, 0.9);

    gl.depthMask(true);
    gl.disable(gl.BLEND);
    drawLayer(0, 1, 1, -1);
    drawLayer(0, 1, 1, 1);
    drawEdges(0, 0.32, 1);
    gl.bindVertexArray(null);

    if (!firstFrameDrawn && gl.getError() === gl.NO_ERROR) {
      firstFrameDrawn = true;
      root.classList.add('webgl-drawn');
    }
  };

  const degradeQualityIfNeeded = (delta) => {
    if (reducedMotion.matches || qualityScale <= 0.76 || qualitySamples > 240) return;
    averageFrame = averageFrame * 0.94 + delta * 0.06;
    qualitySamples += 1;
    if (qualitySamples > 90 && averageFrame > 25) {
      qualityScale = Math.max(0.76, qualityScale - 0.14);
      qualitySamples = 0;
      averageFrame = 16;
      resizeRenderer();
    }
  };

  function render(timestamp) {
    frame = 0;
    if (pageHidden) return;

    readScrollTarget();
    const delta = Math.min(50, timestamp - lastTimestamp || 16);
    lastTimestamp = timestamp;
    const easing = reducedMotion.matches ? 1 : 1 - Math.exp(-delta * 0.009);
    const pointerEasing = 1 - Math.exp(-delta * 0.0055);
    scrollCurrent += (scrollTarget - scrollCurrent) * easing;
    pointer.x += (pointer.targetX - pointer.x) * pointerEasing;
    pointer.y += (pointer.targetY - pointer.y) * pointerEasing;

    if (performance.now() - pointer.lastInput > 520) pointer.targetStrength = 0;
    pointer.strength += (pointer.targetStrength - pointer.strength) * pointerEasing;

    computeScene(scrollCurrent);
    updateDomState(scrollCurrent);
    if (rendererReady) drawWebGL(timestamp);
    degradeQualityIfNeeded(delta);

    const stillMoving = Math.abs(scrollTarget - scrollCurrent) > 0.00015
      || Math.abs(pointer.targetX - pointer.x) > 0.001
      || Math.abs(pointer.targetY - pointer.y) > 0.001
      || Math.abs(pointer.targetStrength - pointer.strength) > 0.002;

    dirty = stillMoving;
    if (!reducedMotion.matches || dirty) schedule();
  }

  function schedule() {
    if (!frame && !pageHidden) frame = requestAnimationFrame(render);
  }

  const initializeWebGL = () => {
    if (!(canvas instanceof HTMLCanvasElement)) return;

    try {
      gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: true,
        depth: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false
      });

      if (!gl) throw new Error('WebGL2 unavailable');

      program = createProgram();
      createGeometry();
      uniforms = {
        viewProjection: gl.getUniformLocation(program, 'uViewProjection'),
        time: gl.getUniformLocation(program, 'uTime'),
        reveal: gl.getUniformLocation(program, 'uReveal'),
        stress: gl.getUniformLocation(program, 'uStress'),
        rupture: gl.getUniformLocation(program, 'uRupture'),
        anatomy: gl.getUniformLocation(program, 'uAnatomy'),
        assemble: gl.getUniformLocation(program, 'uAssemble'),
        layer: gl.getUniformLocation(program, 'uLayer'),
        shell: gl.getUniformLocation(program, 'uShell'),
        edgePass: gl.getUniformLocation(program, 'uEdgePass'),
        scale: gl.getUniformLocation(program, 'uScale'),
        viewport: gl.getUniformLocation(program, 'uViewport'),
        pointer: gl.getUniformLocation(program, 'uPointer'),
        pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
        rotation: gl.getUniformLocation(program, 'uRotation'),
        material: gl.getUniformLocation(program, 'uMaterial'),
        alpha: gl.getUniformLocation(program, 'uAlpha'),
        impact: gl.getUniformLocation(program, 'uImpact'),
        camera: gl.getUniformLocation(program, 'uCamera')
      };

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.CULL_FACE);
      rendererReady = true;
      resizeRenderer();
      root.classList.add('webgl-ready');
    } catch (error) {
      console.warn('Pressure Fold is using its static fallback.', error);
      rendererReady = false;
      root.classList.add('no-webgl');
    }

    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      rendererReady = false;
      firstFrameDrawn = false;
      root.classList.remove('webgl-ready');
      root.classList.remove('webgl-drawn');
      root.classList.add('no-webgl');
    });
  };

  initializeWebGL();
  updateScrollTarget();
  computeScene(scrollTarget);
  updateDomState(scrollTarget);
  methodWords[0]?.classList.add('is-current');
  schedule();
})();
