<script lang="ts">
  import { controlState } from './control';
</script>

{#if $controlState}
  <div class="control-badge" aria-live="polite">
    <strong>{$controlState.name}</strong>
    <span>{$controlState.form === 'robot' ? '人形' : '载具'}</span>
  </div>
{/if}

<style>
  .control-badge {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 8px 14px;
    border-radius: 12px;
    background: rgba(10, 24, 34, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e8eef0;
    font-size: 13px;
    pointer-events: none;
  }
  .control-badge span {
    color: #7fe3ff;
  }
</style>
