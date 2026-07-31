// Validates internal links, heading anchors and image paths across src/**/*.md
// and every sidebar.json. Run with `yarn lint:links`.
//
// Checks performed:
//   - sidebar.json links resolve to a page (accounting for the link rewriting
//     in .vitepress/config.js, which prefixes non-external links with the
//     section directory)
//   - sidebar.json files have a unique numeric `order` within their section
//   - markdown links starting with `/` resolve to a page or a public asset
//   - relative markdown links resolve to a file
//   - `#anchor` fragments match a heading on the target page
//   - image sources resolve to a file
//
// Pages that no sidebar and no page links to are reported as warnings, as are
// symlinked pages, which publish the same content at two URLs.
//
// External links (http, mailto) are not checked.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const publicDir = path.join(srcDir, 'public');

const errors = [];
const warnings = [];

function fail(file, message) {
    errors.push(`${path.relative(root, file)} ${message}`);
}

function walk(dir, filter) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isSymbolicLink()) {
            warnings.push(`${path.relative(root, full)} is a symlink; it publishes duplicate content at a second URL`);
            continue;
        }
        if (entry.isDirectory()) {
            out.push(...walk(full, filter));
        } else if (filter(entry.name)) {
            out.push(full);
        }
    }
    return out;
}

const pages = walk(srcDir, (name) => name.endsWith('.md'))
    .filter((file) => !file.startsWith(publicDir));

// Route ("/multiplayer-servers/get-started/index") -> absolute file path.
const routes = new Map();
for (const file of pages) {
    routes.set('/' + path.relative(srcDir, file).replace(/\.md$/, ''), file);
}

// GitHub-style slugs, matching VitePress's anchor generation closely enough for
// the anchors used in this repo. NFKD normalization is what turns "SteelShield™"
// into "steelshieldtm".
function slug(heading) {
    return heading
        .replace(/`/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const anchorsByRoute = new Map();
function anchorsFor(route) {
    if (anchorsByRoute.has(route)) return anchorsByRoute.get(route);
    const file = routes.get(route);
    const anchors = new Set();
    if (file) {
        let inFence = false;
        for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
            if (/^\s*```/.test(line)) {
                inFence = !inFence;
                continue;
            }
            if (inFence) continue;
            const heading = /^#{1,6}\s+(.*?)\s*$/.exec(line);
            if (heading) anchors.add(slug(heading[1]));
            const explicit = /\{#([\w-]+)\}/.exec(line);
            if (explicit) anchors.add(explicit[1]);
        }
    }
    anchorsByRoute.set(route, anchors);
    return anchors;
}

function resolveTarget(file, target) {
    const [rawPath, fragment] = target.split('#');

    if (rawPath === '') {
        return { route: '/' + path.relative(srcDir, file).replace(/\.md$/, ''), fragment };
    }

    if (rawPath.startsWith('/')) {
        const route = rawPath.replace(/\/$/, '').replace(/\.md$/, '');
        if (routes.has(route)) return { route, fragment };
        if (fs.existsSync(path.join(publicDir, rawPath))) return null;
        fail(file, `link target does not exist: ${target}`);
        return null;
    }

    const resolved = path.resolve(path.dirname(file), rawPath);
    if (fs.existsSync(resolved)) return null;
    const route = '/' + path.relative(srcDir, resolved.replace(/\.md$/, ''));
    if (routes.has(route)) return { route, fragment };
    fail(file, `link target does not exist: ${target}`);
    return null;
}

const linkedRoutes = new Set();

for (const file of pages) {
    const content = fs.readFileSync(file, 'utf8');

    for (const match of content.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
        const src = match[1];
        if (/^(https?:|data:|mailto:)/.test(src)) continue;
        const candidates = src.startsWith('/')
            ? [path.join(publicDir, src), path.join(srcDir, src)]
            : [path.resolve(path.dirname(file), src)];
        if (!candidates.some((candidate) => fs.existsSync(candidate))) {
            fail(file, `image does not exist: ${src}`);
        }
    }

    // Strip fenced code blocks so sample URLs are not treated as links.
    const prose = content.replace(/```[\s\S]*?```/g, '');
    for (const match of prose.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const target = match[1];
        if (/^(https?:|mailto:|tel:)/.test(target)) continue;
        const resolved = resolveTarget(file, target);
        if (!resolved) continue;
        linkedRoutes.add(resolved.route);
        if (resolved.fragment) {
            const anchors = anchorsFor(resolved.route);
            if (anchors.size && !anchors.has(resolved.fragment)) {
                fail(file, `anchor not found on ${resolved.route}: #${resolved.fragment}`);
            }
        }
    }
}

// Sidebar links, applying the same rewriting as .vitepress/config.js.
const sidebarRoutes = new Set();
const sidebarFiles = walk(srcDir, (name) => name === 'sidebar.json');

for (const sidebarFile of sidebarFiles) {
    let sidebar;
    try {
        sidebar = JSON.parse(fs.readFileSync(sidebarFile, 'utf8'));
    } catch (err) {
        fail(sidebarFile, `invalid JSON: ${err.message}`);
        continue;
    }

    const section = path.relative(srcDir, sidebarFile).split(path.sep)[0];

    const visit = (entry) => {
        for (const item of entry.items ?? []) {
            if (item.link) {
                const route = item.external ? item.link : `/${section}${item.link}`;
                sidebarRoutes.add(route);
                if (!routes.has(route)) {
                    fail(sidebarFile, `sidebar link does not exist: ${item.link} (resolves to ${route})`);
                }
            }
            visit(item);
        }
    };
    visit(sidebar);

    if (typeof sidebar.order !== 'number') {
        fail(sidebarFile, 'missing numeric "order"');
    }
}

// Duplicate order values within a section produce an arbitrary sidebar order.
const ordersBySection = new Map();
for (const sidebarFile of sidebarFiles) {
    let sidebar;
    try {
        sidebar = JSON.parse(fs.readFileSync(sidebarFile, 'utf8'));
    } catch {
        continue;
    }
    const section = path.relative(srcDir, sidebarFile).split(path.sep)[0];
    if (!ordersBySection.has(section)) ordersBySection.set(section, new Map());
    const seen = ordersBySection.get(section);
    if (seen.has(sidebar.order)) {
        fail(sidebarFile, `duplicate order ${sidebar.order}, also used by ${path.relative(root, seen.get(sidebar.order))}`);
    }
    seen.set(sidebar.order, sidebarFile);
}

for (const [route, file] of routes) {
    if (route === '/index') continue;
    if (!sidebarRoutes.has(route) && !linkedRoutes.has(route)) {
        warnings.push(`${path.relative(root, file)} is not in any sidebar and is not linked from any page`);
    }
}

for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
}

if (errors.length) {
    for (const error of errors) {
        console.error(`error: ${error}`);
    }
    console.error(`\n${errors.length} link error(s) found across ${pages.length} pages.`);
    process.exit(1);
}

console.log(`Checked ${pages.length} pages: no link errors.${warnings.length ? ` ${warnings.length} warning(s).` : ''}`);
