<script>
	export let inputKey;
	export let inputValue = '';
	export let options = options || {};
</script>

<div class="flex w-full flex-row items-center justify-between">
	<span>{inputKey}</span>
</div>

<select class="select select-bordered w-full" name={inputKey.toLowerCase()} bind:value={inputValue}>
	{#each Object.keys(options) as option}
		<option value={option}>{options[option]}</option>
	{/each}
</select>
