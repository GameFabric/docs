<script setup lang="ts">
// Renders into VitePress's built-in `home-features-after` slot (see ../Layout.vue).
// This slot renders unconditionally regardless of whether the home page's
// `features:` frontmatter is populated, so src/index.md needs no changes.
import { withBase } from 'vitepress'
import { cards } from '../data/homeShowcase'
</script>

<template>
  <div class="showcase-wrap">
    <p class="showcase-label">Products</p>
    <div class="showcase-grid">
      <a
        v-for="card in cards"
        :key="card.title"
        class="showcase-card"
        :href="withBase(card.link)"
      >
        <div class="card-top">
          <div class="card-icon">
            <svg v-if="card.icon === 'quickstart'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>
            <svg v-else-if="card.icon === 'multiplayer'" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="7" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="2" y="14" width="20" height="7" rx="1.5" stroke="currentColor" stroke-width="1.6"/><circle cx="5.5" cy="6.5" r="1" fill="currentColor"/><circle cx="5.5" cy="17.5" r="1" fill="currentColor"/></svg>
            <svg v-else-if="card.icon === 'steelshield'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5v5.5c0 4.8 3.4 9.3 8 10.5 4.6-1.2 8-5.7 8-10.5V5.5L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="card.icon === 'api'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 3v6h8M9 17h6M9 13h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </div>
          <span class="card-title">{{ card.title }}</span>
        </div>
        <p class="card-desc">{{ card.description }}</p>
        <span class="card-link">{{ card.linkText }} →</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.showcase-wrap {
    max-width: 1152px;
    margin: 0 auto;
    padding: 0 24px 64px;
}
.showcase-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--vp-c-text-3);
    margin-bottom: 14px;
}
.showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
}
.showcase-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    transition: all 120ms ease-out;
    text-decoration: none !important;
}
.showcase-card:hover {
    border-color: var(--vp-c-border);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, .1);
}
.card-top {
    display: flex;
    align-items: center;
    gap: 10px;
}
.card-icon {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    background: var(--vp-c-brand-solid);
    color: #101010;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.card-title {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    letter-spacing: -.01em;
}
.card-desc {
    font-size: 13px;
    color: var(--vp-c-text-2);
    line-height: 1.55;
    flex: 1;
    margin: 0;
}
.card-link {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: var(--vp-c-brand-1);
}
</style>
