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
		PlusIcon
	} from 'heroicons-svelte/24/outline';
	import { enhance } from '$app/forms';
	import { toast } from 'svoast';
	import TextArea from '../../../components/form/TextArea.svelte';
	import Input from '../../../components/form/Input.svelte';
	import FileInput from '../../../components/form/FileInput.svelte';
	import Select from '../../../components/form/Select.svelte';
	import ErrorMessage from '../../../components/form/ErrorMessage.svelte';
	import Dialog from '../../../components/Dialog.svelte';

	let { data, form } = $props();
	let userId = data.userId;
	let userList = data.userList;
	let isEditing = $state(false);

	const defaultTicket = {
		title: '',
		description: '',
		created_by: '',
		assigned_to: '',
		images: []
	};
	let selectedItem = $state(defaultTicket);
	let filteredItems = $state(data.tickets ?? []);
	let searchTerm = $state('');
	let resultFormMessage = $state({});

	$effect(() => {
		const items = data.tickets ?? []; // Always ensure `users` is an array before filtering

		if (searchTerm.trim() !== '') {
			filteredItems = [...items] // Prevent direct modification
				.filter((item) => item.email.toLowerCase().includes(searchTerm.toLowerCase()))
				.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')); // ✅ Handle null names safely
		} else {
			filteredItems = [...items].sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')); // ✅ Handle null names safely
		}
	});
	function handleSearch(event) {
		const target = event.target;
		if (target) {
			searchTerm = target.value;
		}
	}

	function handleClearSearch() {
		searchTerm = '';
	}

	function openCreateItemModal() {
		selectedItem = { ...defaultTicket };
		isEditing = false;
		const element = document.getElementById('additemmodal');
		element.showModal();
	}

	function handleCloseCreateItemModal() {
		selectedItem = { ...defaultTicket };
		isEditing = false;
		const element = document.getElementById('additemmodal');
		element.close();
	}

	function openEditItemModal(item) {
		selectedItem = item;
		isEditing = true;
		const element = document.getElementById('updateitemmodal');
		element.showModal();
	}

	function handleCloseEditItemModal() {
		selectedItem = { ...defaultTicket };
		isEditing = false;
		const element = document.getElementById('updateitemmodal');
		element.close();
	}

	function handleOpenDeleteItemModal(item) {
		selectedItem = item;
		const element = document.getElementById('deleteitemmodal');
		element.showModal();
	}

	function handleCloseDeleteItemModal() {
		selectedItem = { ...defaultTicket };
		const element = document.getElementById('deleteitemmodal');
		element.close();
	}

	function handleOpenLogoutItemModal(item) {
		selectedItem = item;
		const element = document.getElementById('logoutitemmodal');
		element.showModal();
	}

	function handleCloseLogoutItemModal() {
		selectedItem = defaultTicket;
		const element = document.getElementById('logoutitemmodal');
		element.close();
	}

	function determineage(date) {
		const today = new Date();
		const created = new Date(date);
		const diffTime = Math.abs(today - created);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}
</script>

<div class="mb-16 w-full space-y-6 pt-4 md:px-4 md:pt-8">
	<div class="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
		<h1 class="text-2xl dark:text-white">Tickets</h1>

		<label class="input input-bordered flex w-48 items-center gap-2 sm:w-64 md:w-1/2">
			<input
				oninput={handleSearch}
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
		<button
			onclick={() => ((form = null), openCreateItemModal())}
			class="btn btn-primary flex w-32 flex-row"
			><PlusIcon class="h-6"></PlusIcon><span>Ticket</span></button
		>
	</div>

	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>Title</th>
				<th class="md:display hidden">Description</th>
				<th>Status</th>
				<th class="md:display hidden">Created_By</th>
				<th class="md:display hidden">Assigned_To</th>
				<th>Age</th>
				<th class="min-w-28 md:w-36">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredItems as item}
				<tr class="hover:bg-base-300">
					<td>{item.title}</td>
					<td class="md:display hidden">{item.description}</td>
					<td>
						<span
							class={`badge badge-outline ${item.status === 'closed' ? 'badge-success' : 'badge-error'} w-16`}
						>
							{item.status === 'closed' ? 'Closed' : 'Open'}
						</span>
					</td>
					<td class="md:display hidden">{item.created_by}</td>
					<td class="md:display hidden">{item.assigned_to}</td>
					<td>{determineage(item.created_at)} day(s)</td>

					<td>
						<div class="tooltip" data-tip="edit ticket">
							<button
								onclick={() => openEditItemModal(item)}
								class="btn btn-circle btn-sm p-1 dark:hover:brightness-90"
							>
								<PencilSquareIcon class="h-5 w-5" />
							</button>
						</div>
						<div class="tooltip" data-tip="delete ticket">
							<button
								onclick={() => {
									handleOpenDeleteItemModal(item);
								}}
								class="btn btn-circle btn-sm p-1 text-red-500 dark:text-red-400"
							>
								<TrashIcon class="h-5 w-5" />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Dialog id={'additemmodal'} title={'Add Ticket'} subtitle={'Fill the fields to add a new ticket'}>
	{#if form?.error}
		<div>{form.error}</div>
	{/if}
	<div class="modal-action w-full">
		<form
			method="POST"
			action="?/createticket"
			enctype="multipart/form-data"
			class="w-full space-y-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result?.type === 'success') {
						resultFormMessage = { success: true, message: 'Ticket created successfully!' };
						toast.success('Ticket created successfully!');
						handleCloseCreateItemModal();
						update();
					} else {
						// update the form message
						resultFormMessage = { success: false, message: result.data.message };
					}
				};
			}}
		>
			<div>
				<Input inputKey="Title" maxLength={50} minLength={3} />
			</div>
			<div>
				<TextArea inputKey="Description" placeholder="Add a description..." maxLength={300} />
			</div>

			<div>
				<FileInput />
			</div>
			<input type="hidden" name="created_by" value={userId} />
			<div class="flex w-full flex-row items-center justify-end gap-2">
				<button type="submit" class="btn btn-primary w-24">Save</button>
				<button
					type="reset"
					class="btn btn-outline w-24"
					onclick={() => handleCloseCreateItemModal()}>Cancel</button
				>
			</div>
			<!-- if form errors -->
			<ErrorMessage formMessage={resultFormMessage} />
		</form>
	</div>
	<!-- if form errors -->
	<div class="mt-4">
		<ErrorMessage formMessage={resultFormMessage} />
	</div>
