<script>
	export let inputKey = 'Images'; // Label for input
	export let maxFiles = 5; // Maximum number of files
	let multipleImages = true; // Allow multiple images

	let selectedFiles = [];
	let errorMessage = '';

	function handleFileChange(event) {
		let files = Array.from(event.target.files);

		// Validation: Only allow image files
		let validFiles = files.filter((file) => file.type.startsWith('image/'));

		if (validFiles.length !== files.length) {
			errorMessage = 'Some files are not valid images!';
		} else if (files.length > maxFiles) {
			// clear selected files
			errorMessage = `You can only upload ${maxFiles} files!`;
			// ✅ Clear file input to prevent selection beyond maxFiles
			event.target.value = '';
			selectedFiles = [];
		} else {
			errorMessage = '';
			selectedFiles = validFiles.map((file) => file.name);
		}
	}
</script>

<div class="flex w-full flex-row items-center justify-between">
	<span>{inputKey}</span>
	<span class="text-sm font-bold"> {selectedFiles.length}/{maxFiles}</span>
</div>

<div class="form-control w-full">
	<!-- File Input -->
	<input
		type="file"
		class="file-input file-input-bordered w-full"
		name="images"
		accept="image/*"
		multiple={multipleImages}
		onchange={handleFileChange}
	/>

	<!-- Error Message -->
	{#if errorMessage}
		<p class="text-error mt-1 text-sm">{errorMessage}</p>
	{/if}

	<!-- Display Selected Files -->
	{#if selectedFiles.length > 0}
		<div class="mt-3">
			<strong class="text-sm">Selected Files:</strong>
			<ul class="mt-1 list-disc pl-5 text-sm text-gray-600 dark:text-gray-200">
				{#each selectedFiles as file (file)}
					<li>{file}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
