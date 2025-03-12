<script>
	export let inputKey = 'Label'; // Default key (label)
	export let inputValue = '';
	export let maxLength = 300;
	export let minLength = 0;
</script>

<div class="flex w-full flex-row items-center justify-between">
	<span>{inputKey} </span>
	<span class="text-sm font-bold"> {inputValue.length}/{maxLength}</span>
</div>

	<textarea
		class="textarea validator h-24 w-full"
		name={inputKey.toLowerCase()}
		placeholder="Enter {inputKey.toLowerCase()}..."
		bind:value={inputValue}
		minlength={minLength}
		{maxLength}
		pattern="[A-Za-z0-9\- ]*"
	></textarea>


<p class="validator-hint hidden">
	{#if minLength > 0}
		- At least {minLength} characters<br />
	{/if}
	- No more than {maxLength} characters<br />
	- Only letters, numbers, or dash.
</p>
