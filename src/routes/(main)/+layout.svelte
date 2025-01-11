<script lang="ts">
	import '../../app.postcss';
	import { AppShell, AppBar, initializeStores } from '@skeletonlabs/skeleton';
	import config from '$lib/config';

	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	import { Drawer } from '@skeletonlabs/skeleton';
</script>

<Drawer />
<AppShell>
	<svelte:fragment slot="header">

		<AppBar>
			<svelte:fragment slot="lead">
				<a href='/'><img src={config.logo} alt='{config.title} Logo' /></a>
			</svelte:fragment>
			<a href='/'><strong class="text-xl">{config.title}</strong></a>
			<div class="h-1"></div>
			<svelte:fragment slot="trail">
				{#each config.links as link}
					<a
						class="btn btn-sm variant-ghost-surface"
						href='{link.path}'
						target="_blank"
						rel="noreferrer"
					>
						{link.title}
					</a>
				{/each}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
