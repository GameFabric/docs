import {defineConfig} from 'vite'

export default defineConfig({
    srcDir: "src",
    build: {
        sourcemap: false,
        minify: true,
    },
});
