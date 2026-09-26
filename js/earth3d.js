/**
 * SmartTourConnect - WebGL 3D Globe & Transit Visualization
 * Smart India Hackathon (SIH 2026) | Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 *
 * Graphics Pipeline:
 * - Three.js WebGL renderer with custom day/night shader blending
 * - Cloud layer rotation with volumetric perspective
 * - Quadratic Bézier spline arcs for inter-city transit corridors
 * - OrbitControls touch/mouse handler with inertia damping
 */

(function () {
  if (typeof THREE === 'undefined') {
    console.warn("Three.js not loaded. 3D Earth skipped.");
    return;
  }

  // Detect Touch / Mobile Devices to prevent touch scroll hijacking
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 1024);

  // Canvas Container
  const container = document.createElement('div');
  container.id = 'earth-3d-bg';
  container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; overflow: hidden; pointer-events: none;';
  document.body.insertBefore(container, document.body.firstChild);

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 11.5);

  const renderer = new THREE.WebGLRenderer({ antialias: !isTouchDevice, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouchDevice ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  // Crucial Mobile Fix: pointer-events NONE on mobile prevents touch hijacking of page scrolls
  renderer.domElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' + (isTouchDevice ? 'pointer-events: none !important;' : 'pointer-events: auto; cursor: grab;');
  container.appendChild(renderer.domElement);

  // Deep Cosmic Nebula Lighting
  const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
  sunLight.position.set(14, 7, 10);
  scene.add(sunLight);

  const auroraBackLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
  auroraBackLight.position.set(-12, -6, -9);
  scene.add(auroraBackLight);

  // Master Earth Pivot Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = 23.44 * (Math.PI / 180); // Earth Axial Tilt
  masterGroup.add(earthGroup);

  // Responsive Placement (Centered behind Hero as in Screenshot)
  function updateEarthPosition() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      masterGroup.position.set(0, 0.6, 0);
      masterGroup.scale.set(0.95, 0.95, 0.95);
    } else if (window.innerWidth < 1280) {
      masterGroup.position.set(0, 0.4, 0);
      masterGroup.scale.set(1.2, 1.2, 1.2);
    } else {
      masterGroup.position.set(0, 0.35, 0);
      masterGroup.scale.set(1.35, 1.35, 1.35);
    }
  }
  updateEarthPosition();

  // Load Textures
  const textureLoader = new THREE.TextureLoader();
  const earthRadius = 3.25;

  const dayTexture = textureLoader.load('assets/earth_day.jpg');
  dayTexture.anisotropy = 8;
  const nightTexture = textureLoader.load('assets/earth_lights.jpg');
  nightTexture.anisotropy = 8;
  const cloudsTexture = textureLoader.load('assets/earth_clouds.jpg');
  cloudsTexture.anisotropy = 8;

  // Custom Day/Night Planetary Shader
  const earthShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTexture },
      nightTexture: { value: nightTexture },
      sunPosition: { value: sunLight.position }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vSunDir;
      uniform vec3 sunPosition;
      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vSunDir = normalize(sunPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vSunDir;
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      void main() {
        float sunDot = dot(vNormal, vSunDir);
        float dayFactor = smoothstep(-0.15, 0.25, sunDot);

        vec4 dayCol = texture2D(dayTexture, vUv);
        vec4 nightCol = texture2D(nightTexture, vUv);

        // Enhance golden city lights on dark side
        vec3 glowingNight = nightCol.rgb * vec3(1.6, 1.3, 0.85);

        // Mix Day and Night seamlessly
        vec3 finalSurface = mix(glowingNight, dayCol.rgb, dayFactor);

        // Subtle specular oceanic shine
        if (dayFactor > 0.1 && dayCol.b > dayCol.r * 1.2) {
          vec3 viewDir = normalize(cameraPosition - vNormal);
          vec3 halfVec = normalize(vSunDir + viewDir);
          float spec = pow(max(0.0, dot(vNormal, halfVec)), 16.0);
          finalSurface += vec3(0.3, 0.6, 0.9) * spec * dayFactor;
        }

        // Atmosphere edge haze
        float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
        vec3 rimGlow = vec3(0.2, 0.65, 0.98) * pow(rim, 3.0) * 0.45;

        gl_FragColor = vec4(finalSurface + rimGlow, 1.0);
      }
    `
  });

  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthMesh = new THREE.Mesh(earthGeo, earthShaderMaterial);
  earthGroup.add(earthMesh);

  // 2. Realistic Floating Clouds Sphere
  const cloudsGeo = new THREE.SphereGeometry(earthRadius + 0.05, 64, 64);
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
  earthGroup.add(cloudsMesh);

  // 3. Multi-Layer Atmosphere Corona (Rayleigh Glow)
  const innerGlowGeo = new THREE.SphereGeometry(earthRadius + 0.15, 48, 48);
  const innerGlowMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.72 - dot(vNormal, vec3(0, 0, 1.0)), 2.4);
        gl_FragColor = vec4(0.22, 0.72, 0.98, 1.0) * intensity * 0.85;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
  earthGroup.add(innerGlow);

  // 4. Futuristic Sci-Fi Orbital Rings (Smart Transit Grid Ring)
  const ringGeo = new THREE.RingGeometry(earthRadius + 0.6, earthRadius + 0.64, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35
  });
  const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
  orbitalRing.rotation.x = Math.PI / 2.2;
  orbitalRing.rotation.y = 0.3;
  earthGroup.add(orbitalRing);

  // Outer Dashed Orbit Ring
  const outerRingGeo = new THREE.RingGeometry(earthRadius + 0.95, earthRadius + 0.97, 64);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.22
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 1.9;
  outerRing.rotation.y = -0.4;
  earthGroup.add(outerRing);

  // 5. Global Transit Flight Arcs & Traveling Beacons
  const hubCoords = [
    { name: "Mumbai/Pune", lat: 19.076, lng: 72.877 },
    { name: "Delhi", lat: 28.613, lng: 77.209 },
    { name: "Dubai", lat: 25.204, lng: 55.270 },
    { name: "Paris", lat: 48.856, lng: 2.352 },
    { name: "London", lat: 51.507, lng: -0.127 },
    { name: "Tokyo", lat: 35.676, lng: 139.650 },
    { name: "Singapore", lat: 1.352, lng: 103.819 },
    { name: "New York", lat: 40.712, lng: -74.006 },
    { name: "Sydney", lat: -33.868, lng: 151.209 }
  ];

  function latLngToVec3(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Destination Pulse Pins
  const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  hubCoords.forEach(c => {
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.copy(latLngToVec3(c.lat, c.lng, earthRadius + 0.02));
    earthGroup.add(pin);
  });

  // Transit Routes with Bézier Curves
  const routes = [
    [0, 2], // Mumbai -> Dubai
    [0, 3], // Mumbai -> Paris
    [0, 5], // Mumbai -> Tokyo
    [0, 6], // Mumbai -> Singapore
    [1, 4], // Delhi -> London
    [2, 3], // Dubai -> Paris
    [3, 7], // Paris -> New York
    [6, 8]  // Singapore -> Sydney
  ];

  const animatedBeacons = [];
  const arcMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55
  });

  const beaconGeo = new THREE.SphereGeometry(0.048, 12, 12);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Warm Amber Flight Spark

  routes.forEach(([srcIdx, dstIdx]) => {
    const v1 = latLngToVec3(hubCoords[srcIdx].lat, hubCoords[srcIdx].lng, earthRadius);
    const v2 = latLngToVec3(hubCoords[dstIdx].lat, hubCoords[dstIdx].lng, earthRadius);

    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const dist = v1.distanceTo(v2);
    const elevation = earthRadius + (dist * 0.32);
    mid.normalize().multiplyScalar(elevation);

    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    const points = curve.getPoints(45);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, arcMat);
    earthGroup.add(line);

    // Traveling photon beacon
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    earthGroup.add(beacon);
    animatedBeacons.push({
      mesh: beacon,
      curve: curve,
      progress: Math.random(),
      speed: 0.0028 + Math.random() * 0.0022
    });
  });

  // 6. Deep Space 3D Starfield
  const starsCount = 1600;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starsCount * 3);
  const starColors = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 180;
    starPositions[i + 1] = (Math.random() - 0.5) * 180;
    starPositions[i + 2] = (Math.random() - 0.5) * 130 - 20;

    const shade = 0.55 + Math.random() * 0.45;
    starColors[i] = shade * 0.75;
    starColors[i + 1] = shade * 0.88;
    starColors[i + 2] = shade;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.19,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // 7. Interactive Drag Orbit Controls (Touch + Mouse)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };
  let targetParallaxX = 0;
  let targetParallaxY = 0;

  function onPointerDown(e) {
    // Only capture drag if clicked on background or canvas directly
    if (e.target.closest('button, input, select, a, .luxury-card, header, nav, #place-suggestions-box')) {
      return;
    }
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    previousMousePosition = { x: clientX, y: clientY };
    velocity = { x: 0, y: 0 };
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    // Mouse Parallax
    const normX = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normY = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    targetParallaxY = normX * 0.22;
    targetParallaxX = normY * 0.12;

    if (isDragging) {
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      velocity = { x: deltaX * 0.005, y: deltaY * 0.005 };

      earthGroup.rotation.y += velocity.x;
      earthGroup.rotation.x += velocity.y;

      previousMousePosition = { x: clientX, y: clientY };
    }
  }

  function onPointerUp() {
    isDragging = false;
    renderer.domElement.style.cursor = 'grab';
  }

  // Only attach drag listeners on desktop mouse devices; mobile touches scroll the webpage freely
  if (!isTouchDevice) {
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
  }

  // Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateEarthPosition();
  });

  // Scroll Parallax reaction
  let scrollOffset = 0;
  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) scrollOffset = (window.scrollY / maxScroll) * 0.8;
  }, { passive: true });

  // Main Render Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    // Inertia decay after dragging
    if (!isDragging) {
      velocity.x *= 0.95;
      velocity.y *= 0.95;
      earthGroup.rotation.y += velocity.x;
      earthGroup.rotation.x += velocity.y;

      // Constant slow celestial orbit
      earthMesh.rotation.y += 0.0007;
      cloudsMesh.rotation.y += 0.0010;
      orbitalRing.rotation.z += 0.0005;
      outerRing.rotation.z -= 0.0003;
      stars.rotation.y += 0.00008;

      // Subtle parallax convergence
      masterGroup.rotation.y += (targetParallaxY + scrollOffset - masterGroup.rotation.y) * 0.05;
      masterGroup.rotation.x += (targetParallaxX - masterGroup.rotation.x) * 0.05;
    }

    // Animate transit pulses along routes
    animatedBeacons.forEach(b => {
      b.progress = (b.progress + b.speed) % 1.0;
      const pt = b.curve.getPoint(b.progress);
      b.mesh.position.copy(pt);
    });

    renderer.render(scene, camera);
  }

  
  // Theme change listener (Daylight vs Deep Space)
  window.addEventListener('stc-theme-changed', (e) => {
    const isLight = e.detail && e.detail.theme === 'light';
    if (isLight) {
      // Light Mode: Brighter sun, subtle stars, crisp daytime atmosphere
      ambientLight.intensity = 2.6;
      ambientLight.color.setHex(0x64748b);
      sunLight.intensity = 3.2;
      starMat.opacity = 0.18;
      orbitalRing.material.opacity = 0.22;
      outerRing.material.opacity = 0.15;
    } else {
      // Dark Mode: Deep cosmic nebula lighting, glowing night lights
      ambientLight.intensity = 1.8;
      ambientLight.color.setHex(0x1e293b);
      sunLight.intensity = 2.8;
      starMat.opacity = 0.85;
      orbitalRing.material.opacity = 0.35;
      outerRing.material.opacity = 0.22;
    }
  });

  // Apply current theme on startup if already light
  if (localStorage.getItem('stc_theme') === 'light') {
    ambientLight.intensity = 2.6;
    ambientLight.color.setHex(0x64748b);
    sunLight.intensity = 3.2;
    starMat.opacity = 0.18;
    orbitalRing.material.opacity = 0.22;
    outerRing.material.opacity = 0.15;
  }

  animate();
  console.log("🌍 Smart Tour Connect - Ultra-Luxury 3D Earth Grid online.");
})();
