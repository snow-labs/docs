<script>
    import config from '$lib/config';
</script>
<div class="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16" style="background:url(https://images.unsplash.com/photo-1515268064940-5150b7c29f35);background-size:cover;background-position:center;">
    <div class="z-index-[1] z-[1] absolute w-full h-full bg-surface-900/80 backdrop-blur-sm overflow-hidden">
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
    </div>
    <div class="max-w-3xl text-center z-index-[10] z-[10]">
        <h1 class="h1 mb-4 font-bold">{config.title}</h1>
        <p class="text-xl mb-8">{config.description}</p>

        <div class="flex gap-4 justify-center mb-12">
            <a class="btn variant-filled-primary" href="/docs">
                Get Started
            </a>
            <a class="btn variant-soft" href={`${config.github}`} target="_blank" rel="noopener">
                GitHub
            </a>
            <a class="btn variant-filled-primary" href={`/contributors`}>
                Contributors
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
    .snowflake {
  --size: 1vw;
  opacity: 0.5;
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  filter: blur(8px) !important;
  position: absolute;
  top: -5vh;
}

@keyframes snowfall {
  0% {
    transform: translate3d(var(--left-ini), 0, 0);
  }
  100% {
    transform: translate3d(var(--left-end), 110vh, 0);
  }
}
.snowflake:nth-child(1) {
  --size: 0.2vw;
  --left-ini: -7vw;
  --left-end: -7vw;
  left: 13vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -6s;
}

