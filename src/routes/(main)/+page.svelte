<script>
    import config from '$lib/config';
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
    <div class="max-w-3xl text-center">
        <h1 class="h1 mb-4 font-bold">{config.title}</h1>
        <p class="text-xl mb-8">{config.description}</p>

        <div class="flex gap-4 justify-center mb-12">
            <a class="btn variant-filled-primary" href="/docs">
                Get Started
            </a>
            <a class="btn variant-soft" href={`${config.github}`} target="_blank" rel="noopener">
                GitHub
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div class="card p-4">
                <h3 class="h4 mb-2">📝 Simple</h3>
                <p>Write documentation in Markdown with zero configuration needed.</p>
            </div>
            <div class="card p-4">
                <h3 class="h4 mb-2">⚡ Fast</h3>
                <p>Built on SvelteKit for blazing-fast performance.</p>
            </div>
            <div class="card p-4">
                <h3 class="h4 mb-2">🎨 Customizable</h3>
                <p>Easy theming and configuration to match your brand.</p>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .card {
        @apply transition-all duration-200 hover:scale-105;
        background-color: rgba(var(--theme-surface-100), 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(var(--theme-surface-300), 0.2);
    }

    :global(.dark) .card {
        background-color: rgba(var(--theme-surface-800), 0.8);
    }
</style>