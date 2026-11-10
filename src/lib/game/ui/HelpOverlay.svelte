<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { seedLink } from '../seed';
  import { EARTH_SEED } from '../space';

  export let isTouch = false;
  export let found = 0;
  export let total = 4;
  export let seed = '';
  export let depth = 0;

  const dispatch = createEventDispatcher();

  let copyState: 'idle' | 'copied' | 'failed' = 'idle';
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  $: isEarth = seed === EARTH_SEED;
  $: link = seed ? seedLink(seed, undefined, depth) : '';

  async function copyLink() {
    clearTimeout(copyTimer);
    try {
      await navigator.clipboard.writeText(link);
      copyState = 'copied';
    } catch {
      copyState = 'failed';
    }
    copyTimer = setTimeout(() => (copyState = 'idle'), 2200);
  }
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="操作指南">
  <button class="backdrop" on:click={() => dispatch('close')} aria-label="关闭"></button>
  <div class="panel">
    <p class="kicker">玩法</p>
    <h2>机械星球 · 操作指南</h2>
    <p class="lead">
      在四个区域里点亮信标，爬上高塔看天上的矿石列车。已点亮：
      <strong>{found} / {total}</strong>。
    </p>

    <section class="journey" aria-labelledby="journey-title">
      <p class="kicker" id="journey-title">目标</p>
      <ol>
        <li><strong>点亮四处信标</strong><span>能量河流、铁堡、方舟号、暗影要塞，每个区域中心各有一座。</span></li>
        <li><strong>接管另外三个机器人</strong><span>点击另一个机器人就能接管它，按 Tab 回到主角。</span></li>
        <li><strong>收集能量晶块</strong><span>星球表面散布着发光的晶块，走过去就能拾取。</span></li>
      </ol>
    </section>

    <dl>
      {#if isTouch}
        <div><dt>移动</dt><dd>用左下角的摇杆前后移动、左右转向。</dd></div>
        <div><dt>奔跑与加速</dt><dd>按住奔跑键；载具形态下是加速。</dd></div>
        <div><dt>跳跃</dt><dd>只有机器人形态能跳。</dd></div>
        <div><dt>变形</dt><dd>点变形按钮，在机器人形态和载具形态之间切换。</dd></div>
        <div><dt>信标</dt><dd>走到信标旁边，点出现的卡片点亮它。</dd></div>
        <div><dt>换人</dt><dd>点击另一个机器人就接管它；点回到主角按钮，或用 Tab，回主角。</dd></div>
        <div><dt>晶块</dt><dd>发光的能量晶块走过去就捡起来。</dd></div>
        <div><dt>视角</dt><dd>拖动屏幕旋转视角，双指缩放。</dd></div>
        <div><dt>日志</dt><dd>点书页按钮查看区域、信标、机器动物和晶块的进度。</dd></div>
        <div><dt>拍照</dt><dd>点相机按钮隐藏界面，再从角落保存或退出。</dd></div>
      {:else}
        <div><dt><kbd>方向键</kbd><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></dt><dd>上下前后移动，左右转向。</dd></div>
        <div><dt><kbd>Shift</kbd></dt><dd>奔跑；载具形态下是加速。</dd></div>
        <div><dt><kbd>空格</kbd></dt><dd>跳跃，只有机器人形态可以。</dd></div>
        <div><dt><kbd>F</kbd></dt><dd>在机器人形态和载具形态之间变形。</dd></div>
        <div><dt><kbd>E</kbd></dt><dd>和信标互动。点击另一个机器人可以接管它，<kbd>Tab</kbd> 回到主角。</dd></div>
        <div><dt><kbd>M</kbd></dt><dd>拉开到星球视角，看整颗星球和天上的环轨。</dd></div>
        <div><dt><kbd>J</kbd></dt><dd>打开日志：走过的区域、点亮的信标、见过的机器动物、捡到的能量晶块。</dd></div>
        <div><dt><kbd>H</kbd></dt><dd>打开这份帮助。</dd></div>
        <div><dt><kbd>P</kbd></dt><dd>拍照模式：隐藏界面。再按一次或 <kbd>Esc</kbd> 退出，也可以从角落保存图片。</dd></div>
        <div><dt>鼠标</dt><dd>拖动旋转视角，滚轮缩放。</dd></div>
        <div><dt>抬头看</dt><dd>天上跑着三圈矿石列车，远处挂着一颗带光环的行星。</dd></div>
      {/if}
    </dl>

    {#if seed}
      <div class="seed">
        <div class="seed-text">
          <p class="kicker">{isEarth ? '起始星球' : `星球种子 · 深度 ${depth}`}</p>
          <p class="seed-label"><code>{isEarth ? '机械星球' : seed}</code></p>
          <p class="seed-help">
            {#if copyState === 'failed'}
              手动复制这个链接：<span class="seed-url">{link}</span>
            {:else}
              把这个链接发给别人，就能进入同一颗星球。
            {/if}
          </p>
        </div>
        <div class="seed-actions">
          <button class="chip" on:click={copyLink}>{copyState === 'copied' ? '已复制' : '复制链接'}</button>
        </div>
      </div>
    {/if}

    <div class="actions">
      <button class="continue" on:click={() => dispatch('close')}>回到星球</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    inset: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: var(--planet-sans);
    color: #f2efe6;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    border: none;
    background: rgba(6, 16, 24, 0.55);
    backdrop-filter: blur(4px);
  }
  .panel {
    position: relative;
    width: min(520px, 100%);
    max-height: min(82vh, 82dvh);
    overflow-y: auto;
    padding: 26px 28px 22px;
    background: rgba(14, 30, 40, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
    animation: pop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .kicker {
    margin: 0;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #e9c46a;
  }
  h2 {
    margin: 8px 0 10px;
    font-family: var(--planet-serif);
    font-weight: 400;
    font-size: 1.8rem;
    line-height: 1.1;
    color: #fbf8f0;
  }
  .lead {
    margin: 0 0 18px;
    font-size: 0.86rem;
    line-height: 1.55;
    color: rgba(242, 239, 230, 0.72);
  }
  .lead strong {
    color: #e9c46a;
    font-weight: 600;
  }
  .journey {
    margin: 0 0 20px;
    padding: 14px 15px;
    border: 1px solid rgba(233, 196, 106, 0.2);
    border-radius: 12px;
    background: rgba(233, 196, 106, 0.045);
  }
  .journey ol {
    margin: 11px 0 12px;
    padding: 0;
    display: grid;
    gap: 8px;
    counter-reset: journey;
    list-style: none;
  }
  .journey li {
    display: grid;
    grid-template-columns: 21px 1fr;
    column-gap: 9px;
    counter-increment: journey;
  }
  .journey li::before {
    grid-row: 1 / span 2;
    width: 19px;
    height: 19px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(233, 196, 106, 0.4);
    border-radius: 50%;
    color: #e9c46a;
    content: counter(journey);
    font-size: 0.6rem;
  }
  .journey li strong {
    color: rgba(242, 239, 230, 0.88);
    font-size: 0.76rem;
    font-weight: 500;
  }
  .journey li span {
    margin-top: 2px;
    color: rgba(242, 239, 230, 0.58);
    font-size: 0.69rem;
    line-height: 1.45;
  }
  .fuel-note,
  .earth-note {
    margin: 5px 0 0;
    color: rgba(242, 239, 230, 0.62);
    font-size: 0.69rem;
    line-height: 1.5;
  }
  .fuel-note strong,
  .earth-note strong {
    color: #e9c46a;
    font-weight: 500;
  }
  dl {
    margin: 0;
    display: grid;
    gap: 10px;
  }
  dl div {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;
    align-items: baseline;
    font-size: 0.82rem;
  }
  dt {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    color: rgba(242, 239, 230, 0.85);
    font-weight: 500;
  }
  dd {
    margin: 0;
    color: rgba(242, 239, 230, 0.66);
    line-height: 1.5;
  }
  kbd {
    font-family: var(--planet-sans);
    font-size: 0.62rem;
    line-height: 1;
    padding: 4px 6px;
    min-width: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
  }
  .seed {
    margin-top: 20px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
  }
  .seed-text {
    min-width: 0;
    flex: 1 1 200px;
  }
  .seed-label {
    margin: 4px 0 4px;
  }
  .seed-label code {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 0.9rem;
    color: #fbf8f0;
    letter-spacing: 0.02em;
  }
  .seed-help {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.5;
    color: rgba(242, 239, 230, 0.55);
  }
  .seed-url {
    word-break: break-all;
    color: rgba(242, 239, 230, 0.85);
  }
  .seed-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .chip {
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid rgba(233, 196, 106, 0.6);
    background: rgba(233, 196, 106, 0.12);
    color: #fbf1d3;
    font-size: 0.72rem;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
  }
  .chip:hover {
    background: rgba(233, 196, 106, 0.22);
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 22px;
    flex-wrap: wrap;
  }
  .continue {
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid rgba(233, 196, 106, 0.6);
    background: rgba(233, 196, 106, 0.12);
    color: #fbf1d3;
    font-size: 0.8rem;
    font-weight: 500;
  }
  .continue:hover {
    background: rgba(233, 196, 106, 0.22);
  }
  .text-link {
    font-size: 0.72rem;
    color: rgba(242, 239, 230, 0.55);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .text-link:hover {
    color: rgba(242, 239, 230, 0.9);
  }
  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @media (max-width: 600px) {
    .overlay {
      align-items: flex-end;
      padding: 12px;
    }
    .panel {
      max-height: min(92vh, 92dvh);
      padding: 21px 18px 18px;
    }
    dl div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
</style>
