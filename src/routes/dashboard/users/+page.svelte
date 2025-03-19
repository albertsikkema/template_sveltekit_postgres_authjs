<script lang="js">
	import {
		UserPlusIcon,
		MagnifyingGlassIcon,
		XMarkIcon,
		ChevronUpIcon,
		ChevronDownIcon
	} from 'heroicons-svelte/24/outline';

	import { goto } from '$app/navigation';
	import { debounce } from 'lodash-es';
	import { browser } from '$app/environment';
	import Pagination from '../../../components/Pagination.svelte';

	let { data } = $props();

	let searchTerm = $state('');
	let orderby = $state('created_at');
	let order = $state('asc');
	let page = $state(1);
	let searchInput;

	// ✅ Ensure this only runs in the browser
	if (browser) {
		const params = new URLSearchParams(window.location.search);
		searchTerm = params.get('search') || '';
		orderby = params.get('orderby') || 'created_at';
		order = params.get('order') || 'asc';
		// eslint-disable-next-line
		page = params.get('page') || 1;
	}

	function handleClearSearch() {
		searchTerm = '';
		updateSearch();
	}

	function navigateToPage(dest) {
		const params = new URLSearchParams(window.location.search);

		if (searchTerm) {
			params.set('search', searchTerm); // Update search parameter
		}
		if (orderby) {
			params.set('orderby', orderby);
		}
		if (order) {
			params.set('order', order);
		}

		params.set('page', dest);
		goto(`/dashboard/users?${params.toString()}`);
	}

	// Determines where to redirect (keeps `page` and `search` in URL)
	function updateSearch() {
		// Redirect to URL with new search query
		const params = new URLSearchParams(window.location.search);
		if (searchTerm) {
			params.set('search', searchTerm); // Update search parameter
			params.set('page', 1);
		} else {
			params.delete('search'); // Remove search param if empty
			params.delete('page');
		}
		// Navigate to the updated URL while keeping input focused
		goto(`/dashboard/users?${params.toString()}`, { replaceState: true }).then(() => {
			setTimeout(() => {
				searchInput?.focus(); // Restore focus after rerender
			}, 10); // Small delay ensures focus is applied AFTER rerender
		});
	}

	// Debounce input changes (wait 500ms before updating search)
	const handleSearch = debounce((event) => {
		searchTerm = event.target.value;
		updateSearch();
	}, 500);

	const setOrder = (field) => {
		if (orderby === field) {
			order = order === 'asc' ? 'desc' : 'asc';
		} else {
			orderby = field;
			order = 'asc';
		}
		navigateToPage(data.currentpage);
	};

	const handleCreateItem = () => {
		goto('/dashboard/users/new');
	};

	const handleOpenItem = (id) => {
		goto(`/dashboard/users/${id}`);
	};
</script>

<div class="relative h-screen w-full space-y-6 overflow-x-hidden pb-16 md:px-4 md:pt-8 md:pb-0">
	<div class="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
		<h1 class="text-2xl dark:text-white">Users</h1>

		<label class="input input-bordered flex w-48 items-center gap-2 sm:w-64 md:w-1/2">
			<input
				oninput={handleSearch}
				bind:this={searchInput}
				value={searchTerm}
				type="text"
				class="w-full"
				placeholder="Search users..."
			/>
			<button
				type="button"
				onclick={handleClearSearch}
				class={`outline-none ${searchTerm ? 'block' : 'hidden'}`}
			>
				<XMarkIcon class="me-2 h-4 w-4 opacity-70" />
			</button>
			<MagnifyingGlassIcon class="h-4 w-4 opacity-70" />
		</label>
		<button onclick={() => handleCreateItem()} class="btn btn-primary flex w-32 flex-row"
			><UserPlusIcon class="h-6"></UserPlusIcon><span>User</span></button
		>
	</div>
	{#if data.currentpage}
		<Pagination {navigateToPage} currentPage={data.currentpage} maxPage={data.maxpage} />
		<table class="table w-full">
			<!-- head -->
			<thead>
				<tr>
					<th
						onclick={() => setOrder('email')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('email')}
						class="w-1/4 cursor-pointer"
						tabindex="0"
						role="button"
						aria-label="Sort by email"
					>
						<div class="flex items-center gap-1">
							Email
							{#if orderby === 'email'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('name')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('name')}
						class="hidden w-1/4 md:table-cell"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Name
							{#if orderby === 'name'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('role')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('role')}
						class="hidden w-1/4 md:table-cell"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Role
							{#if orderby === 'role'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('active')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('active')}
						class="w-1/4 cursor-pointer"
						tabindex="0"
						role="button"
						aria-label="Sort by active"
					>
						<div class="flex items-center gap-1">
							Active
							{#if orderby === 'active'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as item (item.id)}
					<tr
						class="hover:bg-base-300"
						onclick={() => handleOpenItem(item.id)}
						tabindex="0"
						aria-label={`Open ticket ${item.title}`}
						onkeydown={(e) => e.key === 'Enter' && handleOpenItem(item.id)}
					>
						<td>{item.email}</td>
						<td class="hidden md:table-cell">{item.name}</td>
						<td class="hidden md:table-cell">{item.role}</td>
						<td>
							<span
								class={`badge badge-outline ${item.active ? 'badge-success' : 'badge-error'} w-16`}
							>
								{item.active ? 'Active' : 'Inactive'}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<span class="text-sm text-gray-500 dark:text-gray-400">
			Showing {data.currentpage * 10 - 9} - {data.currentpage * 10 < data.total
				? data.currentpage * 10
				: data.total} of {data.total} users
		</span>
	{:else}
		<div class="mt-16 flex w-full items-center justify-center">
			<p class="text-lg text-gray-500 dark:text-gray-400">No users found</p>
		</div>
	{/if}
</div>
