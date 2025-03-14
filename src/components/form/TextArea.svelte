<script>
	import { onMount } from 'svelte';

	export let inputKey = 'Label';
	export let inputValue = '';
	export let maxLength = 300;
	export let minLength = 0;

	// Regular expression that matches any character NOT allowed:
	// Allowed: uppercase letters, lowercase letters, digits, hyphen, and space.
	const disallowedRegex = /[^A-Za-z0-9\- ]/g;

	// Reference to the textarea element
	let textarea;

	// Validate the input value and use the validity API to mark the textarea as invalid if necessary.
	function validateChars(value) {
		if (disallowedRegex.test(value)) {
			textarea.setCustomValidity('Illegal characters detected.');
		} else {
			textarea.setCustomValidity('');
		}
	}

	// onMount will run only on the client, where document is defined.
	onMount(() => {
		// Validate initial value, if any.
		textarea = document.querySelector('.textarea');
	});
</script>

<div class="flex w-full flex-row items-center justify-between">
	<span>{inputKey}</span>
	<span class="text-sm font-bold">{inputValue.length}/{maxLength}</span>
</div>

<textarea
	bind:this={textarea}
	class="textarea validator h-24 w-full"
	name={inputKey.toLowerCase()}
	placeholder="Enter {inputKey.toLowerCase()}..."
	bind:value={inputValue}
	minlength={minLength}
	on:change={() => validateChars(inputValue)}
	on:blur={() => validateChars(inputValue)}
	{maxLength}
>
</textarea>

<!-- Validator hint is now always visible -->
<p class="validator-hint hidden">
	{#if minLength > 0}
		- At least {minLength} characters<br />
	{/if}
	- No more than {maxLength} characters<br />
	- Only letters, numbers, or dash.
</p>
