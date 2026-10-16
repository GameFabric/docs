<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ code: string }>()

const { isDark } = useData()
const svg = ref('')
const failed = ref(false)
const source = decodeURIComponent(props.code)
const id = `mermaid-${Math.random().toString(36).slice(2)}`

const render = async () => {
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, theme: isDark.value ? 'dark' : 'default' })
    const result = await mermaid.render(id, source)
    svg.value = result.svg
    failed.value = false
  } catch (err) {
    console.warn('Mermaid render failed:', err)
    failed.value = true
  }
}

onMounted(render)
watch(isDark, render)
</script>

<template>
  <pre v-if="failed"><code>{{ source }}</code></pre>
  <div v-else class="mermaid" v-html="svg"></div>
</template>
