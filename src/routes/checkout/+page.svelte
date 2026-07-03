<script>
	import { authStore, cartStore, toastStore } from '$lib/store';
	import { placeOrder } from '$lib/firestore';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ShieldCheck, ArrowRight, CreditCard, MapPin, Truck } from 'lucide-svelte';

	// Form details
	let fullName = $state('');
	let phone = $state('');
	let street = $state('');
	let city = $state('');
	let zipCode = $state('');

	// Card mock details
	let cardNumber = $state('');
	let cardExpiry = $state('');
	let cardCvv = $state('');

	let isProcessing = $state(false);

	let discountPercent = $state(0);
	let shippingCost = $state(499);

	// Guard route and read session discounts
	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.user) {
				goto('/login');
			} else if (cartStore.items.length === 0) {
				goto('/cart');
			}
		}

		if (typeof window !== 'undefined') {
			discountPercent = parseInt(localStorage.getItem('checkout_discount_percent') || '0', 10);
			shippingCost = parseInt(localStorage.getItem('checkout_shipping_cost') || '499', 10);
		}
	});

	// Calculations
	const discountAmount = $derived(Math.round(cartStore.total * (discountPercent / 100)));
	const finalTotal = $derived(cartStore.total - discountAmount + shippingCost);

	async function handleSubmit(e) {
		e.preventDefault();
		if (
			!fullName ||
			!phone ||
			!street ||
			!city ||
			!zipCode ||
			!cardNumber ||
			!cardExpiry ||
			!cardCvv
		) {
			toastStore.show('Please fill in all details.', 'error');
			return;
		}

		isProcessing = true;
		try {
			// Convert cart items list into simplified orders payload
			const productsList = cartStore.items.map((item) => ({
				productId: item.productId,
				name: item.product?.name || 'Deleted Device',
				price: item.product?.price || 0,
				quantity: item.quantity,
				imageUrl: item.product?.imageUrl || ''
			}));

			const address = { fullName, phone, street, city, zipCode };

			const orderResult = await placeOrder(
				authStore.user.uid,
				{ name: authStore.user.name, email: authStore.user.email },
				productsList,
				finalTotal,
				address
			);

			// Empty local cart
			await cartStore.clear(authStore.user.uid);

			toastStore.show('Order placed successfully!', 'success');
			goto(`/orders/${orderResult.id}`);
		} catch (err) {
			toastStore.show(err.message || 'Failed to process check out.', 'error');
		} finally {
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Checkout | MobiShop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Page Title -->
	<h1
		class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800"
	>
		Shipping & Payment
	</h1>

	{#if cartStore.loading && cartStore.items.length === 0}
		<div class="flex items-center justify-center min-h-[40vh]">
			<Spinner size="lg" />
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
			<!-- Form Inputs (Left side) -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Shipping Form -->
				<div
					class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
				>
					<h2
						class="text-lg font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2 mb-2"
					>
						<MapPin class="w-5 h-5 text-violet-500" />
						<span>Shipping Address</span>
					</h2>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="sm:col-span-2">
							<label for="fullName" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>Full Name *</label
							>
							<input
								type="text"
								id="fullName"
								bind:value={fullName}
								required
								placeholder="Recipient Full Name"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div>
							<label for="phone" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>Phone Number *</label
							>
							<input
								type="tel"
								id="phone"
								bind:value={phone}
								required
								placeholder="Contact Mobile Number"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div>
							<label for="zipCode" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>ZIP / Postal Code *</label
							>
							<input
								type="text"
								id="zipCode"
								bind:value={zipCode}
								required
								placeholder="6-digit ZIP code"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div class="sm:col-span-2">
							<label for="street" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>Street Address *</label
							>
							<input
								type="text"
								id="street"
								bind:value={street}
								required
								placeholder="House/Apartment Number, Street name"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div class="sm:col-span-2">
							<label for="city" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>City & State *</label
							>
							<input
								type="text"
								id="city"
								bind:value={city}
								required
								placeholder="City, State"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>
					</div>
				</div>

				<!-- Payment Form -->
				<div
					class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
				>
					<h2
						class="text-lg font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2 mb-2"
					>
						<CreditCard class="w-5 h-5 text-violet-500" />
						<span>Card Payment (Simulation)</span>
					</h2>

					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div class="sm:col-span-3">
							<label
								for="cardNumber"
								class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>Card Number *</label
							>
							<input
								type="text"
								id="cardNumber"
								bind:value={cardNumber}
								required
								placeholder="4111 2222 3333 4444"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div class="sm:col-span-2">
							<label
								for="cardExpiry"
								class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>Expiry Date *</label
							>
							<input
								type="text"
								id="cardExpiry"
								bind:value={cardExpiry}
								required
								placeholder="MM/YY"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div>
							<label for="cardCvv" class="block text-xs font-semibold text-zinc-500 uppercase mb-2"
								>CVV *</label
							>
							<input
								type="password"
								id="cardCvv"
								bind:value={cardCvv}
								required
								placeholder="•••"
								maxlength="3"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Summary & Place Order (Right side) -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 lg:col-span-1"
			>
				<h2 class="text-xl font-bold font-display text-zinc-900 dark:text-white">
					Review Purchase
				</h2>

				<div class="space-y-4 max-h-56 overflow-y-auto pr-1">
					{#each cartStore.items as item}
						<div class="flex justify-between items-center gap-3 text-xs">
							<div class="min-w-0">
								<p class="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
									{item.product?.name}
								</p>
								<p class="text-zinc-400">Qty: {item.quantity}</p>
							</div>
							<span class="font-bold text-zinc-800 dark:text-zinc-200">
								₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
							</span>
						</div>
					{/each}
				</div>

				<div class="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 space-y-3 text-sm">
					<div class="flex justify-between text-zinc-600 dark:text-zinc-400">
						<span>Cart Subtotal</span>
						<span>₹{cartStore.total?.toLocaleString('en-IN')}</span>
					</div>

					{#if discountPercent > 0}
						<div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
							<span>Discount ({discountPercent}%)</span>
							<span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
						</div>
					{/if}

					<div class="flex justify-between text-zinc-600 dark:text-zinc-400">
						<span>Delivery Fee</span>
						{#if shippingCost === 0}
							<span class="text-emerald-500 font-bold uppercase text-xs">Free</span>
						{:else}
							<span>₹{shippingCost.toLocaleString('en-IN')}</span>
						{/if}
					</div>

					<div
						class="flex justify-between text-base font-bold text-zinc-900 dark:text-white border-t border-zinc-100 dark:border-zinc-800/80 pt-4 font-display"
					>
						<span>Payable Total</span>
						<span>₹{finalTotal.toLocaleString('en-IN')}</span>
					</div>
				</div>

				<!-- Safety terms -->
				<div class="flex items-start gap-2 text-xxs text-zinc-400 dark:text-zinc-500">
					<ShieldCheck class="w-4 h-4 text-violet-500 flex-shrink-0" />
					<span
						>Secure checkout. The payment is simulated; no actual funds will be transferred.</span
					>
				</div>

				<button
					type="submit"
					disabled={isProcessing}
					class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102 cursor-pointer"
				>
					{#if isProcessing}
						<span
							class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
						></span>
						<span>Processing Payment...</span>
					{:else}
						<CreditCard class="w-4 h-4" />
						<span>Pay & Place Order</span>
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
