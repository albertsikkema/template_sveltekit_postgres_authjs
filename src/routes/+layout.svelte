<script lang="js">
	import '../app.css';
	let { children } = $props();

	import { Toasts } from 'svoast';
</script>

<Toasts position="top-right" />

{@render children()}
