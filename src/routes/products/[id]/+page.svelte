<script>
	import { page } from '$app/stores';
	import { getProduct } from '$lib/firestore';
	import { authStore, cartStore, toastStore } from '$lib/store';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		ShoppingCart,
		ChevronLeft,
		Cpu,
		HardDrive,
		Smartphone,
		Battery,
		Layers,
		CheckCircle,
		AlertTriangle
	} from 'lucide-svelte';

	let productId = $derived($page.params.id);
	let product = $state(null);
	let loading = $state(true);
	let errorMsg = $state('');

	let quantity = $state(1);
	let isAdding = $state(false);

	// Load product details whenever the route ID changes
	$effect(() => {
		if (productId) {
			loadProduct(productId);
		}
	});

	async function loadProduct(id) {
		loading = true;
		errorMsg = '';
		try {
			product = await getProduct(id);
		} catch (err) {
			console.error(err);
			errorMsg = err.message || 'Product not found.';
		} finally {
			loading = false;
		}
	}

	function adjustQuantity(delta) {
		if (!product) return;
		const newQty = quantity + delta;
		if (newQty >= 1 && newQty <= product.stock) {
			quantity = newQty;
		}
	}

	async function handleAddToCart() {
		if (!authStore.user) {
			toastStore.show('Please log in to add items to your cart.', 'info');
			return;
		}
		if (!product) return;

		isAdding = true;
		try {
			const success = await cartStore.add(authStore.user.uid, product.id, quantity);
			if (success) {
				quantity = 1; // Reset selection
			}
		} catch (err) {
			console.error(err);
		} finally {
			isAdding = false;
		}
	}
</script>

<svelte:head>
	<title>{product ? product.name : 'Smartphone Details'} | MobiShop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<!-- Breadcrumb back link -->
	<a
		href="/products"
		class="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" />
		<span>Back to Store</span>
	</a>

	{#if loading}
		<div class="flex items-center justify-center min-h-[50vh]">
			<Spinner size="lg" />
		</div>
	{:else if errorMsg}
		<div
			class="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
		>
			<AlertTriangle class="w-12 h-12 text-rose-500 mx-auto mb-4" />
			<p class="text-lg font-bold text-zinc-800 dark:text-zinc-200">Device Not Found</p>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{errorMsg}</p>
			<a
				href="/products"
				class="mt-4 inline-block px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700"
			>
				Back to Catalog
			</a>
		</div>
	{:else if product}
		<!-- Main product layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Left side: Image Showcase -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden aspect-square flex items-center justify-center"
			>
				<img
					src={product.imageUrl ||
						'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
					alt={product.name}
					class="max-w-full max-h-[85%] object-contain rounded-2xl"
				/>

				{#if product.stock <= 0}
					<div
						class="absolute inset-0 bg-black/60 backdrop-blur-xxs flex items-center justify-center"
					>
						<span
							class="bg-rose-600 text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg"
						>
							Out of Stock
						</span>
					</div>
				{/if}
			</div>

			<!-- Right side: Mobile Metadata and Purchase form -->
			<div class="space-y-6">
				<!-- Title & Brand -->
				<div>
					<span
						class="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full"
					>
						{product.brand} Flagship
					</span>
					<h1
						class="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white mt-3"
					>
						{product.name}
					</h1>
					<p class="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 mt-2">
						₹{product.price?.toLocaleString('en-IN')}
					</p>
				</div>

				<!-- Description -->
				<div class="border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
					<h2
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
					>
						Overview
					</h2>
					<p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
						{product.description}
					</p>
				</div>

				<!-- Stock Indicator -->
				<div class="flex items-center gap-2 text-sm">
					{#if product.stock > 5}
						<CheckCircle class="w-4 h-4 text-emerald-500" />
						<span class="text-emerald-600 dark:text-emerald-400 font-medium"
							>In Stock (Available: {product.stock} units)</span
						>
					{:else if product.stock > 0}
						<AlertTriangle class="w-4 h-4 text-amber-500" />
						<span class="text-amber-600 dark:text-amber-400 font-medium"
							>Low Stock! (Only {product.stock} left)</span
						>
					{:else}
						<AlertTriangle class="w-4 h-4 text-rose-500" />
						<span class="text-rose-500 font-medium font-display">Currently Unavailable</span>
					{/if}
				</div>

				<!-- Order Selection Panel -->
				{#if product.stock > 0}
					<div class="border-t border-b border-zinc-100 dark:border-zinc-800/80 py-6 space-y-4">
						<div class="flex items-center gap-4">
							<span class="text-sm font-semibold text-zinc-500 dark:text-zinc-400"
								>Select Quantity:</span
							>

							<!-- Quantity adjust panel -->
							<div
								class="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950"
							>
								<button
									onclick={() => adjustQuantity(-1)}
									disabled={quantity <= 1}
									class="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
								>
									-
								</button>
								<span
									class="px-4 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono"
								>
									{quantity}
								</span>
								<button
									onclick={() => adjustQuantity(1)}
									disabled={quantity >= product.stock}
									class="px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
								>
									+
								</button>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
							<button
								onclick={handleAddToCart}
								disabled={isAdding}
								class="flex-grow flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102 cursor-pointer"
							>
								{#if isAdding}
									<span
										class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
									></span>
									<span>Adding to Cart...</span>
								{:else}
									<ShoppingCart class="w-4 h-4" />
									<span>Add {quantity} to Cart</span>
								{/if}
							</button>
						</div>
					</div>
				{/if}

				<!-- Specifications Grid -->
				{#if product.specs}
					<div class="space-y-4 pt-2">
						<h3 class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
							Device Specifications
						</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div
								class="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/80"
							>
								<Smartphone class="w-4 h-4 text-violet-500" />
								<div>
									<p class="text-xxs text-zinc-400 uppercase font-bold tracking-widest">Screen</p>
									<p class="text-xs font-medium text-zinc-800 dark:text-zinc-200">
										{product.specs.screen}
									</p>
								</div>
							</div>

							<div
								class="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/80"
							>
								<Cpu class="w-4 h-4 text-violet-500" />
								<div>
									<p class="text-xxs text-zinc-400 uppercase font-bold tracking-widest">
										Processor
									</p>
									<p class="text-xs font-medium text-zinc-800 dark:text-zinc-200">
										{product.specs.processor}
									</p>
								</div>
							</div>

							<div
								class="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/80"
							>
								<HardDrive class="w-4 h-4 text-violet-500" />
								<div>
									<p class="text-xxs text-zinc-400 uppercase font-bold tracking-widest">
										RAM & Storage
									</p>
									<p class="text-xs font-medium text-zinc-800 dark:text-zinc-200">
										{product.specs.ram} RAM / {product.specs.storage}
									</p>
								</div>
							</div>

							<div
								class="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/80"
							>
								<Battery class="w-4 h-4 text-violet-500" />
								<div>
									<p class="text-xxs text-zinc-400 uppercase font-bold tracking-widest">
										Battery capacity
									</p>
									<p class="text-xs font-medium text-zinc-800 dark:text-zinc-200">
										{product.specs.battery}
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
