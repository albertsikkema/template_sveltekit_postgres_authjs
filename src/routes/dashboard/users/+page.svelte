<script lang="js">
	import {
		UserPlusIcon,
		PencilSquareIcon,
		ExclamationCircleIcon,
		TrashIcon,
		MagnifyingGlassIcon,
		XMarkIcon,
	} from 'heroicons-svelte/24/outline';
	import { enhance } from '$app/forms';
	import { toast } from 'svoast';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import FileInput from '$lib/components/form/FileInput.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';

	let { data, form } = $props();
	let isEditing = $state(false);

	const defaultItem = {
		name: '',
		email: '',
		role: 'user',
		active: true
	};
	let selectedItem = $state(defaultItem);
	let filteredItems = $state(data.users ?? []);
	let searchTerm = $state('');
	let resultFormMessage = $state({});

	$effect(() => {
		const users = data.users ?? []; // Always ensure `users` is an array before filtering

		if (searchTerm.trim() !== '') {
			filteredItems = [...users] // Prevent direct modification
				.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
				.sort((a, b) => (a.email ?? '').localeCompare(b.email ?? '')); // ✅ Handle null names safely
		} else {
			filteredItems = [...users].sort((a, b) => (a.email ?? '').localeCompare(b.email ?? '')); // ✅ Handle null names safely
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
		selectedItem = defaultItem;
		isEditing = false;
		const element = document.getElementById('additemmodal');
		element.showModal();
	}

	function handleCloseCreateItemModal() {
		selectedItem = defaultItem;
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
		selectedItem = defaultItem;
		isEditing = false;
		const element = document.getElementById('updateitemmodal');
		element.close();
	}

	function handleOpenDeleteItemModal(item) {
		selectedItem = item
		const element = document.getElementById('deleteitemmodal');
		element.showModal();
	}

	function handleCloseDeleteItemModal() {
		selectedItem = defaultItem;
		const element = document.getElementById('deleteitemmodal');
		element.close();
	}

	function handleOpenLogoutItemModal(item) {
		selectedItem = item;
		const element = document.getElementById('logoutitemmodal');
		element.showModal();
	}

	function handleCloseLogoutItemModal() {
		selectedItem = defaultItem;
		const element = document.getElementById('logoutitemmodal');
		element.close();
	}
</script>

<div class="w-full space-y-6">
	<div class="flex w-full flex-row items-center justify-between">
		<h1 class="text-2xl dark:text-white">Users</h1>

		<label class="input input-bordered flex w-48 items-center gap-2 sm:w-64 md:w-1/2">
			<input
				oninput={handleSearch}
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
		<button
			onclick={() => ((form = null), openCreateItemModal())}
			class="btn btn-primary flex w-32 flex-row"
			><UserPlusIcon class="h-6" /><span>Add User</span></button
		>
	</div>

	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>Email</th>
				<th>Name</th>
				<th class="w-24">Role</th>
				<th class="w-28">Active</th>
				<th class="w-36">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredItems as item}
				<tr class="hover:bg-base-300">
					<td>{item.email}</td>
					<td>{item.name}</td>
					<td>{item.role}</td>
					<td>
						<span
							class={`badge badge-outline ${item.active ? 'badge-success' : 'badge-error'} w-16`}
						>
							{item.active ? 'Active' : 'Inactive'}
						</span>
					</td><td>
						<div class="tooltip" data-tip="edit user">
							<button
								onclick={() => openEditItemModal(item)}
								class="btn btn-circle btn-sm p-1 dark:hover:brightness-90"
							>
								<PencilSquareIcon />
							</button>
						</div>
						<div class="tooltip" data-tip="log user out">
							<button
								onclick={() => handleOpenLogoutItemModal(item)}
								class="btn btn-circle btn-sm p-1 dark:hover:brightness-90"
							>
								<ExclamationCircleIcon />
							</button>
						</div>
						<div class="tooltip" data-tip="delete user">
							<button
								onclick={() => {
									handleOpenDeleteItemModal(item);
								}}
								class="btn btn-circle btn-sm p-1 text-red-500 dark:text-red-400"
							>
								<TrashIcon />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<dialog id="additemmodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Add Item</h3>
		<p class="mt-2">Fill the fields to add a new user</p>
		{#if form?.error}
			<div>{form.error}</div>
		{/if}

		<div class="modal-action w-full">
			<form
				method="POST"
				action="?/createuser"
				class="w-full space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.type === 'success') {
							resultFormMessage = { success: true, message: result.data.message };
							toast.success('User created successfully!');
							handleCloseCreateItemModal();
							update();
						} else {
							// update the form message
							resultFormMessage = { success: false, message: result.data.message };
						}
					};
				}}
			>
				<Input inputKey="Email" maxLength={50} inputValue={selectedItem.email} inputType="email" />
				<Input
					inputKey="Name"
					maxLength={30}
					minLength={3}
					inputValue={selectedItem.name}
					requiredInput={false}
				/>
				<div>
					<Select
						inputKey="Role"
						inputValue={selectedItem.role}
						options={{ admin: 'Admin', user: 'User' }}
					/>
					<span class="mt-2 text-sm">
						User is the default role, please do not grant Admin role easily.
					</span>
				</div>
				<Checkbox inputKey="Active" inputValue={selectedItem.active} />
				<div
					class="flex w-full flex-row items-center justify-end
				gap-2"
				>
					<button type="submit" class="btn btn-primary w-24">Save</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						onclick={() => handleCloseCreateItemModal()}>Cancel</button
					>
				</div>
				<!-- if form errors -->
				<div class="mt-4">
					<ErrorMessage formMessage={resultFormMessage} />
				</div>
			</form>
		</div>
	</div>
