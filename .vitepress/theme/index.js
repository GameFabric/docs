import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import Layout from './Layout.vue'
import Mermaid from './components/Mermaid.vue'

import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('Mermaid', Mermaid);
    },
    setup() {
        const route = useRoute();
        const initZoom = () => {
            new mediumZoom('.main img', { background: 'var(--vp-c-bg)'});
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );
    },
};

