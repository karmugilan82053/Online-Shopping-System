<script>
	import { getAdminStats, getOrders } from '$lib/firestore';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		DollarSign,
		ShoppingCart,
		Smartphone,
		Users,
		ChevronRight,
		Activity
	} from 'lucide-svelte';

	let stats = $state(null);
	let recentOrders = $state([]);
	let loading = $state(true);

	$effect(() => {
		loadDashboardData();
	});

	async function loadDashboardData() {
		loading = true;
		try {
			stats = await getAdminStats();
			const allOrders = await getOrders(null);
			recentOrders = allOrders.slice(0, 5); // Fetch top 5 recent orders
		} catch (error) {
			console.error('Failed to load admin stats:', error);
		} finally {
			loading = false;
		}
	}

	const statusColors = {
		Pending:
			'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50',
		Processing:
			'bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200/50',
		Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50',
		Delivered:
			'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50',
		Cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50'
	};
</script>

<svelte:head>
	<title>Admin Dashboard | MobiShop</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Title -->
	<div>
		<h1
			class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
		>
			<Activity class="w-7 h-7 text-violet-600 dark:text-violet-400" />
			<span>Dashboard Overview</span>
		</h1>
		<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
			Platform analytics and operational summary
		</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center min-h-[40vh]">
			<Spinner size="lg" />
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Sales Card -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between"
			>
				<div>
					<p class="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
						Total Sales
					</p>
					<p class="text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
						₹{stats.totalSales?.toLocaleString('en-IN')}
					</p>
				</div>
				<div class="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
					<DollarSign class="w-6 h-6" />
				</div>
			</div>

			<!-- Orders Card -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between"
			>
				<div>
					<p class="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
						Orders Handled
					</p>
					<p class="text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
						{stats.totalOrders}
					</p>
				</div>
				<div class="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl">
					<ShoppingCart class="w-6 h-6" />
				</div>
			</div>

			<!-- Products Card -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between"
			>
				<div>
					<p class="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
						Active Mobiles
					</p>
					<p class="text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
						{stats.totalProducts}
					</p>
				</div>
				<div class="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
					<Smartphone class="w-6 h-6" />
				</div>
			</div>

			<!-- Users Card -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between"
			>
				<div>
					<p class="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
						Registered Users
					</p>
					<p class="text-2xl font-extrabold text-zinc-900 dark:text-white font-display mt-1">
						{stats.totalUsers}
					</p>
				</div>
				<div class="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
					<Users class="w-6 h-6" />
				</div>
			</div>
		</div>

		<!-- Recent Transactions Section -->
		<div
			class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-bold font-display text-zinc-900 dark:text-white">Recent Orders</h2>
				<a
					href="/admin/orders"
					class="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
				>
					<span>Manage all orders</span>
					<ChevronRight class="w-4 h-4" />
				</a>
			</div>

			{#if recentOrders.length === 0}
				<p class="text-sm text-zinc-400 py-6 text-center">
					No orders registered on the platform yet.
				</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse text-sm">
						<thead>
							<tr
								class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-xxs uppercase tracking-wider font-bold"
							>
								<th class="py-3">Order ID</th>
								<th class="py-3">Customer</th>
								<th class="py-3">Date</th>
								<th class="py-3">Total amount</th>
								<th class="py-3 text-right">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
							{#each recentOrders as order (order.id)}
								<tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
									<td class="py-4 font-mono font-medium text-zinc-800 dark:text-zinc-200"
										>{order.id}</td
									>
									<td class="py-4">
										<p
											class="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]"
										>
											{order.customerName}
										</p>
										<p class="text-xxs text-zinc-400 truncate max-w-[120px]">
											{order.customerEmail}
										</p>
									</td>
									<td class="py-4 text-zinc-500 text-xs">
										{new Date(order.orderDate).toLocaleDateString('en-US', { dateStyle: 'short' })}
									</td>
									<td class="py-4 font-bold text-zinc-900 dark:text-white font-display">
										₹{order.totalAmount?.toLocaleString('en-IN')}
									</td>
									<td class="py-4 text-right">
										<span
											class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-semibold border {statusColors[
												order.status
											]}"
										>
											{order.status}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>