</dialog>

<dialog id="updateitemmodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Edit User</h3>
		<p class="mt-2">Edit user details</p>
		<div class="modal-action w-full">
			<form
				method="POST"
				action="?/updateuser"
				class="w-full space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.type === 'success') {
							resultFormMessage = { success: true, message: result.data.message };
							handleCloseEditItemModal();
							update();
							toast.success('Item updated successfully!');
						} else {
							// update the form message
							resultFormMessage = { success: false, message: result.data.message };
						}
					};
				}}
			>
				<Input
					inputKey="Email"
					maxLength={50}
					inputValue={selectedItem.email}
					inputType="email"
					disabled
				/>
				<Input
					inputKey="Name"
					maxLength={30}
					minLength={3}
					inputValue={selectedItem.name}
					requiredInput={false}
				/>
				<div>
					<Select
						inputKey="Role"
						inputValue={selectedItem.role}
						options={{ admin: 'Admin', user: 'User' }}
					/>

					<span class="mt-2 text-sm">
						User is the default role, please do not grant Admin role easily.
					</span>
				</div>
				<Checkbox inputKey="Active" inputValue={selectedItem.active} />
				<input type="hidden" name="email" value={selectedItem.email} />
				<div
					class="flex w-full flex-row items-center justify-end gap-2
				"
				>
					<button type="submit" class="btn btn-primary w-24">Save</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						onclick={() => handleCloseEditItemModal()}>Cancel</button
					>
				</div>
			</form>
		</div>
		<!-- if form errors -->
		<div class="mt-4">
			<ErrorMessage formMessage={resultFormMessage} />
		</div>
	</div>
</dialog>

<dialog id="deleteitemmodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">
			Confirm Delete User {#if selectedItem?.name}
				({selectedItem?.name})
			{/if}
		</h3>
		<p class="py-4">
			Are you sure you want to permanently delete user
			{#if selectedItem?.name}
			<span class="font-bold">
				{selectedItem?.name}
			</span>
			{/if}
			with email
			<span class="font-bold">
				{selectedItem?.email}
			</span>

			?
		</p>
		<div class="modal-action w-full">
			<form
				method="POST"
				action="?/deleteuser"
				class="flex flex-col space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.type === 'success') {
							resultFormMessage = {
								success: true,
								message: result?.data?.message ?? 'Item deleted successfully!'
							};
							handleCloseDeleteItemModal(); // Close modal on success
							update(); // Refresh UI
							toast.success('Item deleted successfully!');
						} else {
							resultFormMessage = {
								success: false,
								message: result?.data?.message ?? 'Something went wrong. Please try again.'
							};
						}
					};
				}}
			>
				<input type="hidden" name="email" value={selectedItem.email} />
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
	</div>
</dialog>

<dialog id="logoutusermodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Confirm Logout User ({selectedItem?.name})</h3>
		<p class="py-4">
			Are you sure you want to log out user
			<span class="font-bold">
				{selectedItem?.name}
			</span>
			with email
			<span class="font-bold">
				{selectedItem?.email}
			</span>
			?
		</p>
		<div class="modal-action w-full">
			<form
				method="POST"
				action="?/loguserout"
				class="flex flex-col space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.type === 'success') {
							resultFormMessage = {
								success: true,
								message: result?.data?.message ?? 'User logged out successfully!'
							};
							toast.success('Item logged out successfully!');
							handleCloseLogoutItemModal(); // Close modal on success
							update(); // Refresh UI
						} else {
							resultFormMessage = {
								success: false,
								message: result?.data?.message ?? 'Something went wrong. Please try again.'
							};
						}
					};
				}}
			>
				<input type="hidden" name="email" value={selectedItem.email} />
				<div class="flex flex-row items-center justify-end gap-2">
					<button type="submit" class="btn btn-primary w-24">Log Out</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						color="light"
						onclick={() => handleCloseLogoutItemModal()}>Cancel</button
					>
				</div>
			</form>
		</div>
		<!-- if form errors -->
		<div class="mt-4">
			<ErrorMessage formMessage={resultFormMessage} />
		</div>
	</div>
</dialog>
