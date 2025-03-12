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
<h1>Dashboard</h1>
</div>
