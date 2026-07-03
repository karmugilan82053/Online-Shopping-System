<script>
	import { subscribeToOrders } from '$lib/firestore';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ShoppingBag, ChevronRight, Search, Calendar, AlertTriangle } from 'lucide-svelte';

	let orders = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');

	// Pagination
	let currentPage = $state(1);
	const itemsPerPage = 8;

	let unsubscribe;
	$effect(() => {
		unsubscribe = subscribeToOrders(null, (data) => {
			orders = data;
			loading = false;
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	// Filters
	const filteredOrders = $derived(
		orders.filter(
			(o) =>
				o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const paginatedOrders = $derived(
		filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredOrders.length / itemsPerPage) || 1);

	$effect(() => {
		searchQuery;
		currentPage = 1;
	});

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
	<title>Manage Orders | Admin MobiShop</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div>
		<h1
			class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
		>
			<ShoppingBag class="w-7 h-7 text-violet-600 dark:text-violet-400" />
			<span>Manage Customer Orders</span>
		</h1>
		<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
			Review orders, modify processing timelines, and track deliveries
		</p>
	</div>

	<!-- Controls & search -->
	<div
		class="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4"
	>
		<div class="relative w-full sm:w-80">
			<span
				class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none"
			>
				<Search class="w-4 h-4" />
			</span>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search ID, customer, email..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all shadow-xs"
			/>
		</div>

		<div class="text-xxs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
			Total Count: {filteredOrders.length}
		</div>
	</div>

	<!-- Table Panel -->
	<div
		class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
	>
		{#if loading}
			<div class="flex items-center justify-center py-20">
				<Spinner size="lg" />
			</div>
		{:else if filteredOrders.length === 0}
			<div class="text-center py-16 p-8 max-w-sm mx-auto">
				<AlertTriangle class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
				<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No orders cataloged</p>
				<p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
					We couldn't find any orders matching the parameters.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse text-xs">
					<thead>
						<tr
							class="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-xxs uppercase tracking-wider font-bold"
						>
							<th class="p-4">Order ID</th>
							<th class="p-4">Customer</th>
							<th class="p-4">Date</th>
							<th class="p-4">Total Amount</th>
							<th class="p-4">Status</th>
							<th class="p-4 text-center">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
						{#each paginatedOrders as order (order.id)}
							<tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors">
								<!-- ID -->
								<td class="p-4 font-mono font-semibold text-zinc-800 dark:text-zinc-200"
									>{order.id}</td
								>
								<!-- Customer -->
								<td class="p-4">
									<p class="font-semibold text-zinc-800 dark:text-zinc-200">{order.customerName}</p>
									<p class="text-xxs text-zinc-400 font-mono mt-0.5">{order.customerEmail}</p>
								</td>
								<!-- Date -->
								<td class="p-4 text-zinc-500">
									<div class="flex items-center gap-1">
										<Calendar class="w-3.5 h-3.5 text-zinc-400" />
										<span
											>{new Date(order.orderDate).toLocaleDateString('en-US', {
												dateStyle: 'short'
											})}</span
										>
									</div>
								</td>
								<!-- Total -->
								<td class="p-4 font-bold text-zinc-900 dark:text-white font-display"
									>₹{order.totalAmount?.toLocaleString('en-IN')}</td
								>
								<!-- Status -->
								<td class="p-4">
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border text-xxs {statusColors[
											order.status
										]}"
									>
										{order.status}
									</span>
								</td>
								<!-- Action -->
								<td class="p-4 text-center">
									<a
										href="/admin/orders/{order.id}"
										class="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors font-semibold"
									>
										<span>Edit Status</span>
										<ChevronRight class="w-3.5 h-3.5" />
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination controls -->
			{#if totalPages > 1}
				<div
					class="p-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center gap-4 text-xs font-semibold"
				>
					<button
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						class="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-zinc-600 dark:text-zinc-300"
					>
						Prev
					</button>
					<span class="text-zinc-500">Page {currentPage} of {totalPages}</span>
					<button
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						class="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-zinc-600 dark:text-zinc-300"
					>
						Next
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
