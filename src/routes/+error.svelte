<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '../app.css';

	const messageList404 = [
		'no idea how you got here... you must be lost.',
		'do you need help to find the way back, or do you want to stay here for a while?',
		'it is nice and quiet here. maybe take some time, just stare at the screen.',
		'does it help? do you feel rested? ',
		'then get back to work, you lazy ****! or should i call yoda to give you a pep talk from a galaxy far, far away?',
		'just kidding, we love you... but seriously, the force is strong with this procrastination.',
		'you know, the last person who stayed here too long was abducted by aliens. be careful!',
		'don’t worry, even r2d2 needs a break sometimes. but unlike him, youre not getting paid for it, are you?',
		'life is like a lightsaber: sometimes it cuts, and if you’re not careful, it just might slice your hopes of finishing this project.',
		'keep calm and pretend this is all part of a galactic plan. trust that your alien overlords know what they’re doing!',
		'seriously, if a bunch of ewoks can defeat an empire, surely you can conquer this task and save the galaxy.',
		'if you’re channeling your inner extraterrestrial, maybe you should go home and let the aliens take over for a while.',
		'are you sure you’re not part of an alien experiment? these feelings of confusion could say otherwise!',
		'remember: if aliens land, tell them the humans are currently occupied with “important” work.'
	];

	const messageList500 = [
		'whoops! the server just had a meltdown... it’s taking a little time to cool off.',
		'the server is feeling under the weather — like it’s been abducted by aliens on a bad day.',
		'our server’s on a break, probably taking a moment to sort its existential crisis.',
		'is it just me, or does the server need a coffee break? let’s give it a minute!',
		'looks like the server tripped on a lightsaber and fell into a black hole. it’ll be back soon!',
		'the server is currently negotiating with extraterrestrial beings. hang tight!',
		'uh-oh! seems like the server ran into some cosmic traffic. please wait while it finds a detour.',
		'our server appears to be in an alternate dimension where everything is confusing. it’s working on getting back.',
		'the server is meditating right now, aligning its energy with the universe. let’s give it some space!',
		'don’t worry, the server is just going through a phase. it’ll return calmer and wiser.',
		'if this is an alien conspiracy, it’s working. our server has gone rogue and is contemplating the meaning of life.',
		'while the server sorts things out, maybe take this opportunity to ponder your own existence too?',
		'in the meantime, try not to panic. even servers need “me time” every now and then!',
		'Something went horribly wrong, but we have a team of highly trained monkeys, ready to make it even worse'
	];

	let currentId404 = 0;
	let currentMessage404 = messageList404[currentId404]; // start with the first message
	let currentMessage500 = messageList500[Math.floor(Math.random() * messageList500.length)]; // start with the first message

	onMount(() => {
		const interval = setInterval(() => {
			//   currentMessage = messageList[Math.floor(Math.random() * messageList.length)];
			currentId404 = currentId404 + 1;
			currentMessage404 = messageList404[currentId404];

			if (currentId404 >= messageList404.length - 1) {
				currentId404 = 0;
			}
		}, 5000); // change message every 5 seconds

		return () => clearInterval(interval); // cleanup on component destroy
	});
</script>

<div
	class="mx-auto mt-24 flex h-screen max-w-3xl
flex-col items-center"
>
	{#if $page.status === 404}
		<h1 class="text-2xl">{$page.status} -Page Not Found.</h1>
		<p class="mt-6">{currentMessage404}</p>
	{:else}
		<h1 class="h1">{$page.status} - Unexpected Error</h1>
		<h3 class="mt-6">{currentMessage500}</h3>
		<p class="mt-6">Please try again later.</p>
	{/if}

	{#if $page.error?.errorId}
		<p class="mt-6">Error ID: {$page.error.errorId}</p>
	{/if}
</div>
