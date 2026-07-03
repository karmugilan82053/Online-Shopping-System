<script>
	import { authStore, cartStore, toastStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ShoppingCart, Trash2, ArrowRight, Smartphone, Sparkles, Tag } from 'lucide-svelte';

	let promoCode = $state('');
	let discountPercent = $state(0);
	let promoError = $state('');
	let promoSuccess = $state('');

	// Sync cart items when user is validated
	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.user) {
				goto('/login');
			} else {
				cartStore.load(authStore.user.uid);
			}
		}
	});

	async function handleQtyChange(item, newQty) {
		if (newQty <= 0) {
			await cartStore.remove(authStore.user.uid, item.productId);
		} else {
			await cartStore.update(authStore.user.uid, item.productId, newQty);
		}
	}

	async function handleRemove(productId) {
		await cartStore.remove(authStore.user.uid, productId);
	}

	function applyPromo() {
		promoError = '';
		promoSuccess = '';
		if (promoCode.trim().toUpperCase() === 'MOBI20') {
			discountPercent = 20;
			promoSuccess = 'Promo MOBI20 applied! 20% discount applied to your order.';
			toastStore.show('20% discount code applied!', 'success');
		} else if (promoCode.trim()) {
			promoError = 'Invalid voucher code. Try "MOBI20".';
		}
	}

	// Derived financial calculations
	const discountAmount = $derived(Math.round(cartStore.total * (discountPercent / 100)));
	const shippingCost = $derived(cartStore.total > 50000 ? 0 : 499);
	const finalTotal = $derived(cartStore.total - discountAmount + shippingCost);

	function proceedToCheckout() {
		// Save discount parameters in localStorage for checkout mapping
		if (typeof window !== 'undefined') {
			localStorage.setItem('checkout_discount_percent', discountPercent.toString());
			localStorage.setItem('checkout_shipping_cost', shippingCost.toString());
		}
		goto('/checkout');
	}
</script>

<svelte:head>
	<title>Shopping Cart | MobiShop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
		<ShoppingCart class="w-8 h-8 text-violet-600 dark:text-violet-400" />
		<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
			Shopping Cart
		</h1>
	</div>

	{#if cartStore.loading && cartStore.items.length === 0}
		<div class="flex items-center justify-center min-h-[40vh]">
			<Spinner size="lg" />
		</div>
	{:else if cartStore.items.length === 0}
		<!-- Empty Cart Box -->
		<div
			class="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
		>
			<ShoppingCart class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
			<p class="text-lg font-bold text-zinc-800 dark:text-zinc-200">Your cart is empty</p>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
				Add mobile smartphones from our catalog to place an order.
			</p>
			<a
				href="/products"
				class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700"
			>
				<span>Browse smartphones</span>
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	{:else}
		<!-- Main checkout grid layout -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
			<!-- Cart Items Table (Left Side) -->
			<div class="lg:col-span-2 space-y-4">
				{#each cartStore.items as item (item.productId)}
					<div
						class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs relative"
					>
						<!-- Product Thumbnail -->
						<div
							class="w-20 h-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
						>
							<img
								src={item.product?.imageUrl ||
									'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
								alt={item.product?.name}
								class="max-w-[80%] max-h-[80%] object-contain"
							/>
						</div>

						<!-- Name & Brand -->
						<div class="flex-grow min-w-0">
							<span
								class="text-xxs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest"
								>{item.product?.brand}</span
							>
							<h3
								class="font-display font-semibold text-zinc-900 dark:text-zinc-100 truncate hover:text-violet-600 transition-colors"
							>
								<a href="/products/{item.productId}">{item.product?.name}</a>
							</h3>
							<p class="font-bold text-sm text-zinc-900 dark:text-zinc-200 mt-0.5">
								₹{item.product?.price?.toLocaleString('en-IN')}
							</p>
						</div>

						<!-- Quantity Controls -->
						<div class="flex items-center gap-2">
							<div
								class="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden"
							>
								<button
									onclick={() => handleQtyChange(item, item.quantity - 1)}
									class="px-2.5 py-1 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
								>
									-
								</button>
								<span
									class="px-3 py-1 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200"
									>{item.quantity}</span
								>
								<button
									onclick={() => handleQtyChange(item, item.quantity + 1)}
									disabled={item.quantity >= (item.product?.stock || 99)}
									class="px-2.5 py-1 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
								>
									+
								</button>
							</div>

							<!-- Trash Button -->
							<button
								onclick={() => handleRemove(item.productId)}
								class="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
								aria-label="Remove item"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Cart Order Summary (Right Side) -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 lg:col-span-1"
			>
				<h2 class="text-xl font-bold font-display text-zinc-900 dark:text-white">Order Summary</h2>

				<!-- Voucher Coupon input -->
				<div class="space-y-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
					<label
						for="promoCode"
						class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
						>Voucher / Coupon Code</label
					>
					<div class="flex gap-2">
						<input
							type="text"
							id="promoCode"
							bind:value={promoCode}
							placeholder="Enter 'MOBI20'"
							class="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-colors uppercase"
						/>
						<button
							onclick={applyPromo}
							class="px-4 py-2 bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
						>
							Apply
						</button>
					</div>
					{#if promoError}
						<p class="text-xxs text-rose-500 font-semibold">{promoError}</p>
					{/if}
					{#if promoSuccess}
						<p class="text-xxs text-emerald-500 font-semibold">{promoSuccess}</p>
					{/if}
				</div>

				<!-- Financial calculations list -->
				<div class="space-y-3 text-sm">
					<div class="flex justify-between text-zinc-600 dark:text-zinc-400">
						<span>Subtotal</span>
						<span class="font-medium text-zinc-800 dark:text-zinc-200"
							>₹{cartStore.total?.toLocaleString('en-IN')}</span
						>
					</div>

					{#if discountPercent > 0}
						<div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
							<span class="flex items-center gap-1.5"
								><Tag class="w-3.5 h-3.5" /> Discount ({discountPercent}%)</span
							>
							<span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
						</div>
					{/if}

					<div class="flex justify-between text-zinc-600 dark:text-zinc-400">
						<span>Shipping Delivery</span>
						{#if shippingCost === 0}
							<span class="text-emerald-500 font-bold uppercase text-xs">Free</span>
						{:else}
							<span class="font-medium text-zinc-800 dark:text-zinc-200"
								>₹{shippingCost.toLocaleString('en-IN')}</span
							>
						{/if}
					</div>

					<div
						class="flex justify-between text-base font-bold text-zinc-900 dark:text-white border-t border-zinc-100 dark:border-zinc-800/80 pt-4 font-display"
					>
						<span>Total</span>
						<span>₹{finalTotal.toLocaleString('en-IN')}</span>
					</div>
				</div>

				<button
					onclick={proceedToCheckout}
					class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 transition-all hover:scale-102 cursor-pointer mt-4"
				>
					<span>Proceed to Checkout</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/if}
</div>
