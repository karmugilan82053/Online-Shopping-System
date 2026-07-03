<script>
	import { authStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		LayoutDashboard,
		Smartphone,
		ShoppingBag,
		Users,
		Home,
		Menu,
		X,
		ShieldAlert
	} from 'lucide-svelte';

	let { children } = $props();
	let isSidebarOpen = $state(false);

	// Protect route: redirect to login if user is not admin
	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.user) {
				goto('/login');
			} else if (authStore.user.role !== 'admin') {
				goto('/');
			}
		}
	});
</script>

<div
	class="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300"
>
	{#if authStore.loading || !authStore.user || authStore.user.role !== 'admin'}
		<div class="flex-grow flex items-center justify-center min-h-[70vh]">
			<Spinner size="lg" />
		</div>
	{:else}
		<!-- Mobile Admin Header -->
		<header
			class="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
		>
			<div class="flex items-center gap-2">
				<ShieldAlert class="w-5 h-5 text-violet-600 dark:text-violet-400" />
				<span class="font-bold text-sm tracking-tight text-zinc-900 dark:text-white uppercase"
					>Admin Console</span
				>
			</div>
			<button
				onclick={() => (isSidebarOpen = !isSidebarOpen)}
				class="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
				aria-label="Toggle sidebar"
			>
				{#if isSidebarOpen}
					<X class="w-6 h-6" />
				{:else}
					<Menu class="w-6 h-6" />
				{/if}
			</button>
		</header>

		<!-- Sidebar Navigation (Desktop & Mobile drawer) -->
		<aside
			class="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col flex-shrink-0 transition-all duration-300 md:block
				{isSidebarOpen ? 'block' : 'hidden'}"
		>
			<!-- Top Header -->
			<div
				class="p-6 border-b border-zinc-100 dark:border-zinc-800/80 hidden md:flex items-center gap-2"
			>
				<ShieldAlert class="w-5 h-5 text-violet-600 dark:text-violet-400" />
				<span class="font-bold font-display tracking-tight text-zinc-900 dark:text-white text-base"
					>Admin Console</span
				>
			</div>

			<!-- Sidebar Links -->
			<nav class="p-4 space-y-1.5 flex-grow">
				<a
					href="/admin/dashboard"
					onclick={() => (isSidebarOpen = false)}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
				>
					<LayoutDashboard class="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
					<span>Overview</span>
				</a>

				<a
					href="/admin/products"
					onclick={() => (isSidebarOpen = false)}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
				>
					<Smartphone class="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
					<span>Mobiles</span>
				</a>

				<a
					href="/admin/orders"
					onclick={() => (isSidebarOpen = false)}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
				>
					<ShoppingBag class="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
					<span>Orders</span>
				</a>

				<a
					href="/admin/users"
					onclick={() => (isSidebarOpen = false)}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
				>
					<Users class="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
					<span>Users</span>
				</a>

				<div class="border-t border-zinc-100 dark:border-zinc-800/80 my-4 pt-4">
					<a
						href="/"
						onclick={() => (isSidebarOpen = false)}
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
					>
						<Home class="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
						<span>Storefront</span>
					</a>
				</div>
			</nav>

			<!-- Quick user profile info -->
			<div
				class="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10"
			>
				<p class="text-xxs text-zinc-400 uppercase font-bold tracking-widest">Logged in admin</p>
				<p class="text-xs font-bold text-zinc-700 dark:text-zinc-200 truncate mt-1">
					{authStore.user?.name}
				</p>
			</div>
		</aside>

		<!-- Subpage Wrapper -->
		<main class="flex-grow p-6 sm:p-8 md:p-10 overflow-y-auto">
			{@render children()}
		</main>
	{/if}
</div>
