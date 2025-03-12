<script lang="js">
	import '../app.css';
	let { children } = $props();

	import { Toasts, toast } from 'svoast';

	function showToastMessage(message) {
		toast.success(message);
	}
</script>

<Toasts position="top-right" />

{@render children()}
