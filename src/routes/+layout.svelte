<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { isUsingMock } from '$lib/firebase';
	import { AlertTriangle, Database, ArrowRight, X } from 'lucide-svelte';

	let { children } = $props();
	let showMockBanner = $state(true);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>MobiShop - Premium Mobile Shopping System</title>
</svelte:head>

<div
	class="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300"
>
	<!-- Dual-Mode Database Status Banner -->
	{#if isUsingMock && showMockBanner}
		<div
			class="bg-violet-600/10 border-b border-violet-500/20 text-violet-700 dark:text-violet-300 px-4 py-2.5 text-center text-xs font-medium flex items-center justify-center gap-2 relative"
		>
			<Database class="w-4 h-4 text-violet-500 animate-pulse flex-shrink-0" />
			<span>
				Running in <strong>Offline Simulator Mode</strong>. Sign in using
				<code class="px-1.5 py-0.5 bg-violet-600/20 rounded font-mono text-zinc-900 dark:text-white"
					>admin@mobile.com</code
				>
				/
				<code class="px-1.5 py-0.5 bg-violet-600/20 rounded font-mono text-zinc-900 dark:text-white"
					>admin123</code
				>.
			</span>
			<button
				onclick={() => (showMockBanner = false)}
				class="absolute right-3 p-1 hover:bg-violet-500/10 rounded-lg transition-colors text-current"
				aria-label="Dismiss banner"
			>
				<X class="w-3.5 h-3.5" />
			</button>
		</div>
	{/if}

	<!-- Header Navbar -->
	<Navbar />

	<!-- Main Content Area -->
	<main class="flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<Footer />

	<!-- Toast Notifications container -->
	<Toast />
</div>
