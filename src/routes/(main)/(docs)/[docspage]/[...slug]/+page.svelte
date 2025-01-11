<script lang="ts">
    import { Carta } from 'carta-md';
    import { Drawer } from '@skeletonlabs/skeleton';
    import { getDrawerStore } from '@skeletonlabs/skeleton';

    /** @type {import('./$types').PageData} */
    export let data;
    export let folder = undefined;
    let instance = data.props.docspage;
    const carta = new Carta({
        sanitize: false
    });

    const drawerStore = getDrawerStore();
    let html = '';
    let error: Error | null = null;

    interface FolderState {
        [key: string]: boolean;
    }
    let folderStates: FolderState = {};

    function toggleFolder(folderName: string) {
        folderStates[folderName] = !folderStates[folderName];
        folderStates = folderStates;
    }
    try {
        for (const part of data.props.slug.split('/').slice(0, -1)) {
            folderStates[part] = true;
        }

    } catch {}
    async function renderMarkdown() {
        try {
            if (data.props.markdown) {
                html = await carta.render(data.props.markdown);
            } else {
                throw new Error('No file found at this location');
            }
        } catch (err) {
            error = err instanceof Error ? err : new Error('Unknown error');
        }
    } 

    $: if (data.props.markdown) {
        renderMarkdown();
    }

    function openDrawer() {
        drawerStore.set({ open: true });
    }
</script>
<style>
    .chevron {
      transition: transform 0.1s ease-in-out; /* Smooth animation */
    }
</style>
<button class="btn-icon variant-ghost-surface md:hidden fixed top-[4.5rem] right-4 z-20" on:click={openDrawer}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
</button>
<svelte:head>
    {#if data.props && data.props.frontmatter && data.props.frontmatter.title}
        <meta property="og:title" content={data.props.frontmatter.title} />
    {/if}
    {#if data.props && data.props.frontmatter && data.props.frontmatter.description}
        <meta property="og:description" content={data.props.frontmatter.description} />
    {/if}
    <meta property="og:type" content="website">
</svelte:head>

{#if data.props && data.props.files && data.props.docspage}
{#if folder}
    <div>
        <button
            class="flex items-center p-2 w-full hover:bg-surface-500/10 rounded-lg"
            on:click={() => toggleFolder(folder.name)}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="chevron mr-2"
            style="transform: rotate({folderStates[folder.name] ? 0 : -90}deg);"
        >
            <path d="M6 9l6 6 6-6"></path>
        </svg>
        
            <span>{folder.title || folder.name}</span>
        </button>
        
        {#if folderStates[folder.name]}
            <div class="ml-4 space-y-1">
                {#each folder.files || [] as file}
                    <a
                        href="/{data.props.docspage}/{file.path}"
                        class="block px-4 py-2 rounded-lg {data.props.slug === file.path ? 'bg-primary-500 text-white' : 'hover:bg-surface-500/10'}"
                    >
                        {file.title}
                    </a>
                {/each}
                {#each Object.values(folder.folders || {}) as subfolder}
                    <svelte:self {data} folder={subfolder} />
                {/each}
            </div>
        {/if}
    </div>
{:else}
    <Drawer>
        <nav class="list-nav p-4">
            <div class="p-4">
                {#if data.props.files.instances.length > 1}
                    <select name="" id="" bind:value={instance} class="select" on:change={()=>{
                        location.pathname = `/${instance}/index`;
                        // location.reload();
                    }}>
                            {#each data.props.files.instances.slice().reverse() as instance}
                                <option value={instance.path}>{instance.name}</option>
                            {/each}
                    </select>
                {/if}
                <div class="h-4"></div>
                <div class="sidebar-content">
                    {#if data.props.files}
                        <div class="space-y-2">
                            {#each data.props.files.rootFiles || [] as file}
                                <a
                                    href="/{data.props.docspage}/{file.path}"
                                    class="block px-4 py-2 rounded-lg {data.props.slug === file.path ? 'bg-primary-500 text-white' : 'hover:bg-surface-500/10'}"
                                >
                                    {file.title}
                                </a>
                            {/each}

                            {#each data.props.files.folders || [] as folder}
                                <svelte:self {data} folder={folder} />
                                <div class="h-4"></div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </nav>
    </Drawer>

    <div class="flex">
        <div class="hidden md:block w-64 h-screen bg-surface-700/5 p-4 border-r border-surface-500/20 sticky top-0">
            <div class="p-4">
                {#if data.props.files.instances.length > 1}
                    <select name="" id="" bind:value={instance} class="select" on:change={()=>{
                        location.pathname = `/${instance}/index`;
                        // location.reload();
                    }}>
                            {#each data.props.files.instances.slice().reverse() as instance}
                                <option value={instance.path}>{instance.name}</option>
                            {/each}
                    </select>
                {/if}
                <div class="h-4"></div>
                <div class="sidebar-content">
                    {#if data.props.files}
                        <div class="space-y-2">
                            {#each data.props.files.rootFiles || [] as file}
                                <a
                                    href="/{data.props.docspage}/{file.path}"
                                    class="block px-4 py-2 rounded-lg {data.props.slug === file.path ? 'bg-primary-500 text-white' : 'hover:bg-surface-500/10'}"
                                >
                                    {file.title}
                                </a>
                            {/each}

                            {#each data.props.files.folders || [] as folder}
                                <svelte:self {data} folder={folder} />
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="flex-1 container mx-auto px-4 py-8 md:px-8">
            {#if data.props.frontmatter.banner}
                <img src={data.props.frontmatter.banner} class="w-full h-56 object-cover rounded-2xl shadow-lg" alt="">
                <div class="h-4"></div>
            {/if}
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
{/if}
{/if}
