<script>
    import config from '$lib/config';
</script>

<div class="bg-cover justify-center items-center flex-col flex min-h-screen w-full">
    <h1 class='h1'>{config.title}</h1>
    <div class="h-4"></div>
    <p>{config.description}</p>
    <div class="h-4"></div>
    <a class='btn variant-filled-primary' href='/docs'>Docs</a>
</div>