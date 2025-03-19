<script>
	export let inputKey;
	export let inputValue = '';
	export let maxLength = 50;
	export let minLength = 0;
	export let inputType = 'text';
	export let requiredInput = true;
	export let disabled = false;
	export let errorMessage = '';
</script>

<div class="flex w-full flex-row items-center justify-between">
	<div class="justify start flex flex-row items-center gap-2">
		<span>{inputKey}</span>
		<span class="text-sm">{requiredInput ? ' (required)' : ''} </span>
	</div>
	<span class="text-sm font-bold"> {inputValue.length}/{maxLength}</span>
</div>

<input
	class="input validator w-full"
	type={inputType}
	name={inputKey.toLowerCase()}
	required={requiredInput}
	placeholder="Enter {inputKey.toLowerCase()}..."
	bind:value={inputValue}
	minlength={minLength}
	{disabled}
	{maxLength}
	{...inputType !== 'email' ? { pattern: '[A-Za-z0-9\\- ]*' } : {}}
/>

<p class="validator-hint hidden">
	{#if errorMessage}
		- {errorMessage}<br />
	{/if}
	{#if requiredInput}
		- Required field<br />
	{/if}
	{#if minLength > 0}
		- At least {minLength} characters<br />
	{/if}
	- No more than {maxLength} characters<br />
	{#if inputType === 'email'}
		- Must be a valid email address<br />
	{:else}
		- Only letters, numbers, or dash.
	{/if}
</p>
