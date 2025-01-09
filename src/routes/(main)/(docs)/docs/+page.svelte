<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        goto('/docs/index');
    });
</script>

<div class="flex justify-center items-center h-screen">
    <p class="text-surface-500">Redirecting to documentation...</p>
</div>
