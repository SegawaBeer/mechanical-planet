<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { MODELS, ROBOT_HEIGHT, VEHICLE_LENGTH, loadForm, type ModelForm } from '$lib/game/models';
  import type { SchemeId } from '$lib/game/robots/scheme';

  type Row = { id: SchemeId; form: ModelForm; label: string };

  const NAMES: Record<SchemeId, string> = {
    hero: '主角',
    river: '河道巡逻者',
    citadel: '铁堡守卫',
    ark: '方舟工程师',
    fortress: '要塞斥候'
  };

  const rows: Row[] = (Object.keys(MODELS) as SchemeId[]).flatMap((id) =>
    (['robot', 'vehicle'] as ModelForm[])
      .filter((form) => MODELS[id][form])
      .map((form) => ({ id, form, label: `${NAMES[id]} · ${form === 'robot' ? '人形' : '载具'}` }))
  );

  const PER_ROW = 5;
  const SPACING = 3.2;
  const ROW_GAP = 3.6;
  /** `?only=hero,ark-vehicle` narrows the row, for close-up checks. */
  const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
  const only = params?.get('only') ?? null;
  /** `?az=180` views the row from behind, to judge which way each model faces. */
  const az = Number(params?.get('az') ?? 0);
  const shown = only
    ? rows.filter((r) => only.split(',').includes(r.id) || only.split(',').includes(`${r.id}-${r.form}`))
    : rows;

  let host: HTMLDivElement;
  let status = '正在加载模型…';
  let failures: string[] = [];
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let raf = 0;

  onMount(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11151c);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(0, 3.4, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x28313d, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(5, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -16;
    key.shadow.camera.right = 16;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fc4ff, 0.9);
    rim.position.set(-6, 4, -8);
    scene.add(rim);

    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a323d, roughness: 0.9, metalness: 0 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(26, 64), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(40, 40, 0x3c4756, 0x2b333e);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    grid.position.y = 0.002;
    scene.add(grid);

    // +Z marker, so it is obvious which way the models are meant to face.
    const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-8, 0.01, ROW_GAP + 2.4), 2.4, 0x5ff2ff, 0.5, 0.28);
    scene.add(arrow);

    // Reference pillar: exactly one code-built robot height (2.0 units).
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xd4dde4, roughness: 0.5, metalness: 0.1 });
    const pillarX = -(Math.min(PER_ROW, Math.max(1, shown.length)) * SPACING) / 2 - 1.6;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, ROBOT_HEIGHT, 0.16), pillarMat);
    pillar.position.set(pillarX, ROBOT_HEIGHT / 2, 0);
    pillar.castShadow = true;
    scene.add(pillar);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.6, metalness: 0.1 });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.34), capMat);
    cap.position.set(pillarX, ROBOT_HEIGHT, 0);
    cap.castShadow = true;
    scene.add(cap);

    // A second bar for vehicle length, laid flat along Z.
    const barMat = new THREE.MeshStandardMaterial({ color: 0x7cf3c8, roughness: 0.6, metalness: 0.1 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, VEHICLE_LENGTH), barMat);
    bar.position.set(pillarX + 1.1, 0.03, 0);
    bar.castShadow = true;
    scene.add(bar);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.0, -1.2);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.update();

    const resize = () => {
      if (!renderer) return;
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const placed: { obj: THREE.Object3D; form: ModelForm }[] = [];
    let last = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      for (const { obj, form } of placed) {
        const anim = (obj.userData as { anim?: (d: number, s: unknown) => boolean }).anim;
        anim?.(dt, {
          speed: form === 'robot' ? 3 : 6,
          speed01: form === 'robot' ? 0.6 : 0.5,
          airborne: false,
          steer: Math.sin(t * 0.9) * 0.7,
          time: t
        });
      }
      controls?.update();
      renderer?.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    void (async () => {
      const cols = Math.min(PER_ROW, Math.max(1, shown.length));
      const startX = -(cols * SPACING) / 2 + SPACING / 2;
      let i = 0;
      for (const row of shown) {
        const obj = await loadForm(row.id, row.form);
        if (!obj) {
          failures = [...failures, row.label];
          i++;
          continue;
        }
        obj.position.set(startX + (i % cols) * SPACING, 0, Math.floor(i / cols) * ROW_GAP);
        scene.add(obj);
        placed.push({ obj, form: row.form });
        i++;
      }
      const lines = Math.max(1, Math.ceil(shown.length / cols));
      controls!.target.set(0, 1.0, ((lines - 1) * ROW_GAP) / 2);
      controls!.update();
      status = failures.length === 0 ? `${placed.length} 个模型已就位` : `${placed.length} 个就位，${failures.length} 个失败`;

      if (placed.length > 0) {
        const bounds = new THREE.Box3();
        for (const { obj } of placed) bounds.expandByObject(obj);
        bounds.expandByObject(pillar);
        const size = bounds.getSize(new THREE.Vector3());
        const halfWidth = size.x * 0.5 + 1.5;
        const distance = halfWidth / Math.tan(THREE.MathUtils.degToRad(camera.fov * camera.aspect * 0.5));
        controls!.target.set(0, Math.max(0.9, size.y * 0.4), ((lines - 1) * ROW_GAP) / 2);
        const a = THREE.MathUtils.degToRad(az);
        camera.position.set(
          controls!.target.x + Math.sin(a) * distance,
          Math.max(2.2, size.y * 0.9),
          controls!.target.z + Math.cos(a) * distance
        );
        controls!.update();
      }
    })();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      controls?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(raf);
  });
</script>

<div class="page">
  <header>
    <h1>角色模型预览</h1>
    <p>{status}</p>
    <p class="hint">
      拖动旋转 · 滚轮缩放。柱子高 {ROBOT_HEIGHT} 单位（人形高度），地上的绿条长 {VEHICLE_LENGTH} 单位（车身长度），青色箭头指向 +Z 正面。
    </p>
  </header>
  <div class="stage" bind:this={host}></div>
  <ul class="legend">
    {#each shown as row}
      <li class:bad={failures.includes(row.label)}>{row.label}</li>
    {/each}
    {#if shown.length === 0}
      <li>还没有压缩后的模型。</li>
    {/if}
  </ul>
</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: #11151c;
    color: #e6edf3;
    font-family: system-ui, sans-serif;
  }
  header {
    padding: 14px 20px 6px;
  }
  h1 {
    margin: 0 0 4px;
    font-size: 18px;
    letter-spacing: 0.02em;
  }
  header p {
    margin: 2px 0;
    font-size: 13px;
    color: #9fb0c0;
  }
  .hint {
    color: #6f8194;
  }
  .stage {
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .stage :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin: 0;
    padding: 10px 20px 16px;
    list-style: none;
    font-size: 12px;
    color: #9fb0c0;
  }
  .legend .bad {
    color: #ff7b6b;
  }
</style>
