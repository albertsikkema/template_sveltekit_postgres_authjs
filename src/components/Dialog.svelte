<script>
	let { children='hi there', title='', subtitle='', id='modal' } = $props();
</script>

<dialog {id} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-full max-w-6xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		{#if title}
			<h3 class="text-lg font-bold">{title}</h3>
		{/if}
		{#if subtitle}
			<p class="mt-2">{subtitle}</p>
		{/if}

		{@render children()}
	</div>
</dialog>