.snowflake:nth-child(2) {
  --size: 0.8vw;
  --left-ini: 2vw;
  --left-end: 2vw;
  left: 70vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(3) {
  --size: 0.8vw;
  --left-ini: 5vw;
  --left-end: 8vw;
  left: 38vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -1s;
}

.snowflake:nth-child(4) {
  --size: 0.8vw;
  --left-ini: 10vw;
  --left-end: 1vw;
  left: 63vw;
  animation: snowfall 13s linear infinite;
  animation-delay: -1s;
}

.snowflake:nth-child(5) {
  --size: 1vw;
  --left-ini: -1vw;
  --left-end: -9vw;
  left: 7vw;
  animation: snowfall 8s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(6) {
  --size: 0.2vw;
  --left-ini: 2vw;
  --left-end: -9vw;
  left: 95vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(7) {
  --size: 0.8vw;
  --left-ini: -6vw;
  --left-end: 6vw;
  left: 21vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(8) {
  --size: 0.8vw;
  --left-ini: 0vw;
  --left-end: 2vw;
  left: 40vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -7s;
}

.snowflake:nth-child(9) {
  --size: 1vw;
  --left-ini: 6vw;
  --left-end: -6vw;
  left: 38vw;
  animation: snowfall 13s linear infinite;
  animation-delay: -9s;
}

.snowflake:nth-child(10) {
  --size: 1vw;
  --left-ini: 6vw;
  --left-end: 10vw;
  left: 38vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -3s;
}

.snowflake:nth-child(11) {
  --size: 0.2vw;
  --left-ini: -9vw;
  --left-end: -9vw;
  left: 5vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(12) {
  --size: 0.8vw;
  --left-ini: 10vw;
  --left-end: -1vw;
  left: 15vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(13) {
  --size: 0.2vw;
  --left-ini: 7vw;
  --left-end: 1vw;
  left: 48vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(14) {
  --size: 0.2vw;
  --left-ini: 10vw;
  --left-end: -5vw;
  left: 75vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(15) {
  --size: 0.6vw;
  --left-ini: -5vw;
  --left-end: -3vw;
  left: 37vw;
  animation: snowfall 8s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(16) {
  --size: 1vw;
  --left-ini: -6vw;
  --left-end: -6vw;
  left: 35vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -10s;
}

.snowflake:nth-child(17) {
  --size: 0.4vw;
  --left-ini: 7vw;
  --left-end: -1vw;
  left: 87vw;
  animation: snowfall 15s linear infinite;
  animation-delay: -10s;
}

.snowflake:nth-child(18) {
  --size: 0.4vw;
  --left-ini: 8vw;
  --left-end: 10vw;
  left: 89vw;
  animation: snowfall 13s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(19) {
  --size: 0.2vw;
  --left-ini: 4vw;
  --left-end: -3vw;
  left: 77vw;
  animation: snowfall 8s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(20) {
  --size: 0.8vw;
  --left-ini: 6vw;
  --left-end: 8vw;
  left: 61vw;
  animation: snowfall 12s linear infinite;
  animation-delay: -6s;
}

.snowflake:nth-child(21) {
  --size: 1vw;
  --left-ini: -1vw;
  --left-end: -1vw;
  left: 60vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(22) {
  --size: 0.2vw;
  --left-ini: 2vw;
  --left-end: -8vw;
  left: 17vw;
  animation: snowfall 8s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(23) {
  --size: 0.2vw;
  --left-ini: -6vw;
  --left-end: 3vw;
  left: 8vw;
  animation: snowfall 15s linear infinite;
  animation-delay: -2s;
}

.snowflake:nth-child(24) {
  --size: 0.6vw;
  --left-ini: -8vw;
  --left-end: -3vw;
  left: 47vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -9s;
}

.snowflake:nth-child(25) {
  --size: 0.6vw;
  --left-ini: 2vw;
  --left-end: -7vw;
  left: 68vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -3s;
}

.snowflake:nth-child(26) {
  --size: 0.2vw;
  --left-ini: -3vw;
  --left-end: -9vw;
  left: 81vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -2s;
}

.snowflake:nth-child(27) {
  --size: 0.2vw;
  --left-ini: 6vw;
  --left-end: 0vw;
  left: 63vw;
  animation: snowfall 12s linear infinite;
  animation-delay: -2s;
}

.snowflake:nth-child(28) {
  --size: 0.4vw;
  --left-ini: 9vw;
  --left-end: 9vw;
  left: 8vw;
  animation: snowfall 9s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(29) {
  --size: 0.6vw;
  --left-ini: -1vw;
  --left-end: 8vw;
  left: 62vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(30) {
  --size: 0.6vw;
  --left-ini: 2vw;
  --left-end: 6vw;
  left: 93vw;
  animation: snowfall 15s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(31) {
  --size: 1vw;
  --left-ini: -9vw;
  --left-end: 9vw;
  left: 70vw;
  animation: snowfall 9s linear infinite;
  animation-delay: -6s;
}

.snowflake:nth-child(32) {
  --size: 0.4vw;
  --left-ini: 6vw;
  --left-end: 1vw;
  left: 5vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -2s;
}

.snowflake:nth-child(33) {
  --size: 1vw;
  --left-ini: -7vw;
  --left-end: 3vw;
  left: 62vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -3s;
}

.snowflake:nth-child(34) {
  --size: 0.8vw;
  --left-ini: 9vw;
  --left-end: -5vw;
  left: 47vw;
  animation: snowfall 9s linear infinite;
  animation-delay: -1s;
}

.snowflake:nth-child(35) {
  --size: 1vw;
  --left-ini: -5vw;
  --left-end: 6vw;
  left: 9vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -7s;
}

.snowflake:nth-child(36) {
  --size: 1vw;
  --left-ini: 0vw;
  --left-end: 4vw;
  left: 53vw;
  animation: snowfall 6s linear infinite;
  animation-delay: -2s;
}

.snowflake:nth-child(37) {
  --size: 0.2vw;
  --left-ini: 10vw;
  --left-end: 1vw;
  left: 93vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -6s;
}

.snowflake:nth-child(38) {
  --size: 0.8vw;
  --left-ini: -5vw;
  --left-end: 0vw;
  left: 94vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -7s;
}

.snowflake:nth-child(39) {
  --size: 1vw;
  --left-ini: -8vw;
  --left-end: 0vw;
  left: 22vw;
  animation: snowfall 12s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(40) {
  --size: 0.4vw;
  --left-ini: 9vw;
  --left-end: 8vw;
  left: 61vw;
  animation: snowfall 9s linear infinite;
  animation-delay: -10s;
}

.snowflake:nth-child(41) {
  --size: 0.6vw;
  --left-ini: 7vw;
  --left-end: 2vw;
  left: 83vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -5s;
}

.snowflake:nth-child(42) {
  --size: 0.8vw;
  --left-ini: 3vw;
  --left-end: 5vw;
  left: 96vw;
  animation: snowfall 11s linear infinite;
  animation-delay: -9s;
}

.snowflake:nth-child(43) {
  --size: 1vw;
  --left-ini: -3vw;
  --left-end: 10vw;
  left: 67vw;
  animation: snowfall 9s linear infinite;
  animation-delay: -6s;
}

.snowflake:nth-child(44) {
  --size: 0.6vw;
  --left-ini: -7vw;
  --left-end: -4vw;
  left: 95vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -10s;
}

.snowflake:nth-child(45) {
  --size: 1vw;
  --left-ini: -5vw;
  --left-end: 2vw;
  left: 91vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(46) {
  --size: 1vw;
  --left-ini: 2vw;
  --left-end: 9vw;
  left: 29vw;
  animation: snowfall 10s linear infinite;
  animation-delay: -4s;
}

.snowflake:nth-child(47) {
  --size: 0.6vw;
  --left-ini: 10vw;
  --left-end: 7vw;
  left: 18vw;
  animation: snowfall 13s linear infinite;
  animation-delay: -1s;
}

.snowflake:nth-child(48) {
  --size: 1vw;
  --left-ini: -7vw;
  --left-end: 10vw;
  left: 30vw;
  animation: snowfall 14s linear infinite;
  animation-delay: -3s;
}

.snowflake:nth-child(49) {
  --size: 0.2vw;
  --left-ini: -6vw;
  --left-end: 9vw;
  left: 51vw;
  animation: snowfall 12s linear infinite;
  animation-delay: -8s;
}

.snowflake:nth-child(50) {
  --size: 0.2vw;
  --left-ini: -2vw;
  --left-end: 2vw;
  left: 43vw;
  animation: snowfall 7s linear infinite;
  animation-delay: -1s;
}

/* added small blur every 6 snowflakes*/
.snowflake:nth-child(6n) {
  filter: blur(1px);
}
</style>