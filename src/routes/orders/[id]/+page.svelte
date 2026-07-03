<script>
	import { page } from '$app/stores';
	import { getOrder } from '$lib/firestore';
	import { authStore, toastStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		ChevronLeft,
		Calendar,
		FileText,
		MapPin,
		Truck,
		CheckCircle2,
		ShieldAlert
	} from 'lucide-svelte';

	let orderId = $derived($page.params.id);
	let order = $state(null);
	let loading = $state(true);
	let errorMsg = $state('');

	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.user) {
				goto('/login');
			} else if (orderId) {
				loadOrder(orderId);
			}
		}
	});

	async function loadOrder(id) {
		loading = true;
		errorMsg = '';
		try {
			order = await getOrder(id);
			// Security check: only allow order owner or admins to view receipt
			if (order.userId !== authStore.user.uid && authStore.user.role !== 'admin') {
				throw new Error('Access denied. This receipt belongs to another user.');
			}
		} catch (err) {
			console.error(err);
			errorMsg = err.message || 'Invoice not found.';
		} finally {
			loading = false;
		}
	}

	const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
	const stepIdx = $derived(steps.indexOf(order?.status));

	const statusColors = {
		Pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
		Processing: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
		Shipped: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
		Delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
		Cancelled: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
	};
</script>

<svelte:head>
	<title>Order Invoice #{orderId?.substr(0, 8)} | MobiShop</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<!-- Navigation Header -->
	<a
		href="/orders"
		class="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" />
		<span>Back to Purchases</span>
	</a>

	{#if loading}
		<div class="flex items-center justify-center min-h-[50vh]">
			<Spinner size="lg" />
		</div>
	{:else if errorMsg}
		<div
			class="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
		>
			<ShieldAlert class="w-12 h-12 text-rose-500 mx-auto mb-4" />
			<p class="text-lg font-bold text-zinc-800 dark:text-zinc-200">Unauthorized Access</p>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{errorMsg}</p>
		</div>
	{:else}
		<!-- Digital Invoice layout -->
		<div class="space-y-8">
			<!-- Order Header Sheet -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-6"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<FileText class="w-5 h-5 text-violet-500" />
						<span class="text-xs font-bold text-zinc-400 uppercase tracking-widest"
							>Digital Invoice</span
						>
					</div>
					<h1 class="text-xl font-bold text-zinc-900 dark:text-white font-mono mt-1">
						ID: {order.id}
					</h1>
					<p class="text-xs text-zinc-500">
						Date: {new Date(order.orderDate).toLocaleString('en-US', {
							dateStyle: 'long',
							timeStyle: 'short'
						})}
					</p>
				</div>

				<div class="self-start sm:self-center">
					<span
						class="inline-flex items-center px-4.5 py-1.5 rounded-full text-sm font-semibold border {statusColors[
							order.status
						]}"
					>
						{order.status}
					</span>
				</div>
			</div>

			<!-- Status Tracker Timeline Visualizer (Omit if Cancelled) -->
			{#if order.status !== 'Cancelled'}
				<div
					class="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-6"
				>
					<h2 class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
						Tracking Timeline
					</h2>

					<!-- Timeline graphics -->
					<div class="relative flex items-center justify-between">
						<!-- Timeline line connector -->
						<div class="absolute left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-0"></div>

						<!-- Timeline active filler line -->
						<div
							class="absolute left-0 h-1 bg-violet-600 transition-all duration-500 z-0"
							style="width: {stepIdx >= 0 ? (stepIdx / (steps.length - 1)) * 100 : 0}%"
						></div>

						{#each steps as step, idx}
							<div class="flex flex-col items-center relative z-10">
								<div
									class="w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300
										{idx <= stepIdx
										? 'bg-violet-600 border-violet-600 dark:bg-violet-500 dark:border-violet-500 text-white shadow-md shadow-violet-500/20'
										: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'}"
								>
									{#if idx <= stepIdx}
										<CheckCircle2 class="w-4 h-4" />
									{:else}
										<span class="text-xs font-bold">{idx + 1}</span>
									{/if}
								</div>
								<span
									class="text-xxs font-bold mt-2 transition-colors uppercase tracking-wider
										{idx <= stepIdx ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400 dark:text-zinc-500'}"
								>
									{step}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Itemized Details & Address info -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
				<!-- Receipt Items (Left columns) -->
				<div
					class="md:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4"
				>
					<h2
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800/80 pb-3 mb-2"
					>
						Itemized details
					</h2>

					<div class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
						{#each order.products as item}
							<div class="flex items-center gap-4 py-3.5">
								<!-- Mini image -->
								<div
									class="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800/30 flex items-center justify-center flex-shrink-0"
								>
									<img
										src={item.imageUrl}
										alt={item.name}
										class="max-w-[80%] max-h-[80%] object-contain"
									/>
								</div>
								<!-- Details -->
								<div class="flex-grow min-w-0">
									<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
										{item.name}
									</p>
									<p class="text-xxs text-zinc-400 mt-0.5">
										₹{item.price.toLocaleString('en-IN')} &times; {item.quantity}
									</p>
								</div>
								<!-- Subtotal -->
								<span class="font-bold text-sm text-zinc-800 dark:text-zinc-200">
									₹{(item.price * item.quantity).toLocaleString('en-IN')}
								</span>
							</div>
						{/each}
					</div>

					<!-- Invoice totals -->
					<div
						class="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 space-y-2.5 text-xs text-zinc-500"
					>
						<div class="flex justify-between">
							<span>Subtotal</span>
							<span class="font-semibold text-zinc-800 dark:text-zinc-200"
								>₹{order.products
									.reduce((acc, p) => acc + p.price * p.quantity, 0)
									.toLocaleString('en-IN')}</span
							>
						</div>
						<div
							class="flex justify-between border-t border-zinc-100 dark:border-zinc-800/40 pt-3 text-sm font-bold text-zinc-900 dark:text-white font-display"
						>
							<span>Total Paid</span>
							<span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
						</div>
					</div>
				</div>

				<!-- Shipping Coordinates (Right column) -->
				<div
					class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4"
				>
					<h2
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800/80 pb-3 mb-2 flex items-center gap-1.5"
					>
						<MapPin class="w-4 h-4 text-violet-500" />
						<span>Delivery Address</span>
					</h2>

					<div class="text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
						<p class="font-bold text-zinc-800 dark:text-zinc-200">
							{order.shippingAddress?.fullName}
						</p>
						<p class="font-mono">{order.shippingAddress?.phone}</p>
						<div class="border-t border-zinc-100 dark:border-zinc-800/40 pt-2 text-zinc-500">
							<p>{order.shippingAddress?.street}</p>
							<p>{order.shippingAddress?.city}</p>
							<p class="font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
								PIN: {order.shippingAddress?.zipCode}
							</p>
						</div>
					</div>

					<div
						class="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex items-center gap-2 text-xxs text-zinc-400 dark:text-zinc-500"
					>
						<Truck class="w-4 h-4 text-violet-500" />
						<span>Shipped with insured delivery courier.</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
