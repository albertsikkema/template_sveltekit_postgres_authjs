<script>
	import { ArrowRightOnRectangleIcon } from 'heroicons-svelte/24/outline';
	import { page } from '$app/stores';
	import { navigation } from '$lib/navigationMenu';
	import { signOut } from '@auth/sveltekit/client';

	let initials = '';
	let userId = '';

	// if user has a name, get the initials
	if ($page.data.user?.name) {
		userId = $page.data.user.name;
		initials = $page.data.user.name
			.split(' ')
			.map((n) => n[0])
			.join('');
	} else {
		userId = $page.data.user.email;
		// if user has no name, get the initials from the email
		initials = $page.data.user.email
			.split('@')[0]
			.split('.')
			.map((n) => n[0])
			.join('');
	}

	function classs(...classes) {
		return classes.filter(Boolean).join(' ');
	}

	function isActive(url) {
		return $page.url.pathname === url;
	}

	// show only the menu items that the user has permission for
	// ignore eslint warning
	// eslint-disable-next-line no-unused-vars
	function isAuthorized(permission) {
		return true;
	}
</script>

<div
	class="text-base-content fixed top-0 left-0 z-10 flex h-full w-48 -translate-x-full flex-col justify-between bg-gray-200 transition-transform duration-300 md:translate-x-0 dark:bg-gray-900"
>
	<span>
		<div class="flex h-16 items-center justify-around gap-2 border-b border-gray-300">
			<h3 class="">Applicatie</h3>
		</div>
		<nav aria-label="Sidebar" class="flex flex-1 flex-col">
			<ul role="list" class="-mx-2 space-y-1 px-4">
				{#each navigation as nav (nav.name)}
					{#if isAuthorized(nav.permission)}
						<li key={nav.name}>
							<a
								href={nav.href}
								class={classs(
									isActive(nav.href)
										? 'text-primary bg-gray-50 dark:bg-gray-900'
										: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-200',
									'group flex gap-x-3 rounded-md p-2 text-sm/6 '
								)}
							>
								<nav.icon
									aria-hidden="true"
									class={classs(
										isActive(nav.href)
											? 'text-primary'
											: 'text-gray-400 group-hover:text-indigo-600',
										'size-6 shrink-0'
									)}
								/>
								{nav.name}
								{#if nav.count === 'opentickets' && $page.data.opentickets > 0}
									<span
										aria-hidden="true"
										class="ml-auto w-9 min-w-max rounded-full bg-white px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-gray-600 ring-1 ring-gray-200 ring-inset"
									>
										{$page.data.opentickets}
									</span>
								{/if}
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</nav>
	</span>
	<span>
		<div class="flex flex-row items-center justify-between gap-2 p-2">
			<div class="avatar avatar-placeholder">
				<div class="avatar avatar-placeholder">
					<div class="bg-neutral text-neutral-content w-8 rounded-full">
						<span class="text-xs">{initials}</span>
					</div>
				</div>
			</div>
			<span class="truncate text-sm font-bold">{userId}</span>
		</div>
		<button class="btn btn-secondary w-full" onclick={signOut}>
			<ArrowRightOnRectangleIcon class="h-6 w-6" />
			Sign Out
		</button>
	</span>
</div>

<div class="dock bottom-0 z-99 h-16 w-full bg-gray-200 md:hidden dark:bg-gray-900">
	{#each navigation as nav (nav.name)}
		{#if isAuthorized(nav.permission)}
			<a href={nav.href}>
				<nav.icon
					aria-hidden="true"
					class={classs(
						isActive(nav.href) ? 'text-primary' : 'text-gray-400 group-hover:text-indigo-600',
						'size-6 shrink-0'
					)}
				/>
				<span
					class={classs(
						isActive(nav.href)
							? 'text-primary'
							: 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-200',
						'dock-label'
					)}
				>
					{nav.name}</span
				>
			</a>
		{/if}
	{/each}
</div>
