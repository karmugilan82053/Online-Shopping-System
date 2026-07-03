<script>
	import { subscribeToProducts } from '$lib/firestore';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		Search,
		Sparkles,
		Smartphone,
		ArrowRight,
		ShieldCheck,
		Truck,
		RefreshCw
	} from 'lucide-svelte';

	let products = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let selectedBrand = $state('');

	// Subscribe to real-time products
	let unsubscribe;
	$effect(() => {
		unsubscribe = subscribeToProducts((prods) => {
			products = prods;
			loading = false;
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	// Brand filters derived
	const brands = $derived([...new Set(products.map((p) => p.brand))]);

	// Filtered products derived
	const filteredProducts = $derived(
		products.filter((p) => {
			const matchesSearch =
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
			return matchesSearch && matchesBrand;
		})
	);

	function selectBrand(brand) {
		selectedBrand = selectedBrand === brand ? '' : brand;
	}
</script>

<svelte:head>
	<title>Home | MobiShop Premium Mobile Store</title>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative overflow-hidden bg-zinc-900 text-white py-20 sm:py-28 transition-colors duration-300"
>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.15),transparent_60%)]"
	></div>

	<div
		class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
	>
		<!-- Left Side text -->
		<div class="space-y-6 text-left">
			<div
				class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-violet-500/10 border border-violet-500/20 text-violet-400"
			>
				<Sparkles class="w-3.5 h-3.5" />
				<span>Latest Flagships In Stock</span>
			</div>

			<h1
				class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight leading-none text-white"
			>
				Upgrade To The <br />
				<span class="text-gradient">Next Generation</span>
			</h1>

			<p class="text-zinc-400 text-base sm:text-lg max-w-md leading-relaxed">
				Explore MobiShop's curated collection of top-tier smartphones. Superfast processors,
				titanium builds, and groundbreaking cameras.
			</p>

			<div class="flex flex-wrap gap-4 pt-2">
				<a
					href="/products"
					class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-lg hover:shadow-violet-600/30 hover:scale-102"
				>
					<span>Explore Mobiles</span>
					<ArrowRight class="w-4 h-4" />
				</a>
				<a
					href="/about"
					class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors"
				>
					Learn More
				</a>
			</div>
		</div>

		<!-- Right Side Graphic / Showcase -->
		<div class="hidden lg:flex justify-center relative">
			<!-- Glass backdrop decorative element -->
			<div
				class="absolute w-72 h-72 bg-violet-600/30 rounded-full blur-3xl -z-10 animate-pulse"
			></div>
			<div
				class="relative max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950 p-6 glow-card transition-all"
			>
				<img
					src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
					alt="Featured Flagship Phone"
					class="rounded-2xl object-cover aspect-[4/5] w-full"
				/>
				<div class="mt-4 flex items-center justify-between">
					<div>
						<p class="text-xxs text-zinc-500 uppercase font-bold tracking-widest">
							Featured flagship
						</p>
						<h3 class="font-display font-bold text-lg text-white">iPhone 15 Pro Max</h3>
					</div>
					<a
						href="/products/prod-apple-iphone15"
						class="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-violet-400"
					>
						<ArrowRight class="w-5 h-5" />
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Trust Badges Section -->
<section
	class="py-8 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/60 transition-colors duration-300"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
		<div class="flex items-center gap-3">
			<div class="p-2.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
				<Truck class="w-5 h-5" />
			</div>
			<div>
				<h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">Free Insured Shipping</h4>
				<p class="text-xs text-zinc-500">Across all orders with safe handovers</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<div class="p-2.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
				<ShieldCheck class="w-5 h-5" />
			</div>
			<div>
				<h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">1-Year Brand Warranty</h4>
				<p class="text-xs text-zinc-500">Authorized warranty support guaranteed</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<div class="p-2.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
				<RefreshCw class="w-5 h-5" />
			</div>
			<div>
				<h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">14-Day Free Returns</h4>
				<p class="text-xs text-zinc-500">Easy replacement window for damage/faults</p>
			</div>
		</div>
	</div>
</section>

<!-- Store Catalog Filters and Grid -->
<section class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-12">
	<!-- Search & Title -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
		<div>
			<h2
				class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
			>
				<Smartphone class="w-7 h-7 text-violet-600 dark:text-violet-400" />
				<span>Featured Mobiles</span>
			</h2>
			<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
				Browse premium products with real-time stock sync
			</p>
		</div>

		<!-- Search Bar -->
		<div class="relative w-full sm:w-80">
			<span
				class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none"
			>
				<Search class="w-4 h-4" />
			</span>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search name, brand, spec..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all shadow-xs"
			/>
		</div>
	</div>

	<!-- Brand quick pills -->
	{#if !loading && brands.length > 0}
		<div class="flex flex-wrap gap-2 pt-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
			<button
				onclick={() => (selectedBrand = '')}
				class="px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer
					{!selectedBrand
					? 'bg-violet-600 border-violet-600 text-white shadow-md'
					: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}"
			>
				All Brands
			</button>

			{#each brands as brand}
				<button
					onclick={() => selectBrand(brand)}
					class="px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer
						{selectedBrand === brand
						? 'bg-violet-600 border-violet-600 text-white shadow-md'
						: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}"
				>
					{brand}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Products Grid -->
	{#if loading}
		<div class="flex justify-center py-20">
			<Spinner size="lg" />
		</div>
	{:else if filteredProducts.length === 0}
		<div
			class="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
		>
			<p class="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">No flagships found</p>
			<p class="text-xs text-zinc-400 dark:text-zinc-500">
				We couldn't find any products matching your active filters. Try adjustments!
			</p>
			<button
				onclick={() => {
					searchQuery = '';
					selectedBrand = '';
				}}
				class="mt-4 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
			>
				Reset Filters
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredProducts as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</section>
