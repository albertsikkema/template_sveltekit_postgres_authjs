<script lang="js">
	import '../app.css';
	let { children } = $props();

import {Toasts, toast} from 'svoast'

function showToastMessage(message) {
	toast.success(message)
}

</script>


<Toasts position='top-right'/>



<div class=" flex min-h-screen min-w-screen flex-col items-center justify-center">
	<div class="container mx-auto w-full max-w-5xl">
		{@render children()}
	</div>
</div>
