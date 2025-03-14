<script>
	export let inputKey = 'Active';
	export let inputValue = true;
</script>

<label class="fieldset-label">
	<input type="checkbox" name={inputKey.toLowerCase()} bind:checked={inputValue} class="checkbox" />
	<span>{inputKey}</span>
</label>
