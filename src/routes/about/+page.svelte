<script>
	import { Award } from 'lucide-svelte';
</script>

<svelte:head>
	<title>About Us | MobiShop</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Hero Header -->
	<div class="text-center mb-16">
		<span
			class="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-600/10 px-3 py-1 rounded-full"
			>MCA Student Project</span
		>
		<h1
			class="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white mt-4"
		>
			About <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">MobiShop</span>
		</h1>
		<p class="text-md sm:text-lg text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed">
			A state-of-the-art Mobile Shopping System built as a collaborative <strong>4-member team project</strong> by <strong>MCA (Master of Computer Applications)</strong> students at <strong>Sona College of Technology</strong>.
		</p>
	</div>

	<!-- Content Cards -->
	<div class="space-y-12">
		<!-- Section 1: Project Overview -->
		<div
			class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs"
		>
			<div class="flex items-center gap-3 mb-4">
				<Award class="w-6 h-6 text-violet-600 dark:text-violet-400" />
				<h2 class="text-2xl font-bold font-display text-zinc-900 dark:text-white">
					Project Vision & Overview
				</h2>
			</div>
			<p class="text-zinc-600 dark:text-zinc-300 leading-relaxed">
				This application has been developed to demonstrate full-stack capabilities, showcasing real-time data flow, role-based admin administration, and robust user session handling. By using Svelte 5 and Firebase, we created a lightning-fast shop application that simulates both cloud mode and mock offline local storage mode.
			</p>
			<p class="text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4">
				The primary focus was to build a secure, scalable, and responsive application addressing actual constraints faced by modern retail solutions, including low latency, seamless catalog rendering, and instant state reactivity.
			</p>
		</div>

	</div>
</div>
