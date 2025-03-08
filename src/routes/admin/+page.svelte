<script lang="js">
	import {
		UserEditOutline,
		TrashBinOutline,
		ExclamationCircleOutline,
		UserAddOutline,
		CloseOutline
	} from 'flowbite-svelte-icons';
	import { PUBLIC_AXIOM_LOGS_STREAM } from '$env/static/public';
	import { enhance } from '$app/forms';


	let { data, form } = $props();

	let isEditing = $state(false);
	const defaultuser = {
		name: '',
		email: '',
		role: 'user',
		active: true
	};
	let selectedUser = $state(defaultuser);

	let filteredUsers = $state(data.users ?? []);
	let searchTerm = $state('');
	let resultFormMessage = $state({});

	$effect(() => {
		const users = data.users ?? []; // Always ensure `users` is an array before filtering

		if (searchTerm.trim() !== '') {
			filteredUsers = [...users] // Prevent direct modification
				.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
				.sort((a, b) => (a.email ?? '').localeCompare(b.email ?? '')); // ✅ Handle null names safely
		} else {
			filteredUsers = [...users].sort((a, b) => (a.email ?? '').localeCompare(b.email ?? '')); // ✅ Handle null names safely
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

	function openCreateUserModal() {
		selectedUser = defaultuser;
		isEditing = false;
		const element = document.getElementById('addusermodal');
		element.showModal();
	}

	function handleCloseCreateUserModal() {
		selectedUser = defaultuser;
		isEditing = false;
		const element = document.getElementById('addusermodal');
		element.close();
	}

	function openEditUserModal(user) {
		selectedUser = user;
		isEditing = true;
		const element = document.getElementById('updateusermodal');
		element.showModal();
	}

	function handleCloseEditUserModal() {
		selectedUser = defaultuser;
		isEditing = false;
		const element = document.getElementById('updateusermodal');
		element.close();
	}

	function handleOpenDeleteUserModal(user) {
		selectedUser = user;
		const element = document.getElementById('deleteusermodal');
		element.showModal();
	}

	function handleCloseDeleteUserModal() {
		selectedUser = defaultuser;
		const element = document.getElementById('deleteusermodal');
		element.close();
	}

	function handleOpenLogoutUserModal(user) {
		selectedUser = user;
		const element = document.getElementById('logoutusermodal');
		element.showModal();
	}

	function handleCloseLogoutUserModal() {
		selectedUser = defaultuser;
		const element = document.getElementById('logoutusermodal');
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
				<CloseOutline class="me-2 h-4 w-4 opacity-70" />
			</button>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="h-4 w-4 opacity-70"
			>
				<path
					fill-rule="evenodd"
					d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</label>
		<button
			onclick={() => ((form = null), openCreateUserModal())}
			class="btn btn-primary flex w-32 flex-row"
			><UserAddOutline class="h-6" /><span>Add User</span></button
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
			{#each filteredUsers as user}
				<tr class="hover:bg-base-300">
					<td>{user.email}</td>
					<td>{user.name}</td>
					<td>{user.role}</td>
					<td>
						<span
							class={`badge badge-outline ${user.active ? 'badge-success' : 'badge-error'} w-16`}
						>
							{user.active ? 'Active' : 'Inactive'}
						</span>
					</td><td>
						<div class="tooltip" data-tip="edit user">
							<button
								onclick={() => openEditUserModal(user)}
								class="btn btn-circle btn-sm p-1 dark:hover:brightness-90"
							>
								<UserEditOutline />
							</button>
						</div>
						<div class="tooltip" data-tip="log user out">
							<button
								onclick={() => handleOpenLogoutUserModal(user)}
								class="btn btn-circle btn-sm p-1 dark:hover:brightness-90"
							>
								<ExclamationCircleOutline />
							</button>
						</div>
						<div class="tooltip" data-tip="delete user">
							<button
								onclick={() => {
									handleOpenDeleteUserModal(user);
								}}
								class="btn btn-circle btn-sm p-1 text-red-500 dark:text-red-400"
							>
								<TrashBinOutline />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<dialog id="addusermodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Add User</h3>
		<p class="py-4">Fill the fields to add a new user</p>
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
							handleCloseCreateUserModal();
							update();
							// toast.success("User created successfully!");
						} else {
							// update the form message
							resultFormMessage = { success: false, message: result.data.message };
						}
					};
				}}
			>
				<div>
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="2.5"
								fill="none"
								stroke="currentColor"
								><rect width="20" height="16" x="2" y="4" rx="2"></rect><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								></path></g
							></svg
						>
						<input
							type="email"
							name="email"
							value={selectedUser.email}
							placeholder="mail@site.com"
							required
							title="Valid email address"
						/>
					</label>
					<div class="validator-hint hidden">Enter valid email address</div>
				</div>
				<div>
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="2.5"
								fill="none"
								stroke="currentColor"
								><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle
									cx="12"
									cy="7"
									r="4"
								></circle></g
							></svg
						>
						<input
							type="input"
							name="name"
							value={selectedUser.name}
							placeholder="Username"
							pattern="[A-Za-z][A-Za-z0-9\-]*"
							minlength="3"
							maxlength="30"
							title="Only letters, numbers or dash"
						/>
					</label>
					<p class="validator-hint hidden">
						Must be 3 to 30 characters
						<br />containing only letters, numbers or dash
					</p>
				</div>

				<div>
					<label class="select w-full">
						<span class="label">Role</span>

						<select
							name="role"
							id="role"
							required
							pattern="user|admin"
							title="Choose a role for this user"
							value={selectedUser.role}
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</label>
					<span class="mt-2 text-sm">
						User is the default role, please do not grant admin role easily.
					</span>
				</div>

				<label class="fieldset-label">
					<input type="checkbox" name="active" checked={selectedUser.active} class="checkbox" />
					Active
				</label>
				<div class="flex w-full flex-row items-center justify-end gap-2">
					<button type="submit" class="btn btn-primary w-24">Save</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						onclick={() => handleCloseCreateUserModal()}>Cancel</button
					>
				</div>
				<!-- if form errors -->
				{#if resultFormMessage?.success === false}
					<div role="alert" class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>{resultFormMessage?.message}</span>
					</div>
				{/if}
			</form>
		</div>
	</div>
</dialog>

<dialog id="updateusermodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Edit User</h3>
		<p class="py-4">Edit user details</p>
		<div class="modal-action w-full">
			<form
				method="POST"
				action="?/updateuser"
				class="w-full space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result?.type === 'success') {
							resultFormMessage = { success: true, message: result.data.message };
							handleCloseEditUserModal();
							update();
							// toast.success("User updated successfully!");
						} else {
							// update the form message
							resultFormMessage = { success: false, message: result.data.message };
						}
					};
				}}
			>
				<div>
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="2.5"
								fill="none"
								stroke="currentColor"
								><rect width="20" height="16" x="2" y="4" rx="2"></rect><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								></path></g
							></svg
						>
						<input
							type="email"
							name="email"
							value={selectedUser.email}
							placeholder="mail@site.com"
							required
							title="Valid email address"
							disabled
						/>
						<input type="hidden" name="email" value={selectedUser.email} />
					</label>
					<div class="validator-hint hidden">Enter valid email address</div>
				</div>
				<div class="w-full">
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
							><g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="2.5"
								fill="none"
								stroke="currentColor"
								><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle
									cx="12"
									cy="7"
									r="4"
								></circle></g
							></svg
						>
						<input
							type="input"
							name="name"
							value={selectedUser.name}
							placeholder="Username"
							pattern="[A-Za-z][A-Za-z0-9\-]*"
							minlength="3"
							maxlength="30"
							title="Only letters, numbers or dash"
						/>
					</label>
					<p class="validator-hint hidden">
						Must be 3 to 30 characters
						<br />containing only letters, numbers or dash
					</p>
				</div>

				<div>
					<label class="select w-full">
						<span class="label">Role</span>
						<select
							name="role"
							id="role"
							required
							pattern="user|admin"
							title="Choose a role for this user"
							value={selectedUser.role}
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</label>
					<span class="mt-2 text-sm">
						User is the default role, please do not grant admin role easily.
					</span>
				</div>

				<label class="fieldset-label">
					<input type="checkbox" name="active" checked={selectedUser.active} class="checkbox" />
					Active
				</label>
				<div class="flex w-full flex-row items-center justify-end gap-2">
					<button type="submit" class="btn btn-primary w-24">Save</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						onclick={() => handleCloseEditUserModal()}>Cancel</button
					>
				</div>
				<!-- if form errors -->
				{#if resultFormMessage?.success === false}
					<div role="alert" class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>{resultFormMessage?.message}</span>
					</div>
				{/if}
			</form>
		</div>
	</div>
</dialog>

<dialog id="deleteusermodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Confirm Delete User ({selectedUser?.name})</h3>
		<p class="py-4">
			Are you sure you want to permanently delete user
			<span class="font-bold">
				{selectedUser?.name}
			</span>
			with email
			<span class="font-bold">
				{selectedUser?.email}
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
						console.log('📝 Form Submission Result:', result);
						if (result?.type === 'success') {
							console.log('✅ Success Response:', result?.data);
							resultFormMessage = {
								success: true,
								message: result?.data?.message ?? 'User deleted successfully!'
							};
							handleCloseDeleteUserModal(); // Close modal on success
							update(); // Refresh UI
							// toast.success("User deleted successfully!");
						} else {
							console.warn('⚠️ Form Submission Failed:', result);
							resultFormMessage = {
								success: false,
								message: result?.data?.message ?? 'Something went wrong. Please try again.'
							};
						}
					};
				}}
			>
				<input type="hidden" name="email" value={selectedUser.email} />
				<div class="flex w-full flex-row items-center gap-2">
					<button type="submit" class="btn btn-primary w-24">Delete</button>

					<button
						type="reset"
						class="btn btn-outline w-24"
						color="light"
						onclick={() => handleCloseDeleteUserModal()}>Cancel</button
					>
				</div>
				<!-- if form errors -->
				{#if resultFormMessage?.success === false}
					<div role="alert" class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>{resultFormMessage?.message}</span>
					</div>
				{/if}
			</form>
		</div>
	</div>
</dialog>

<dialog id="logoutusermodal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-12/12 max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Confirm Logout User ({selectedUser?.name})</h3>
		<p class="py-4">
			Are you sure you want to log out user
			<span class="font-bold">
				{selectedUser?.name}
			</span>
			with email
			<span class="font-bold">
				{selectedUser?.email}
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
						console.log('📝 Form Submission Result:', result);

						if (result?.type === 'success') {
							console.log('✅ Success Response:', result?.data);

							resultFormMessage = {
								success: true,
								message: result?.data?.message ?? 'User logged out successfully!'
							};

							handleCloseLogoutUserModal(); // Close modal on success
							update(); // Refresh UI
							// toast.success("User logged out successfully!");
						} else {
							console.warn('⚠️ Form Submission Failed:', result);

							resultFormMessage = {
								success: false,
								message: result?.data?.message ?? 'Something went wrong. Please try again.'
							};
						}
					};
				}}
			>
				<input type="hidden" name="email" value={selectedUser.email} />
				<div class="flex flex-row items-center justify-end gap-2">
					<button type="submit" class="btn btn-primary w-24">Log Out</button>
					<button
						type="reset"
						class="btn btn-outline w-24"
						color="light"
						onclick={() => handleCloseLogoutUserModal()}>Cancel</button
					>
				</div>
				<!-- if form errors -->
				{#if resultFormMessage?.success === false}
					<div role="alert" class="alert alert-info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="h-6 w-6 shrink-0 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>{resultFormMessage?.message}</span>
					</div>
				{/if}
			</form>
		</div>
	</div>
</dialog>
