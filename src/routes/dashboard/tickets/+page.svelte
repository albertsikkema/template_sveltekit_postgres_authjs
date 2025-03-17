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

	let { data, form } = $props();
	console.log('total tickets', data.total);
	console.log('page', data.page);
	console.log('next page', data.next);
	console.log('prev page', data.prev);
	console.log('current page', data.currentpage);
	console.log('orderby', data.orderby);
	console.log('order', data.order);
	console.log('search', data.search);

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

	function determineage(date) {
		const today = new Date();
		const created = new Date(date);
		const diffTime = Math.abs(today - created);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	function navigateToPage(dest) {
		console.log('navigate to page', dest);
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
		console.log('set order', field);
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
		<div class=" flex w-full flex-row items-center justify-center">
			<div class="join">
				{#if data.currentpage > 1}
					<button
						onclick={() => {
							navigateToPage(Number(data.currentpage) - 1);
						}}
						class="join-item btn">«</button
					>
				{/if}
				<!-- {#if data.currentpage > 1}
        <button 
        onclick={
            () => {
                navigateToPage(Number(data.currentpage) - 1);
            }
        }
        class="join-item btn">{Number(data.currentpage) - 1}</button>
        {/if} -->
				<button
					onclick={() => {
						navigateToPage(Number(data.currentpage));
					}}
					class="join-item btn">{Number(data.currentpage)}/{data.maxpage}</button
				>
				<!-- {#if data.currentpage < data.maxpage}
        <button 
        onclick={
            () => {
                navigateToPage(Number(data.currentpage) + 1);
            }
        }
        class="join-item btn">{Number(data.currentpage) + 1}</button>
        {/if} -->
				{#if data.currentpage < data.maxpage}
					<button
						onclick={() => {
							navigateToPage(Number(data.currentpage) + 1);
						}}
						class="join-item btn">»</button
					>
				{/if}
			</div>
		</div>

		<table class="table">
			<thead>
				<tr>
					<th onclick={() => setOrder('title')} class="flex w-24 cursor-pointer items-center gap-2">
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

					<th onclick={() => setOrder('description')} class="hidden cursor-pointer md:table-cell">
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

					<th onclick={() => setOrder('status')} class="cursor-pointer">
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
					<th onclick={() => setOrder('created_by')} class="hidden md:table-cell">Created_By</th>
					<th onclick={() => setOrder('assigned_to')} class="hidden md:table-cell">Assigned_To</th>
					<th onclick={() => setOrder('created_at')}>Age</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tickets as item}
					<tr class="hover:bg-base-300 h-full max-h-20" onclick={() => handleOpenItem(item.id)}>
						<td class="max-w-1/12">{item.title}</td>
						<td class="hidden md:table-cell">{item.description}</td>
						<td>
							<span
								class={`badge badge-outline ${item.status === 'closed' ? 'badge-success' : 'badge-error'} w-16`}
							>
								{item.status === 'closed' ? 'Closed' : 'Open'}
							</span>
						</td>
						<td class="hidden md:table-cell">{item.created_by_email}</td>
						<td class="hidden md:table-cell">{item.assigned_to_email}</td>
						<td>{determineage(item.created_at)} day(s)</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
