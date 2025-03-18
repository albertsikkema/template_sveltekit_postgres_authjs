<script lang="js">
	import {
		UserPlusIcon,
		PencilSquareIcon,
		ExclamationCircleIcon,
		TrashIcon,
		MagnifyingGlassIcon,
		XMarkIcon,
		EnvelopeIcon,
		UserIcon,
		PlusIcon,
		ChevronUpIcon,
		ChevronDownIcon
	} from 'heroicons-svelte/24/outline';
	import { enhance } from '$app/forms';
	import { toast } from 'svoast';
	import TextArea from '../../../components/form/TextArea.svelte';
	import Input from '../../../components/form/Input.svelte';
	import FileInput from '../../../components/form/FileInput.svelte';
	import Select from '../../../components/form/Select.svelte';
	import ErrorMessage from '../../../components/form/ErrorMessage.svelte';
	import Dialog from '../../../components/Dialog.svelte';
	import { goto } from '$app/navigation';
	import { debounce } from 'lodash-es';
	import { browser } from '$app/environment';
	import Pagination from '../../../components/Pagination.svelte';
	import { determineage } from '$lib/helpers/functions';
	let { data, form } = $props();

	let searchTerm = $state('');
	let orderby = $state('created_at');
	let order = $state('asc');
	let page = 1;
	let searchInput;

	// ✅ Ensure this only runs in the browser
	if (browser) {
		const params = new URLSearchParams(window.location.search);
		searchTerm = params.get('search') || '';
		orderby = params.get('orderby') || 'created_at';
		order = params.get('order') || 'asc';
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
		goto(`/dashboard/tickets?${params.toString()}`);
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
		goto(`/dashboard/tickets?${params.toString()}`, { replaceState: true }).then(() => {
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
		goto('/dashboard/tickets/new');
	};

	const handleOpenItem = (id) => {
		goto(`/dashboard/tickets/${id}`);
	};
</script>

<div class="relative h-screen w-full space-y-6 overflow-x-hidden pb-16 md:px-4 md:pt-8 md:pb-0">
	<div class="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
		<h1 class="text-2xl dark:text-white">Tickets</h1>

		<label class="input input-bordered flex w-48 items-center gap-2 sm:w-64 md:w-1/2">
			<input
				oninput={handleSearch}
				bind:this={searchInput}
				value={searchTerm}
				type="text"
				class="w-full"
				placeholder="Search tickets..."
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
			><PlusIcon class="h-6"></PlusIcon><span>Ticket</span></button
		>
	</div>
	{#if data.currentpage}
		<Pagination {navigateToPage} currentPage={data.currentpage} maxPage={data.maxpage} />

		<table class="table w-full">
			<thead>
				<tr>
					<th
						onclick={() => setOrder('title')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('title')}
						class="w-1/4 cursor-pointer"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Title
							{#if orderby === 'title'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('description')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('description')}
						class="hidden w-1/4 cursor-pointer md:table-cell"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Description
							{#if orderby === 'description'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('status')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('status')}
						class="w-1/4 cursor-pointer"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Status
							{#if orderby === 'status'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('created_by')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('created_by')}
						class="hidden w-1/4 md:table-cell"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Created_By
							{#if orderby === 'created_by'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('assigned_to')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('assigned_to')}
						class="hidden w-1/4 md:table-cell"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
						><div class="flex items-center gap-1">
							Assigned_To
							{#if orderby === 'assigned_to'}
								{#if order === 'asc'}
									<ChevronUpIcon class="h-4 w-4" />
								{:else}
									<ChevronDownIcon class="h-4 w-4" />
								{/if}
							{/if}
						</div>
					</th>

					<th
						onclick={() => setOrder('created_at')}
						onkeydown={(e) => e.key === 'Enter' && setOrder('created_at')}
						class="w-1/4"
						tabindex="0"
						role="button"
						aria-label="Sort by title"
					>
						<div class="flex items-center gap-1">
							Age
							{#if orderby === 'created_at'}
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
				{#each data.tickets as item}
					<tr
						class="hover:bg-base-300"
						onclick={() => handleOpenItem(item.id)}
						tabindex="0"
						aria-label={`Open ticket ${item.title}`}
						onkeydown={(e) => e.key === 'Enter' && handleOpenItem(item.id)}
					>
						<td class="max-h-12 w-1/4 overflow-hidden text-ellipsis whitespace-normal">
							<div class="line-clamp-2">
								{item.title}
							</div>
						</td>

						<td
							class="hidden max-h-12 w-1/4 overflow-hidden text-ellipsis whitespace-normal md:table-cell"
						>
							<div class="line-clamp-2">
								{item.description}
							</div>
						</td>

						<td class="w-1/4">
							<span
								class={`badge badge-outline ${item.status === 'closed' ? 'badge-success' : 'badge-error'} w-16`}
							>
								{item.status === 'closed' ? 'Closed' : 'Open'}
							</span>
						</td>

						<td class="hidden w-1/8 overflow-hidden md:table-cell">{item.created_by_email}</td>
						<td class="hidden w-1/4 md:table-cell">{item.assigned_to_email}</td>
						<td class="w-1/4 min-w-24">{determineage(item.created_at)} day(s)</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<span class="text-sm text-gray-500 dark:text-gray-400">
			Showing {data.currentpage * 10 - 9} - {data.currentpage * 10 < data.total
				? data.currentpage * 10
				: data.total} of {data.total} tickets
		</span>
	{:else}
		<div class="mt-16 flex w-full items-center justify-center">
			<p class="text-lg text-gray-500 dark:text-gray-400">No tickets found</p>
		</div>
	{/if}
</div>
