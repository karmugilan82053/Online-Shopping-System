<script>
	import { authStore } from '$lib/store';
	import { subscribeToOrders } from '$lib/firestore';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ShoppingBag, ChevronRight, Smartphone, Calendar, CreditCard } from 'lucide-svelte';

	let orders = $state([]);
	let loading = $state(true);

	// Guard route and subscribe
	let unsubscribe;
	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.user) {
				goto('/login');
			} else {
				unsubscribe = subscribeToOrders(authStore.user.uid, (data) => {
					orders = data;
					loading = false;
				});
			}
		}

		return () => {
			if (unsubscribe) unsubscribe();
		};
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
	<title>My Orders | MobiShop</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
		<ShoppingBag class="w-8 h-8 text-violet-600 dark:text-violet-400" />
		<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
			Order History
		</h1>
	</div>

	{#if loading}
		<div class="flex items-center justify-center min-h-[40vh]">
			<Spinner size="lg" />
		</div>
	{:else if orders.length === 0}
		<!-- Empty Orders Box -->
		<div
			class="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
		>
			<ShoppingBag class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
			<p class="text-lg font-bold text-zinc-800 dark:text-zinc-200">No purchases found</p>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
				You haven't ordered any smartphones yet. Start exploring now!
			</p>
			<a
				href="/products"
				class="mt-6 inline-block px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700"
			>
				Browse Catalog
			</a>
		</div>
	{:else}
		<!-- Orders List -->
		<div class="space-y-4">
			{#each orders as order (order.id)}
				<div
					class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow"
				>
					<div
						class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-4"
					>
						<!-- ID & Date -->
						<div>
							<p class="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Order ID</p>
							<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5">
								{order.id}
							</p>
							<div class="flex items-center gap-1.5 text-xxs text-zinc-500 mt-1">
								<Calendar class="w-3.5 h-3.5" />
								<span
									>{new Date(order.orderDate).toLocaleDateString('en-US', {
										dateStyle: 'medium'
									})}</span
								>
							</div>
						</div>

						<!-- Status pill & Detail CTA -->
						<div class="flex items-center gap-3 self-start sm:self-center">
							<span
								class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border {statusColors[
									order.status
								] || 'bg-zinc-100'}"
							>
								{order.status}
							</span>
							<a
								href="/orders/{order.id}"
								class="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
							>
								<span>Invoice</span>
								<ChevronRight class="w-4 h-4" />
							</a>
						</div>
					</div>

					<!-- Order items preview list -->
					<div class="flex flex-wrap gap-4 items-center justify-between">
						<div class="flex items-center gap-3">
							<!-- Stacked mini thumbnails -->
							<div class="flex -space-x-4 overflow-hidden pr-2">
								{#each order.products.slice(0, 3) as item}
									<div
										class="inline-block w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center"
									>
										<img
											src={item.imageUrl ||
												'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
											alt={item.name}
											class="max-w-[75%] max-h-[75%] object-contain"
										/>
									</div>
								{/each}
							</div>

							<div class="text-xs">
								<p class="font-semibold text-zinc-800 dark:text-zinc-200">
									{order.products[0]?.name}
									{#if order.products.length > 1}
										<span>and {order.products.length - 1} other model(s)</span>
									{/if}
								</p>
								<p class="text-zinc-400">
									Total Quantity: {order.products.reduce((acc, p) => acc + p.quantity, 0)}
								</p>
							</div>
						</div>

						<!-- Final Total Paid -->
						<div>
							<p class="text-xxs uppercase tracking-wider text-zinc-400 font-bold text-right">
								Paid
							</p>
							<p class="text-lg font-bold text-zinc-900 dark:text-white font-display mt-0.5">
								₹{order.totalAmount?.toLocaleString('en-IN')}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
