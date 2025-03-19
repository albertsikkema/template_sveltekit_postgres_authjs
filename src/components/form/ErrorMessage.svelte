<script>
	export let inputErrors;
</script>

{#if inputErrors && Object.keys(inputErrors).length > 0}
	<div class="flex flex-col gap-2">
			<div role="alert" class="alert alert-warning w-full">
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
				<!-- inputErrors is an {} with key and value, show both -->
				 <!-- make sure key starts with uppercase -->
				{#each Object.entries(inputErrors) as [key, value]}
				<p>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>
				{/each}
			</div>
	</div>
{/if}
