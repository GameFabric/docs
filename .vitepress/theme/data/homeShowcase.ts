// Presentational data for HomeShowcase.vue, mirrors the "Products" card
// grid from the UI redesign mockup (Pages/Docs Site/Docs.html, .home-cards).
// Kept out of src/ and out of component logic so future copy tweaks don't
// require touching Vue code.

export interface ShowcaseCard {
    title: string
    description: string
    link: string
    linkText: string
    icon: 'quickstart' | 'multiplayer' | 'steelshield' | 'api'
}

export const cards: ShowcaseCard[] = [
    {
        title: 'Quickstart',
        description: 'Get your first game server running on GameFabric in minutes: create a Branch, push your image, and launch a Vessel.',
        link: '/multiplayer-servers/getting-started/quickstart',
        linkText: 'Get started',
        icon: 'quickstart',
    },
    {
        title: 'Multiplayer Servers',
        description: 'Manage your entire fleet. Create ArmadaSets, define Formations, and allocate Vessels for players across Bare metal, GameFabric Cloud, or BYOC.',
        link: '/multiplayer-servers/getting-started/introduction',
        linkText: 'Read the docs',
        icon: 'multiplayer',
    },
    {
        title: 'SteelShield™',
        description: 'DDoS protection for every game server, from always-on rate limiting to full cryptographic packet verification.',
        link: '/steelshield/gamefabric/introduction',
        linkText: 'Read the docs',
        icon: 'steelshield',
    },
    {
        title: 'API Reference',
        description: 'Live REST reference for ArmadaSets, Formations, Vessels, and the Allocator endpoint.',
        link: '/api/multiplayer-servers/apiserver',
        linkText: 'Explore the API',
        icon: 'api',
    },
]
