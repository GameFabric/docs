import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import Layout from './Layout.vue'

import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
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

