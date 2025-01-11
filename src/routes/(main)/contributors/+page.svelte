<script lang='ts'>
    import axios from "axios";
    import { onMount } from "svelte";

    let contributors: any[] = [];

    onMount(async () => {
        await axios.get(`https://api.github.com/repos/snow-labs/make-docs/contributors`).then((res) => {
            contributors = res.data;
        })
    })
</script>

<div class="container mx-auto px-4 py-16">
    <h1 class="h1 text-center mb-8">Contributors</h1>
    <p class="text-center mb-12">Thank you to all our amazing contributors!</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each contributors as contributor}
            <a 
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                class="card p-4 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
            >
                <img 
                    src={contributor.avatar_url} 
                    alt={`${contributor.login}'s avatar`}
                    class="w-24 h-24 rounded-full mb-4 border-2 border-primary-500"
                />
                <h3 class="font-semibold text-lg mb-2">{contributor.login}</h3>
                <p class="text-sm opacity-75">
                    {contributor.contributions} contribution{contributor.contributions === 1 ? '' : 's'}
                </p>
            </a>
        {/each}
    </div>
</div>

<style lang="postcss">
    .card {
        background-color: rgba(var(--theme-surface-100), 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(var(--theme-surface-300), 0.2);
    }

    :global(.dark) .card {
        background-color: rgba(var(--theme-surface-800), 0.8);
    }
</style>