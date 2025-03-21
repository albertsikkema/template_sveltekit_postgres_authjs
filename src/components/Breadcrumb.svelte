<script>
	import { page } from '$app/state';
	import { firstToUpperCase } from '$lib/helpers/functions';

	// R derived state for breadcrumbs
	const breadcrumbs = $derived(page.url.pathname.split('/').filter(Boolean));
</script>

<div class="breadcrumbs text-sm">
	<ul>
		<li><a href="/">/</a></li>
		{#each breadcrumbs as breadcrumb, i (breadcrumb)}
			<li>
				<a href={`/${breadcrumbs.slice(0, i + 1).join('/')}`}>
					{firstToUpperCase(breadcrumb)}
				</a>
			</li>
		{/each}
	</ul>
</div>
