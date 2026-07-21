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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" v-html="card.icon"></svg>
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
    padding: 48px 24px 64px;
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
