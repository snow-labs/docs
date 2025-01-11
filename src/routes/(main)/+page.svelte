<script>
    import config from '$lib/config';
</script>

<div class="bg-cover justify-center items-center flex-col flex min-h-screen w-full">
    <div class="max-w-3xl">
        <h1 class='h1'>{config.title}</h1>
        <div class="h-4"></div>
        <p class="text-xl mb-8">{config.description}</p>
        <div class="h-4"></div>

        <div class="flex gap-4 justify-center mb-12">
            <a class='btn variant-filled-primary' href='/docs'>Docs</a>
            {#each config.useHeaderLinksOnFrontpage ? config.links : config.frontpageLinks as link}
                <a href="{link.path}" class="btn variant-glass-surface">{link.title}</a>
            {/each}
        </div>
    
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" data-svelte-h="svelte-1728d5p">
            {#each config.frontpageCards as card}
                <div class="card p-4">
                    <h3 class="h-4 mb-2">{card.title}</h3>
                    <p>{card.text}</p>
                </div>
            {/each}
        </div>
    
    </div>
</div>