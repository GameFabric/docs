<script setup lang="ts">
// Renders into VitePress's `home-hero-before` slot (see ../Layout.vue), replacing
// the stock VPHero entirely. src/index.md's frontmatter no longer has a `hero:`
// key, so VPHero's `v-if="frontmatter.hero"` is false and this is the only
// hero content rendered — avoids a duplicate/stacked hero.
import { useData, withBase } from 'vitepress'

const { isDark, theme } = useData()
</script>

<template>
  <div class="home-hero">
    <div class="home-text">
      <div class="home-title-row">
        <img :src="withBase(isDark ? theme.logo.dark : theme.logo.light)" alt="GameFabric" class="home-logo" />
      </div>
      <p class="home-tag">Two Models, One Fabric</p>
      <p class="home-sub">Game server orchestration and management. Everything you need to run multiplayer infrastructure at launch scale and beyond.</p>
      <div class="home-ctas">
        <a class="btn btn-y" :href="withBase('/multiplayer-servers/getting-started/introduction')">Get Started →</a>
        <a class="btn btn-o" :href="withBase('/steelshield/gamefabric/introduction')">SteelShield™ Docs</a>
      </div>
      <a href="https://gamefabric.com" target="_blank" class="home-ext">gamefabric.com ↗</a>
    </div>
    <div class="home-image">
      <img :src="withBase('/graphic_data_flow_game_orchestration.png')" alt="" />
    </div>
  </div>
</template>

<style scoped>
.home-hero {
    max-width: 1152px;
    margin: 0 auto;
    padding: 64px 24px 56px;
    display: flex;
    align-items: center;
    gap: 56px;
    border-bottom: 1px solid var(--vp-c-divider);
}
.home-text {
    flex: 1;
    min-width: 0;
}
.home-title-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
}
.home-logo {
    height: 32px;
    width: auto;
}
.home-tag {
    font-size: 16px;
    color: var(--vp-c-text-2);
    margin: 0 0 8px;
}
.home-sub {
    font-size: 15px;
    color: var(--vp-c-text-2);
    line-height: 1.6;
    max-width: 420px;
    margin: 0 0 32px;
}
.home-ctas {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}
.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 120ms ease-out;
    text-decoration: none !important;
}
.btn-y {
    background: var(--vp-c-brand-solid);
    color: #101010;
}
.btn-y:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
}
.btn-o {
    background: transparent;
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-border);
}
.btn-o:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
}
.home-ext {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--vp-c-text-3);
    transition: color 120ms;
    text-decoration: none !important;
}
.home-ext:hover {
    color: var(--vp-c-brand-1);
}
.home-image {
    flex-shrink: 0;
    width: 280px;
    margin-right: 64px;
}
.home-image img {
    width: 100%;
    border-radius: 10px;
    display: block;
}
@media (max-width: 768px) {
    .home-hero {
        flex-direction: column;
        text-align: left;
    }
    .home-image {
        width: 200px;
        align-self: center;
    }
}
</style>
