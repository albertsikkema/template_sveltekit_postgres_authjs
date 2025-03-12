<script>
	import { HomeOutline } from 'flowbite-svelte-icons';
	import {page} from '$app/stores';
	import {navigation} from '$lib/navigationMenu';

	let {data}   = $props()


	function classs(...classes) {
		return classes.filter(Boolean).join(' ');
	}

	function isActive(url) {
	    return $page.url.pathname === url;
	}

	// show only the menu items that the user has permission for
	function isAuthorized(permission) {
        
        return true
    }

</script>

<div

class={`fixed top-0 left-0 h-full bg-gray-200 bg-base-300 text-base-content w-48 transition-transform duration-300 md:translate-x-0 -translate-x-full`}
>
<div class="flex items-center justify-around h-16 border-b border-gray-300 gap-2">
<HomeOutline class='size-6 shrink-0'/><h3 class="">Beheer</h3>
</div>
<nav aria-label="Sidebar" class="flex flex-1 flex-col">
	<ul role="list" class="-mx-2 space-y-1 px-4">
		{#each navigation as nav}
		{#if isAuthorized(nav.permission)}
			
			<li key={nav.name}>
				<a
					href={nav.href}
					class={classs(
						isActive(nav.href) ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
						'group flex gap-x-3 rounded-md p-2 text-sm/6 ',
					)}
				>
					<nav.icon
						aria-hidden="true"
						class={classs(
							isActive(nav.href) ? 'text-primary' : 'text-gray-400 group-hover:text-indigo-600',
							'size-6 shrink-0',
						)}
					/>
					{nav.name}
					{#if nav.count}
						<span
							aria-hidden="true"
							class="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs/5 font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
						>
							{nav.count}
						</span>
					{/if}
					</a>
			</li>
			{/if}
		{/each}
	</ul>
</nav>
</div>

<div class="dock bottom-0 z-99 md:hidden bg-gray-200 w-full h-16 ">

		{#each navigation as nav}
		{#if isAuthorized(nav.permission)}
		<a href={nav.href}>
			<nav.icon
						aria-hidden="true"
						class={classs(
							isActive(nav.href) ? 'text-primary' : 'text-gray-400 group-hover:text-indigo-600',
							'size-6 shrink-0',
						)}
					/>
			<span class="dock-label">		{nav.name}</span>
						</a>
			
		
			{/if}
		{/each}

  </div>