</Dialog>

<Dialog id="updateitemmodal" title="Edit Ticket" subtitle="Edit ticket details">
	<div class="modal-action w-full">
		<form
			method="POST"
			action="?/updateticket"
			enctype="multipart/form-data"
			class="w-full space-y-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result?.type === 'success') {
						resultFormMessage = { success: true, message: result.data.message };
						handleCloseEditItemModal();
						update();
						toast.success('Ticket updated successfully!');
					} else {
						// update the form message
						resultFormMessage = { success: false, message: result.data.message };
					}
				};
			}}
		>
			<div class="">
				<Input inputKey="Title" inputValue={selectedItem.title} maxLength={50} minLength={3} />
			</div>
			<div class="mb-4">
				<TextArea
					inputKey="Description"
					inputValue={selectedItem.description}
					placeholder="Add a description..."
					maxLength={300}
					minLength={3}
				/>
			</div>
			<div class="mb-4">
				<FileInput images={selectedItem.images} />
			</div>

			<div class="mb-4">
				<Select
					inputKey="Status"
					inputValue={selectedItem.status}
					options={{ open: 'Open', closed: 'Closed' }}
				/>
			</div>
			<div class="mb-4">
				<Select inputKey="Assigned_to" inputValue={selectedItem.assigned_to} options={userList} />
			</div>
			<input type="hidden" name="created_by" value={selectedItem.created_by} />

			<div class="flex w-full flex-row items-center justify-end gap-2">
				<button type="submit" class="btn btn-primary w-24">Save</button>
				<button type="reset" class="btn btn-outline w-24" onclick={() => handleCloseEditItemModal()}
					>Cancel</button
				>
			</div>
			<!-- hidden fields -->
			<input type="hidden" name="id" value={selectedItem.id} />
		</form>
	</div>
	<!-- if form errors -->
	<div class="mt-4">
		<ErrorMessage formMessage={resultFormMessage} />
	</div>
</Dialog>

<Dialog id="deleteitemmodal" title="Confirm Delete Ticket">
	<p class="mt-2">
		Are you sure you want to permanently delete ticket
		<span class="font-bold">
			{selectedItem?.title}
		</span>
		with id
		<span class="font-bold">
			{selectedItem?.id}
		</span>
		?
	</p>
	<div class="modal-action w-full">
		<form
			method="POST"
			action="?/deleteticket"
			class="flex flex-col space-y-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result?.type === 'success') {
						resultFormMessage = {
							success: true,
							message: result?.data?.message ?? 'Ticket deleted successfully!'
						};
						handleCloseDeleteItemModal(); // Close modal on success
						update(); // Refresh UI
						toast.success('Ticket deleted successfully!');
					} else {
						resultFormMessage = {
							success: false,
							message: result?.data?.message ?? 'Something went wrong. Please try again.'
						};
					}
				};
			}}
		>
			<input type="hidden" name="id" value={selectedItem.id} />
			<div class="flex w-full flex-row items-center gap-2">
				<button type="submit" class="btn btn-primary w-24">Delete</button>
				<button
					type="reset"
					class="btn btn-outline w-24"
					color="light"
					onclick={() => handleCloseDeleteItemModal()}>Cancel</button
				>
			</div>
		</form>
	</div>
	<!-- if form errors -->
	<div class="mt-4">
		<ErrorMessage formMessage={resultFormMessage} />
	</div>
</Dialog>
