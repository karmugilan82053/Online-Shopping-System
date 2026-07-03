<script>
	import { page } from '$app/stores';
	import { getOrder, updateOrderStatus } from '$lib/firestore';
	import { toastStore } from '$lib/store';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ChevronLeft, Save, MapPin, Smartphone, FileText, Calendar } from 'lucide-svelte';

	let orderId = $derived($page.params.id);
	let order = $state(null);
	let loading = $state(true);
	let isSaving = $state(false);

	let statusSelection = $state('Pending');

	$effect(() => {
		if (orderId) {
			loadOrder(orderId);
		}
	});

	async function loadOrder(id) {
		loading = true;
		try {
			order = await getOrder(id);
			statusSelection = order.status;
		} catch (error) {
			toastStore.show('Failed to load order information.', 'error');
		} finally {
			loading = false;
		}
	}

	async function handleUpdateStatus(e) {
		e.preventDefault();
		isSaving = true;
		try {
			await updateOrderStatus(orderId, statusSelection);
			toastStore.show('Order status updated successfully!', 'success');
			order.status = statusSelection; // Update local display
		} catch (error) {
			toastStore.show('Failed to update order status.', 'error');
		} finally {
			isSaving = false;
		}
	}

	const statusColors = {
		Pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
		Processing: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
		Shipped: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
		Delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
		Cancelled: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
	};
</script>

<svelte:head>
	<title>Edit Order Status #{orderId?.substr(0, 8)} | MobiShop</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Back Breadcrumb -->
	<a
		href="/admin/orders"
		class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" />
		<span>Back to Orders List</span>
	</a>

	<!-- Header -->
	<div>
		<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
			Update Order Status
		</h1>
		<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
			Review transaction details and update shipping milestones
		</p>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if order}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
			<!-- Left Details (Items & Customer Details) -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Order Summary Sheet -->
				<div
					class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
				>
					<div>
						<div class="flex items-center gap-2 text-zinc-400">
							<FileText class="w-4 h-4 text-violet-500" />
							<span class="text-xxs font-bold uppercase tracking-widest">Order Details</span>
						</div>
						<h2 class="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-250 mt-1">
							ID: {order.id}
						</h2>
						<div class="flex items-center gap-1.5 text-xxs text-zinc-500 mt-1">
							<Calendar class="w-3.5 h-3.5" />
							<span
								>{new Date(order.orderDate).toLocaleString('en-US', {
									dateStyle: 'medium',
									timeStyle: 'short'
								})}</span
							>
						</div>
					</div>

					<div>
						<span
							class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border {statusColors[
								order.status
							]}"
						>
							{order.status}
						</span>
					</div>
				</div>

				<!-- Items Table -->
				<div
					class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4"
				>
					<h3
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2"
					>
						Purchased Items
					</h3>
					<div class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
						{#each order.products as item}
							<div class="flex items-center gap-4 py-3">
								<div
									class="w-10 h-10 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden flex-shrink-0"
								>
									<img
										src={item.imageUrl}
										alt={item.name}
										class="max-w-[80%] max-h-[80%] object-contain"
									/>
								</div>
								<div class="flex-grow min-w-0">
									<p class="text-xs font-semibold text-zinc-850 dark:text-zinc-200 truncate">
										{item.name}
									</p>
									<p class="text-xxs text-zinc-400">
										Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}
									</p>
								</div>
								<span class="font-bold text-xs text-zinc-800 dark:text-zinc-200">
									₹{(item.price * item.quantity).toLocaleString('en-IN')}
								</span>
							</div>
						{/each}
					</div>
					<div
						class="flex justify-between items-center text-sm font-bold text-zinc-900 dark:text-white border-t border-zinc-100 dark:border-zinc-800 pt-4 font-display"
					>
						<span>Paid Total:</span>
						<span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
					</div>
				</div>

				<!-- Shipping coordinates -->
				<div
					class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4"
				>
					<h3
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2 flex items-center gap-1.5"
					>
						<MapPin class="w-4 h-4 text-violet-500" />
						<span>Shipping Coordinates</span>
					</h3>
					<div class="text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
						<p class="font-bold text-zinc-800 dark:text-zinc-200">
							{order.shippingAddress?.fullName}
						</p>
						<p class="font-mono">{order.shippingAddress?.phone}</p>
						<div class="border-t border-zinc-100 dark:border-zinc-800/40 pt-2 text-zinc-500">
							<p>{order.shippingAddress?.street}</p>
							<p>{order.shippingAddress?.city}</p>
							<p class="font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
								ZIP: {order.shippingAddress?.zipCode}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Sidebar Controls (Status Switcher Form) -->
			<aside class="space-y-6 lg:col-span-1">
				<form
					onsubmit={handleUpdateStatus}
					class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
				>
					<h3
						class="text-base font-bold font-display text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3"
					>
						Update Status
					</h3>

					<div>
						<label for="statusSelect" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Milestone Status</label
						>
						<select
							id="statusSelect"
							bind:value={statusSelection}
							class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none cursor-pointer"
						>
							<option>Pending</option>
							<option>Processing</option>
							<option>Shipped</option>
							<option>Delivered</option>
							<option>Cancelled</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={isSaving}
						class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-xs disabled:opacity-50 transition-all hover:scale-102 cursor-pointer mt-4"
					>
						{#if isSaving}
							<span
								class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
							></span>
							<span>Saving changes...</span>
						{:else}
							<Save class="w-4 h-4" />
							<span>Update Status</span>
						{/if}
					</button>
				</form>
			</aside>
		</div>
	{/if}
</div>
