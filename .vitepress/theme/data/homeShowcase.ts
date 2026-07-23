// Presentational data for HomeShowcase.vue, mirrors the "Products" card
// grid from the UI redesign mockup (Pages/Docs Site/Docs.html, .home-cards).
// Kept out of src/ and out of component logic so future copy tweaks don't
// require touching Vue code.

export interface ShowcaseCard {
    title: string
    description: string
    link: string
    linkText: string
    // Inner markup (paths/shapes only) for a 24x24 viewBox icon, rendered via
    // v-html inside a shared <svg> wrapper in HomeShowcase.vue — keeps the
    // icon self-contained here alongside the rest of the card's data.
    icon: string
}

export const cards: ShowcaseCard[] = [
    {
        title: 'Quickstart',
        description: 'Get your first game server running on GameFabric in minutes: create a Branch, push your image, and launch a Vessel.',
        link: '/multiplayer-servers/getting-started/quickstart',
        linkText: 'Get started',
        icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
    },
    {
        title: 'Multiplayer Servers',
        description: 'Manage your entire fleet. Create ArmadaSets, define Formations, and allocate Vessels for players across Bare metal, GameFabric Cloud, or BYOC (Bring Your Own Cloud).',
        link: '/multiplayer-servers/getting-started/introduction',
        linkText: 'Read the docs',
        icon: '<rect x="2" y="3" width="20" height="7" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="2" y="14" width="20" height="7" rx="1.5" stroke="currentColor" stroke-width="1.6"/><circle cx="5.5" cy="6.5" r="1" fill="currentColor"/><circle cx="5.5" cy="17.5" r="1" fill="currentColor"/>',
    },
    {
        title: 'SteelShield™',
        description: 'DDoS protection for every game server, from always-on rate limiting to full cryptographic packet verification.',
        link: '/steelshield/gamefabric/introduction',
        linkText: 'Read the docs',
        icon: '<path d="M12 2L4 5.5v5.5c0 4.8 3.4 9.3 8 10.5 4.6-1.2 8-5.7 8-10.5V5.5L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    },
    {
        title: 'API Reference',
        description: 'Live REST reference for ArmadaSets, Formations, Vessels, and the Allocator endpoint.',
        link: '/api/multiplayer-servers/apiserver',
        linkText: 'Explore the API',
        icon: '<path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 3v6h8M9 17h6M9 13h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    },
]
