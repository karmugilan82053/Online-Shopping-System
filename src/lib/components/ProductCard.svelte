<script>
	import { authStore, cartStore, toastStore } from '$lib/store';
	import { ShoppingCart, Eye, Cpu, HardDrive } from 'lucide-svelte';

	let { product } = $props();
	let isAdding = $state(false);

	async function handleAddToCart(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!authStore.user) {
			toastStore.show('Please login to add products to cart.', 'info');
			return;
		}

		isAdding = true;
		try {
			await cartStore.add(authStore.user.uid, product.id, 1);
		} catch (err) {
			console.error(err);
		} finally {
			isAdding = false;
		}
	}
</script>

<div
	class="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
>
	<!-- Product Image Wrapper -->
	<a
		href="/products/{product.id}"
		class="block relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950"
	>
		<img
			src={product.imageUrl ||
				'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
			alt={product.name}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>

		<!-- Quick Badges -->
		{#if product.stock <= 0}
			<span
				class="absolute top-3 left-3 bg-rose-600 text-white text-xxs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md"
			>
				Out of stock
			</span>
		{:else if product.stock <= 5}
			<span
				class="absolute top-3 left-3 bg-amber-500 text-white text-xxs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-pulse"
			>
				Only {product.stock} left!
			</span>
		{/if}

		<span
			class="absolute top-3 right-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs text-zinc-900 dark:text-zinc-100 text-xxs font-medium px-2 py-0.5 rounded-lg border border-zinc-200/20 shadow-xs"
		>
			{product.brand}
		</span>

		<!-- Hover Action overlay (Desktop) -->
		<div
			class="absolute inset-0 bg-black/40 backdrop-blur-xxs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		>
			<span
				class="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
			>
				<Eye class="w-4 h-4" />
				<span>View Details</span>
			</span>
		</div>
	</a>

	<!-- Product Metadata -->
	<div class="p-5 flex flex-col flex-1">
		<div class="mb-2">
			<a
				href="/products/{product.id}"
				class="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
			>
				<h3
					class="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight line-clamp-1"
				>
					{product.name}
				</h3>
			</a>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 min-h-[2rem]">
				{product.description}
			</p>
		</div>

		<!-- Specs pills -->
		{#if product.specs}
			<div class="flex flex-wrap gap-2 my-2 border-t border-zinc-100 dark:border-zinc-800/50 pt-2">
				<span
					class="inline-flex items-center gap-1 text-xxs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded"
				>
					<Cpu class="w-3 h-3 text-zinc-400" />
					<span class="truncate max-w-[70px]">{product.specs.processor?.split(' ')[0]}</span>
				</span>
				<span
					class="inline-flex items-center gap-1 text-xxs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded"
				>
					<HardDrive class="w-3 h-3 text-zinc-400" />
					<span>{product.specs.ram} / {product.specs.storage}</span>
				</span>
			</div>
		{/if}

		<!-- Action bar -->
		<div
			class="mt-auto pt-4 flex items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/80"
		>
			<div>
				<p class="text-xs text-zinc-400 uppercase tracking-wider">Price</p>
				<p class="font-bold text-lg text-zinc-900 dark:text-zinc-100 font-display">
					₹{product.price?.toLocaleString('en-IN')}
				</p>
			</div>

			<button
				onclick={handleAddToCart}
				disabled={product.stock <= 0 || isAdding}
				class="flex items-center justify-center p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-semibold tracking-wide text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
				aria-label="Add to cart"
			>
				{#if isAdding}
					<span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
					></span>
				{:else}
					<ShoppingCart class="w-4 h-4 mr-0.5 sm:mr-1.5" />
					<span class="hidden sm:inline">Add to Cart</span>
				{/if}
			</button>
		</div>
	</div>
</div>
