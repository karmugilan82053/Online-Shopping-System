<script>
	import { subscribeToProducts } from '$lib/firestore';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import {
		Search,
		SlidersHorizontal,
		ArrowUpDown,
		ChevronLeft,
		ChevronRight,
		RefreshCw,
		X
	} from 'lucide-svelte';

	let products = $state([]);
	let loading = $state(true);

	// Filters State
	let searchQuery = $state('');
	let selectedBrands = $state([]);
	let maxPrice = $state(150000);
	let hideOutOfStock = $state(false);
	let sortBy = $state('newest'); // 'newest', 'price-asc', 'price-desc'
	let showMobileFilters = $state(false);

	// Pagination State
	let currentPage = $state(1);
	const itemsPerPage = 6;

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

	// Derived Brands List
	const brands = $derived([...new Set(products.map((p) => p.brand))]);

	// Filtered & Sorted products
	const processedProducts = $derived({
		get items() {
			let result = [...products];

			// Search filter
			if (searchQuery) {
				const queryLower = searchQuery.toLowerCase();
				result = result.filter(
					(p) =>
						p.name.toLowerCase().includes(queryLower) ||
						p.brand.toLowerCase().includes(queryLower) ||
						p.description.toLowerCase().includes(queryLower)
				);
			}

			// Brand filter
			if (selectedBrands.length > 0) {
				result = result.filter((p) => selectedBrands.includes(p.brand));
			}

			// Price filter
			result = result.filter((p) => p.price <= maxPrice);

			// Stock filter
			if (hideOutOfStock) {
				result = result.filter((p) => p.stock > 0);
			}

			// Sorting
			if (sortBy === 'price-asc') {
				result.sort((a, b) => a.price - b.price);
			} else if (sortBy === 'price-desc') {
				result.sort((a, b) => b.price - a.price);
			} else if (sortBy === 'newest') {
				result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			}

			return result;
		}
	});

	// Paginated subset
	const paginatedItems = $derived(
		processedProducts.items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(processedProducts.items.length / itemsPerPage) || 1);

	// Reset page on filter changes
	$effect(() => {
		searchQuery;
		selectedBrands;
		maxPrice;
		hideOutOfStock;
		sortBy;
		currentPage = 1;
	});

	function toggleBrand(brand) {
		if (selectedBrands.includes(brand)) {
			selectedBrands = selectedBrands.filter((b) => b !== brand);
		} else {
			selectedBrands = [...selectedBrands, brand];
		}
	}

	function resetFilters() {
		searchQuery = '';
		selectedBrands = [];
		maxPrice = 150000;
		hideOutOfStock = false;
		sortBy = 'newest';
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Shop Smartphones | MobiShop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<!-- Page Title and Quick Bar -->
	<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
		<div>
			<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
				Shop Smartphones
			</h1>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
				{#if loading}
					Syncing database...
				{:else}
					Showing {processedProducts.items.length} premium models
				{/if}
			</p>
		</div>

		<!-- Top Controls -->
		<div class="w-full md:w-auto flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
			<!-- Search Bar -->
			<div class="relative w-full sm:w-64">
				<span
					class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 pointer-events-none"
				>
					<Search class="w-4 h-4" />
				</span>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search smartphones..."
					class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all shadow-xs"
				/>
			</div>

			<!-- Mobile Filter Button -->
			<button
				onclick={() => (showMobileFilters = true)}
				class="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 hover:scale-102 cursor-pointer"
			>
				<SlidersHorizontal class="w-4 h-4" />
				<span>Filters</span>
			</button>

			<!-- Sorting Selector -->
			<div class="relative w-full sm:w-auto">
				<div class="relative flex items-center">
					<span class="absolute left-3.5 text-zinc-400 pointer-events-none">
						<ArrowUpDown class="w-4 h-4" />
					</span>
					<select
						bind:value={sortBy}
						class="w-full sm:w-auto pl-10 pr-8 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all cursor-pointer appearance-none"
					>
						<option value="newest">Sort by: Newest</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Main shop layout grid -->
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
		<!-- Desktop Sidebar Filters -->
		<aside
			class="hidden lg:block lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6"
		>
			<!-- Header -->
			<div
				class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4"
			>
				<h2 class="font-bold text-zinc-900 dark:text-white font-display">Filters</h2>
				<button
					onclick={resetFilters}
					class="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
				>
					<RefreshCw class="w-3 h-3" /> Reset
				</button>
			</div>

			<!-- Brands filter -->
			<div>
				<h3
					class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3"
				>
					Brands
				</h3>
				<div class="space-y-2 max-h-48 overflow-y-auto pr-2">
					{#each brands as brand}
						<label
							class="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 cursor-pointer"
						>
							<input
								type="checkbox"
								checked={selectedBrands.includes(brand)}
								onchange={() => toggleBrand(brand)}
								class="rounded text-violet-600 focus:ring-violet-500/50 w-4 h-4 cursor-pointer"
							/>
							<span>{brand}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Price Slider -->
			<div>
				<div
					class="flex items-center justify-between text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3"
				>
					<span>Max Price</span>
					<span class="text-violet-600 dark:text-violet-400 font-mono font-bold text-sm"
						>₹{maxPrice.toLocaleString('en-IN')}</span
					>
				</div>
				<input
					type="range"
					min="10000"
					max="150000"
					step="5000"
					bind:value={maxPrice}
					class="w-full accent-violet-600 cursor-pointer"
				/>
				<div class="flex justify-between text-xxs text-zinc-400 mt-1 font-mono">
					<span>₹10,000</span>
					<span>₹1,50,000</span>
				</div>
			</div>

			<!-- Out of Stock Filter -->
			<div class="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
				<label
					class="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer"
				>
					<input
						type="checkbox"
						bind:checked={hideOutOfStock}
						class="rounded text-violet-600 focus:ring-violet-500/50 w-4 h-4 cursor-pointer"
					/>
					<span>Hide Out of Stock</span>
				</label>
			</div>
		</aside>

		<!-- Catalog Content -->
		<section class="lg:col-span-3 space-y-8">
			{#if loading}
				<div class="flex justify-center py-20">
					<Spinner size="lg" />
				</div>
			{:else if paginatedItems.length === 0}
				<div
					class="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xs max-w-md mx-auto"
				>
					<p class="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
						No products found
					</p>
					<p class="text-xs text-zinc-400 dark:text-zinc-500">
						We couldn't find any mobile phones matching your search criteria.
					</p>
					<button
						onclick={resetFilters}
						class="mt-4 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
					>
						Clear Active Filters
					</button>
				</div>
			{:else}
				<!-- Products Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
					{#each paginatedItems as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				<!-- Pagination controls -->
				{#if totalPages > 1}
					<div
						class="flex items-center justify-center gap-4 border-t border-zinc-200 dark:border-zinc-800/80 pt-6"
					>
						<button
							onclick={() => (currentPage = Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
							aria-label="Previous page"
						>
							<ChevronLeft class="w-4 h-4" />
						</button>

						<span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
							Page {currentPage} of {totalPages}
						</span>

						<button
							onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
							disabled={currentPage === totalPages}
							class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
							aria-label="Next page"
						>
							<ChevronRight class="w-4 h-4" />
						</button>
					</div>
				{/if}
			{/if}
		</section>
	</div>
</div>

<!-- Mobile Filters Drawer Overlay -->
{#if showMobileFilters}
	<div class="fixed inset-0 z-50 lg:hidden flex justify-end">
		<!-- Backdrop -->
		<button
			onclick={() => (showMobileFilters = false)}
			class="fixed inset-0 bg-black/60 backdrop-blur-xxs cursor-default"
			aria-label="Close filters"
		></button>

		<!-- Drawer -->
		<div
			class="relative w-full max-w-xs bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col h-full z-10 shadow-2xl transition-all"
		>
			<!-- Header -->
			<div
				class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-6"
			>
				<h2 class="font-bold text-zinc-900 dark:text-white font-display text-lg">Filters</h2>
				<button
					onclick={() => (showMobileFilters = false)}
					class="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Drawer Body Scrollable -->
			<div class="flex-grow overflow-y-auto space-y-6 pr-1">
				<!-- Brands -->
				<div>
					<h3
						class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3"
					>
						Brands
					</h3>
					<div class="space-y-2">
						{#each brands as brand}
							<label
								class="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={selectedBrands.includes(brand)}
									onchange={() => toggleBrand(brand)}
									class="rounded text-violet-600 focus:ring-violet-500/50 w-4 h-4 cursor-pointer"
								/>
								<span>{brand}</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Price slider -->
				<div>
					<div
						class="flex items-center justify-between text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3"
					>
						<span>Max Price</span>
						<span class="text-violet-600 dark:text-violet-400 font-mono font-bold text-sm"
							>₹{maxPrice.toLocaleString('en-IN')}</span
						>
					</div>
					<input
						type="range"
						min="10000"
						max="150000"
						step="5000"
						bind:value={maxPrice}
						class="w-full accent-violet-600 cursor-pointer"
					/>
				</div>

				<!-- Stock -->
				<div class="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
					<label
						class="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer"
					>
						<input
							type="checkbox"
							bind:checked={hideOutOfStock}
							class="rounded text-violet-600 focus:ring-violet-500/50 w-4 h-4 cursor-pointer"
						/>
						<span>Hide Out of Stock</span>
					</label>
				</div>
			</div>

			<!-- Drawer Footer Actions -->
			<div
				class="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6 grid grid-cols-2 gap-3"
			>
				<button
					onclick={() => {
						resetFilters();
						showMobileFilters = false;
					}}
					class="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 text-center cursor-pointer"
				>
					Clear All
				</button>
				<button
					onclick={() => (showMobileFilters = false)}
					class="w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 text-center cursor-pointer"
				>
					Apply Filters
				</button>
			</div>
		</div>
	</div>
{/if}
