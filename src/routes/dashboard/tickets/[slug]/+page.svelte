<script>
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
	import TextArea from '../../../../components/form/TextArea.svelte';
	import Input from '../../../../components/form/Input.svelte';
	import FileInput from '../../../../components/form/FileInput.svelte';
	import Select from '../../../../components/form/Select.svelte';
	import ErrorMessage from '../../../../components/form/ErrorMessage.svelte';
	import Dialog from '../../../../components/Dialog.svelte';
	import { goto } from '$app/navigation';

	let { data, form } = $props();
	let ticket = $state(data.ticket);
	let userList = data.userList;
	let slug = data.slug;
	let error = data.error;

	let resultFormMessage = $state({});

	const handleCancelForm = () => {
		goto('/dashboard/tickets');
	};

	function handleOpenDeleteItemModal(item) {
		ticket = item;
		const element = document.getElementById('deleteitemmodal');
		element.showModal();
	}

	function handleCloseDeleteItemModal() {
		const element = document.getElementById('deleteitemmodal');
		element.close();
	}
</script>

<div class="mb-16 flex w-full flex-col items-center justify-between p-4 md:mb-0 md:p-8">
	<div class="w-full max-w-2xl">
		{#if error}
			<div>This ticket does not exist.</div>
		{:else}
			<h1 class="text-2xl dark:text-white">
				{#if slug === 'new'}
					Create Ticket
				{:else}
					Edit Ticket
				{/if}
			</h1>

			{#if form?.error}
				<div>{form.error}</div>
			{/if}
			{#if slug === 'new'}
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
								goto('/dashboard/tickets');
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
					<input type="hidden" name="created_by" value={ticket.created_by} />
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
					action="?/updateticket"
					enctype="multipart/form-data"
					class="w-full space-y-4"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result?.type === 'success') {
								resultFormMessage = { success: true, message: result.data.message };
								toast.success('Ticket updated successfully!');
								goto('/dashboard/tickets');
							} else {
								// update the form message
								resultFormMessage = { success: false, message: result.data.message };
							}
						};
					}}
				>
					<div class="">
						<Input inputKey="Title" inputValue={ticket.title} maxLength={50} minLength={3} />
					</div>
					<div class="mb-4">
						<TextArea
							inputKey="Description"
							inputValue={ticket.description}
							placeholder="Add a description..."
							maxLength={300}
							minLength={3}
						/>
					</div>
					<div class="mb-4">
						<FileInput images={ticket.images} />
					</div>

					<div class="mb-4">
						<Select
							inputKey="Status"
							inputValue={ticket.status}
							options={{ open: 'Open', closed: 'Closed' }}
						/>
					</div>
					<div class="mb-4">
						<Select inputKey="Assigned_to" inputValue={ticket.assigned_to} options={userList} />
					</div>
					<input type="hidden" name="created_by" value={ticket.created_by} />

					<div class="flex w-full flex-col items-center justify-end gap-2 md:flex-row">
						<button type="submit" class="btn btn-primary w-full md:w-24">Save</button>
						<button type="reset" class="btn btn-outline w-full md:w-24" onclick={handleCancelForm}
							>Cancel</button
						>
					</div>
					<!-- hidden fields -->
					<input type="hidden" name="id" value={ticket.id} />
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
			<div class="tooltip w-full py-4 md:w-40" data-tip="delete ticket">
				<button
					onclick={() => {
						handleOpenDeleteItemModal(ticket);
					}}
					class="btn btn-warning btn-outline w-full p-1"
				>
					<ExclamationCircleIcon class="h-5 w-5" /> Delete ticket
				</button>
			</div>
		</div>
	{/if}
</div>

<Dialog id="deleteitemmodal" title="Confirm Delete Ticket">
	<p class="mt-2">
		Are you sure you want to permanently delete ticket
		<span class="font-bold">
			{ticket?.title}
		</span>
		with id
		<span class="font-bold">
			{ticket?.id}
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
			<input type="hidden" name="id" value={ticket.id} />
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
