<script>
	import { ArrowUpOutline, LockOpenOutline } from 'flowbite-svelte-icons';

	const features = [
		{
			name: 'Inspiring and Fast',
			description:
				'Superapp is build on Sveltekit, TailwindCSS and MongoDb. Tools that are a joy to work with. And everything runs locally, so the speed is amazing.',

			href: '#',
			icon: ArrowUpOutline
		},
		{
			name: 'Users and roles management',
			description:
				'The hard part is done, users can be added, roles can be assigned and you can focus on the fun part of building your app.',
			href: '#',
			icon: LockOpenOutline
		},
		{
			name: 'Security',
			description:
				'Superapp is build with security in mind. We use the best practices to keep your data safe. AuthJS is used for authentication, and all your data is safely stored on a local database.',
			href: '#',
			icon: ArrowUpOutline
		},
		{
			name: 'Privacy and Analytics',
			description:
				"Privacy is very important to us, we don't like being followed around the internet and we don't want to do that to you. We only use the highest privacy respecting analytics tools.",
			icon: ArrowUpOutline
		}
	];
</script>

<div class="bg-white">
	<header class="absolute inset-x-0 top-0 z-50">
		<nav aria-label="Global" class="flex flex-row items-center justify-between p-6 lg:px-8">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">SuperApp Company</span>
				<img
					alt=""
					src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
					class="h-8 w-auto"
				/>
			</a>

			<div class="text-xl font-bold">Superapp</div>
		</nav>
	</header>

	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div
			aria-hidden="true"
			class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
		>
			<div
				style={{
					clipPath:
						'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
				}}
				class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			></div>
		</div>
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="hidden sm:mb-8 sm:flex sm:justify-center">
				<div
					class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
				>
					Wonderful template to build apps fast.
					<a href="/" class="font-semibold text-indigo-600">
						<span aria-hidden="true" class="absolute inset-0"></span>
						Read more <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
			<div class="text-center">
				<h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
					Build fast, Build beautiful, Build anything
				</h1>
				<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
					The time from idea to proof of concept is shorter than ever. Save up to 90% in time and
					resources!
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/"
						class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Get started
					</a>
					<a href="/" class="text-sm/6 font-semibold text-gray-900">
						Learn more <span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-base/7 font-semibold text-indigo-600">Create faster</h2>
			<p
				class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance"
			>
				Speed, reliability, and simplicity
			</p>
			<p class="mt-6 text-lg/8 text-gray-600">
				Everything you need to build fast and show your idea to the world! Based on trusted
				technologies and proven methods. Using the best in class tools and services.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
			<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
				{#each features as feature (feature.name)}
					<div class="flex flex-col">
						<dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
							<feature.icon aria-hidden="true" class="size-5 flex-none text-indigo-600" />
							{feature.name}
						</dt>
						<dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
							<p class="flex-auto">{feature.description}</p>
							<p class="mt-6">
								<a href={feature.href} class="text-sm/6 font-semibold text-indigo-600">
									Learn more <span aria-hidden="true">→</span>
								</a>
							</p>
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</div>

<footer class="bg-gray-900">
	<div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
		<p class="mt-8 text-center text-sm/6 text-gray-400 md:order-1 md:mt-0">
			&copy; 2025 Albert Sikkema
		</p>
	</div>
</footer>
