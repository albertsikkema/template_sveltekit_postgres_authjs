<script lang="js">
	import {
		UserPlusIcon,
		PencilSquareIcon,
		ExclamationCircleIcon,
		TrashIcon,
		MagnifyingGlassIcon,
		XMarkIcon
	} from 'heroicons-svelte/24/outline';
	import { enhance } from '$app/forms';
	import { toast } from 'svoast';
	import TextArea from '../../../../components/form/TextArea.svelte';
	import Input from '../../../../components/form/Input.svelte';
	import FileInput from '../../../../components/form/FileInput.svelte';
	import Select from '../../../../components/form/Select.svelte';
	import ErrorMessage from '../../../../components/form/ErrorMessage.svelte';
	import Checkbox from '../../../../components/form/Checkbox.svelte';
	import Dialog from '../../../../components/Dialog.svelte';
	import { goto } from '$app/navigation';

	let { data, form } = $props();
	let user = $state(data.user);
	let slug = data.slug;
	let error = data.error;
	let isEditing = $state(false);

	let resultFormMessage = $state({});

	const handleCancelForm = () => {
		goto('/dashboard/users');
	};

	function handleOpenDeleteItemModal(item) {
		user = item;
		const element = document.getElementById('deleteitemmodal');
		element.showModal();
	}

	function handleCloseDeleteItemModal() {
		const element = document.getElementById('deleteitemmodal');
		element.close();
		goto('/dashboard/users');
	}

	function handleOpenLogoutItemModal(item) {
		user = item;
		const element = document.getElementById('logoutitemmodal');
		element.showModal();
	}

	function handleCloseLogoutItemModal() {
		const element = document.getElementById('logoutitemmodal');
		element.close();
	}
</script>

<div class="mb-16 flex w-full flex-col items-center justify-between p-4 md:mb-0 md:p-8">
	<div class="w-full max-w-2xl">
		{#if error}
			<div>This user does not exist.</div>
		{:else}
			<h1 class="text-2xl dark:text-white">
				{#if slug === 'new'}
					Create User
				{:else}
					Edit User
				{/if}
			</h1>

			{#if form?.error}
				<div>{form.error}</div>
			{/if}
			{#if slug === 'new'}
				<form
					method="POST"
					action="?/createuser"
					enctype="multipart/form-data"
					class="w-full space-y-4"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result?.type === 'success') {
								resultFormMessage = { success: true, message: 'User created successfully!' };
								toast.success('User created successfully!');
								goto('/dashboard/users');
							} else {
								// update the form message
								resultFormMessage = { success: false, message: result.data.message };
							}
						};
					}}
				>
					<div>
						<Input inputKey="Email" maxLength={50} inputValue={user.email} inputType="email" />
					</div>
					<div>
						<Input inputKey="Name" maxLength={30} inputValue={user.name} requiredInput={false} />
					</div>
					<div>
						<Select
							inputKey="Role"
							inputValue={user.role}
							options={{ admin: 'Admin', user: 'User' }}
						/>
						<span class="mt-2 text-sm">
							User is the default role, please do not grant Admin role easily.
						</span>
					</div>
					<div>
						<Checkbox inputKey="Active" inputValue={user.active} />
					</div>
					<div class="flex w-full flex-col items-center justify-end gap-2 md:flex-row">
						<button type="submit" class="btn btn-primary w-full md:w-24">Save</button>
						<button type="reset" class="btn btn-outline w-full md:w-24" onclick={handleCancelForm}
							>Cancel</button
						>
					</div>
					<!-- if form errors -->
					<ErrorMessage formMessage={resultFormMessage} />
				</form>
			{:else}
				<form
					method="POST"
					action="?/updateuser"
					enctype="multipart/form-data"
					class="w-full space-y-4"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result?.type === 'success') {
								resultFormMessage = { success: true, message: result.data.message };
								toast.success('User updated successfully!');
								goto('/dashboard/users');
							} else {
								// update the form message
								resultFormMessage = { success: false, message: result.data.message };
							}
						};
					}}
				>
					<Input inputKey="Email" maxLength={50} inputValue={user.email} inputType="email" />
					<Input
						inputKey="Name"
						maxLength={30}
						minLength={3}
						inputValue={user.name}
						requiredInput={false}
					/>
					<div>
						<Select
							inputKey="Role"
							inputValue={user.role}
							options={{ admin: 'Admin', user: 'User' }}
						/>

						<span class="mt-2 text-sm">
							User is the default role, please do not grant Admin role easily.
						</span>
					</div>
					<Checkbox inputKey="Active" inputValue={user.active} />
					<input type="hidden" name="id" value={user.id} />

					<div class="flex w-full flex-col items-center justify-end gap-2 md:flex-row">
						<button type="submit" class="btn btn-primary w-full md:w-24">Save</button>
						<button type="reset" class="btn btn-outline w-full md:w-24" onclick={handleCancelForm}
							>Cancel</button
						>
					</div>
				</form>
			{/if}
			<!-- if form errors -->
			<div class="mt-4">
				<ErrorMessage formMessage={resultFormMessage} />
			</div>
		{/if}
	</div>
	{#if slug !== 'new'}
		<div class="divider"></div>
		<h2 class="text-xl dark:text-white">Danger Zone</h2>
		<div class="text-gray-600">These actions cannot be undone.</div>
		<div class="mt-4 flex flex-col gap-4 md:flex-row">
			<div class="tooltip w-full py-4 md:w-40" data-tip="log user out">
				<button
					onclick={() => {
						handleOpenLogoutItemModal(user);
					}}
					class="btn btn-warning btn-outline w-full p-1"
				>
					<ExclamationCircleIcon class="h-5 w-5" /> Logout user
				</button>
			</div>
		</div>
	{/if}
</div>

<Dialog id="deleteitemmodal" title="Confirm Delete User">
	<p class="py-4">
		Are you sure you want to permanently delete user
		<span class="font-bold">
			{user?.title}
		</span>
		with email
		<span class="font-bold">
			{user?.email}
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
						update(); // Refresh UI
						toast.success('User deleted successfully!');
						goto('/dashboard/users');
					} else {
						resultFormMessage = {
							success: false,
							message: result?.data?.message ?? 'Something went wrong. Please try again.'
						};
					}
				};
			}}
		>
			<input type="hidden" name="id" value={user.id} />
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

<Dialog id="logoutitemmodal" title="Log Out User">
	<p class="py-4">
		Are you sure you want to log out user
		<span class="font-bold">
			{user?.name}
		</span>
		with email
		<span class="font-bold">
			{user?.email}
		</span>
		from all devices?
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
						toast.success(resultFormMessage.message);
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
			<input type="hidden" name="email" value={user.email} />
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
</Dialog>
