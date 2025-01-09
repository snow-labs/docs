<script>
    import { Carta } from 'carta-md';
    import { Drawer } from '@skeletonlabs/skeleton';
    import { getDrawerStore } from '@skeletonlabs/skeleton';

    /** @type {import('./$types').PageData} */
    export let data;
    const carta = new Carta({
        sanitize: false
    });

    const drawerStore = getDrawerStore();
    let html = '';
    let error = null;

    async function renderMarkdown() {
        try {
            if (data.props.markdown) {
                html = await carta.render(data.props.markdown);
            } else {
                throw new Error('No file found at this location');
            }
        } catch (err) {
            error = err;
        }
    }

    $: if (data.props.markdown) {
        renderMarkdown();
    }

    function openDrawer() {
        drawerStore.set({ open: true });
    }
</script>

<!-- Mobile Menu Button -->
<button class="btn-icon variant-ghost-surface md:hidden fixed top-[4.5rem] right-4 z-20" on:click={openDrawer}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
</button>

<!-- Drawer -->
<Drawer>
    <nav class="list-nav p-4">
        {#each data.props.files as file}
            {@const isActive = data.props.slug === file.path}
            <a
                href="/docs/{file.path}"
                class="block px-4 py-2 rounded-lg {isActive ? 'bg-primary-500 text-white' : 'hover:bg-surface-500/10'}"
            >
                {file.title}
            </a>
        {/each}
    </nav>
</Drawer>

<!-- Desktop Layout -->
<div class="flex">
    <!-- Sidebar (hidden on mobile) -->
    <div class="hidden md:block w-64 h-screen bg-surface-700/5 p-4 border-r border-surface-500/20 sticky top-0">
        <nav class="space-y-1">
            {#each data.props.files as file}
                {@const isActive = data.props.slug === file.path}
                <a
                    href="/docs/{file.path}"
                    class="block px-4 py-2 rounded-lg {isActive ? 'bg-primary-500 text-white' : 'hover:bg-surface-500/10'}"
                >
                    {file.title}
                </a>
            {/each}
        </nav>
    </div>

    <div class="flex-1 container mx-auto px-4 py-8 md:px-8">
        {#if error}
            <p class="text-error-500">Error: {error.message}</p>
        {:else if !html}
            <p class="text-surface-500">Loading...</p>
        {:else}
            <div class="prose prose-slate dark:prose-invert max-w-none">
                {@html html}
            </div>
        {/if}
    </div>
</div>