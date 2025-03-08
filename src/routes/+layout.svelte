<script lang="js">
	import '../app.css';
	let { children } = $props();


</script>


<div class=" flex min-h-screen min-w-screen flex-col items-center justify-center">
	<div class="container mx-auto w-full max-w-5xl">
		{@render children()}
	</div>
</div>
