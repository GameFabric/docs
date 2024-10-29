import { defineConfig } from "vitepress";
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
    srcDir: 'src',
    lang: 'en-US',
    description: "GameFabric Documentation | gamefabric.com",
    sidebar: "auto",
    appearance: 'dark',
    title: 'GameFabric Documentation',
    cleanUrls: true,
    metaChunk: true,
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}],
        ['meta', {name: "robots", content: "noindex"}],
        ['meta', {name: 'theme-color', content: '#ffd744'}],
        ['meta', {property: 'og:type', content: 'website'}],
        ['meta', {property: 'og:locale', content: 'en'}],
        ['meta', {property: 'og:title', content: 'GameFabric Documentation | One Stop Shop for Multiplayer Services'}],
        ['meta', {property: 'og:site_name', content: 'GameFabric Documentation'}],
        ['meta', {property: 'og:image', content: 'https://docs.gamefabric.com/og-preview.png'}],
        ['meta', {property: 'og:url', content: 'https://docs.gamefabric.com/'}],
    ],
    themeConfig: {
        socialLinks: [
            { icon: 'github', link: 'https://github.com/GameFabric' },
        ],
        editLink: {
            pattern: 'https://github.com/GameFabric/docs/edit/main/src/:path',
            text: 'Edit this page on GitHub'
        },
        sidebarDepth: 3,
        smoothScroll: true,
        lastUpdated: false,
        siteTitle: false,
        logo: {
            dark: '/logo-light.svg',
            light: '/logo-dark.svg',
            alt: 'GameFabric Logo'
        },
        footer: {
            copyright: 'Copyright © 2024 marbis GmbH. All rights reserved.'
        },
        nav: [
            {
                text: 'Documentation',
                items: [
                    {text: 'Multiplayer Servers', link: '/multiplayer-servers/getting-started/introduction'},
                    {text: 'SteelShield', link: '/steelshield/unreal-engine-plugin/introduction'},
                ]
            }, {
                text: 'API Reference',
                "items": [
                    {
                        "text": "Multiplayer Servers: API Server",
                        "link": "/api/multiplayer-servers/apiserver"
                    },
                    {
                        "text": "Multiplayer Servers: Web API",
                        "link": "/api/multiplayer-servers/webapi"
                    },
                    {
                        "text": "Allocation: Registry",
                        "link": "/api/multiplayer-servers/allocation-registry"
                    },
                    {
                        "text": "Allocation: Allocator",
                        "link": "/api/multiplayer-servers/allocation-allocator"
                    }
                ]

            },
            {
                text: 'Legal Information',
                link: 'https://server.nitrado.net/en-GB/legal/legal-information'
            },
        ],
        sidebar: getSidebar()
    },
});

function getSidebar() {
    const sidebar = {}

    // get all doc dirs
    const srcDir = path.join(__dirname, '..' , 'src');
    const dirs = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort();


    dirs
        .filter((dir) => (!['.vitepress', 'public'].includes(dir))) // ignore irrelevant dirs
        .forEach((dir) => {
        const srcSubDir = path.join(__dirname, '..' , 'src/'+dir);
        const subDirs = fs.readdirSync(srcSubDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();

       sidebar[`/${dir}/`] = getEntries(`${srcDir}/${dir}`, subDirs);
   })

return sidebar;
}

function getEntries(srcPath, dirs) {
    const entries = [];
    for (const dir of dirs) {
        console.log(`analyzing directory ${dir}`)

        const p = path.join(srcPath, dir, 'sidebar.json');
        let sidebarRAW;
        try {
            sidebarRAW = fs.readFileSync(p);
        } catch {
            console.warn("cannot read sidebar.json from directory " + dir);
            continue;
        }
        const sidebar = JSON.parse(sidebarRAW);

        entries.push(rewriteLinksRecursive('multiplayer-servers', sidebar));
    }

    if (hasDuplicatePosition(entries)) {
        console.error("Duplicate priorities have been found.. this might lead to an unwanted sidebar order!")
    }
    entries.sort((a, b) => a.order - b.order);

    return entries;
}
function hasDuplicatePosition(entries) {
    const seenValues = new Set();
    for (const entry of entries) {
        if (seenValues.has(entry.order)) {
            return true;
        }
        seenValues.add(entry.order);
    }
    return false;
}

function rewriteLinksRecursive(rewrittenDir, entry) {
    for (const i in entry.items) {
        if (entry.items[i].link) {
            if (entry.items[i].external) { continue  }
            entry.items[i].link = "/" + rewrittenDir + entry.items[i].link;
        }

        entry.items[i] = rewriteLinksRecursive(rewrittenDir, entry.items[i]);
    }
    return entry
}
