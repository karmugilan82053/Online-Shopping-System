<script>
	import { subscribeToProducts, deleteProduct } from '$lib/firestore';
	import { toastStore } from '$lib/store';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Plus, Edit2, Trash2, Search, Smartphone, AlertTriangle } from 'lucide-svelte';

	let products = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');

	// Pagination
	let currentPage = $state(1);
	const itemsPerPage = 8;

	let unsubscribe;
	$effect(() => {
		unsubscribe = subscribeToProducts((data) => {
			products = data;
			loading = false;
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	// Filtered products list
	const filteredProducts = $derived(
		products.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.brand.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const paginatedProducts = $derived(
		filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredProducts.length / itemsPerPage) || 1);

	$effect(() => {
		searchQuery;
		currentPage = 1;
	});

	async function handleDelete(id, name) {
		const confirmDelete = confirm(`Are you sure you want to delete ${name}?`);
		if (!confirmDelete) return;

		try {
			await deleteProduct(id);
			toastStore.show('Product deleted successfully!', 'success');
		} catch (error) {
			toastStore.show('Failed to delete product.', 'error');
		}
	}
</script>

<svelte:head>
	<title>Manage Mobiles | Admin MobiShop</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		<div>
			<h1
				class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
			>
				<Smartphone class="w-7 h-7 text-violet-600 dark:text-violet-400" />
				<span>Manage Products</span>
			</h1>
			<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
				Create, update, and manage inventory listings
			</p>
		</div>

		<a
			href="/admin/products/add"
			class="flex items-center gap-1.5 px-4.5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-102"
		>
			<Plus class="w-4 h-4" />
			<span>Add Product</span>
		</a>
	</div>

	<!-- Controls and search -->
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
				placeholder="Search name, brand..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all shadow-xs"
			/>
		</div>

		<div class="text-xxs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
			Total Count: {filteredProducts.length}
		</div>
	</div>

	<!-- Products Table Sheet -->
	<div
		class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
	>
		{#if loading}
			<div class="flex items-center justify-center py-20">
				<Spinner size="lg" />
			</div>
		{:else if filteredProducts.length === 0}
			<div class="text-center py-16 p-8 max-w-sm mx-auto">
				<AlertTriangle class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
				<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No flagships cataloged</p>
				<p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
					Try clearing searches or add new smartphone listings.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse text-xs">
					<thead>
						<tr
							class="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-xxs uppercase tracking-wider font-bold"
						>
							<th class="p-4">Thumbnail</th>
							<th class="p-4">Name</th>
							<th class="p-4">Brand</th>
							<th class="p-4">Price</th>
							<th class="p-4">Stock</th>
							<th class="p-4 text-center">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
						{#each paginatedProducts as product (product.id)}
							<tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors">
								<!-- Thumbnail -->
								<td class="p-4">
									<div
										class="w-10 h-10 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex items-center justify-center"
									>
										<img
											src={product.imageUrl}
											alt={product.name}
											class="max-w-[80%] max-h-[80%] object-contain"
										/>
									</div>
								</td>
								<!-- Name -->
								<td class="p-4 font-semibold text-zinc-800 dark:text-zinc-200">{product.name}</td>
								<!-- Brand -->
								<td class="p-4 text-zinc-500">{product.brand}</td>
								<!-- Price -->
								<td class="p-4 font-semibold text-zinc-800 dark:text-zinc-200"
									>₹{product.price?.toLocaleString('en-IN')}</td
								>
								<!-- Stock -->
								<td class="p-4">
									<span
										class="inline-flex items-center px-2 py-0.5 rounded-full font-semibold font-mono text-xxs
										{product.stock > 5
											? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
											: ''}
										{product.stock <= 5 && product.stock > 0
											? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
											: ''}
										{product.stock === 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' : ''}"
									>
										{product.stock}
									</span>
								</td>
								<!-- Actions -->
								<td class="p-4 text-center">
									<div class="flex items-center justify-center gap-2">
										<a
											href="/admin/products/edit/{product.id}"
											class="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
											aria-label="Edit product"
										>
											<Edit2 class="w-3.5 h-3.5" />
										</a>
										<button
											onclick={() => handleDelete(product.id, product.name)}
											class="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
											aria-label="Delete product"
										>
											<Trash2 class="w-3.5 h-3.5" />
										</button>
									</div>
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
