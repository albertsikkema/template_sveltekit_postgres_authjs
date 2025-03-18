<script>
	export let navigateToPage;
	export let currentPage;
	export let maxPage;
</script>

<div class=" flex w-full flex-row items-center justify-center">
	<div class="join">
		{#if currentPage > 1}
			<button
				onclick={() => {
					navigateToPage(Number(currentPage) - 1);
				}}
				class="join-item btn">«</button
			>
		{/if}
		<button
			onclick={() => {
				navigateToPage(Number(currentPage));
			}}
			class="join-item btn">{Number(currentPage)}/{maxPage}</button
		>
		{#if currentPage < maxPage}
			<button
				onclick={() => {
					navigateToPage(Number(currentPage) + 1);
				}}
				class="join-item btn">»</button
			>
		{/if}
	</div>
</div>
