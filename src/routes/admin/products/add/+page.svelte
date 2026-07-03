<script>
	import { addProduct } from '$lib/firestore';
	import { uploadImage } from '$lib/storage';
	import { toastStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import {
		ChevronLeft,
		Save,
		Plus,
		Image,
		Smartphone,
		Cpu,
		HardDrive,
		Battery,
		Layers
	} from 'lucide-svelte';

	let name = $state('');
	let brand = $state('Apple');
	let price = $state(49999);
	let stock = $state(10);
	let description = $state('');

	// Specs state
	let screen = $state('');
	let processor = $state('');
	let ram = $state('8 GB');
	let storage = $state('256 GB');
	let battery = $state('');

	let imageFile = $state(null);
	let imagePreview = $state('');
	let isSaving = $state(false);

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			imageFile = file;
			imagePreview = URL.createObjectURL(file);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name || !price || !stock || !description) {
			toastStore.show('Please fill in all core fields.', 'error');
			return;
		}

		isSaving = true;
		try {
			let imageUrl = '';
			if (imageFile) {
				toastStore.show('Uploading phone image...', 'info');
				imageUrl = await uploadImage(imageFile, 'products');
			} else {
				// Fallback generic phone mockup image from Unsplash
				imageUrl =
					'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
			}

			const productPayload = {
				name,
				brand,
				price: Number(price),
				stock: Number(stock),
				description,
				imageUrl,
				specs: {
					screen,
					processor,
					ram,
					storage,
					battery
				}
			};

			await addProduct(productPayload);
			toastStore.show('Smartphone added to inventory successfully!', 'success');
			goto('/admin/products');
		} catch (error) {
			toastStore.show(error.message || 'Failed to add product.', 'error');
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Add Mobile | Admin MobiShop</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Back Breadcrumb -->
	<a
		href="/admin/products"
		class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
	>
		<ChevronLeft class="w-4 h-4" />
		<span>Back to Inventory</span>
	</a>

	<!-- Header -->
	<div>
		<h1
			class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
		>
			<Plus class="w-7 h-7 text-violet-600 dark:text-violet-400" />
			<span>Add New Smartphone</span>
		</h1>
		<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
			Catalog a new flagship mobile in the database
		</p>
	</div>

	<!-- Form Card -->
	<form onsubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
		<!-- Left Fields (Core Info & Specs) -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Core Info box -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
			>
				<h2
					class="text-base font-bold font-display text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3"
				>
					Core details
				</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="sm:col-span-2">
						<label for="name" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Smartphone Name *</label
						>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							placeholder="e.g. OnePlus 12"
							class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
						/>
					</div>

					<div>
						<label for="brand" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Brand *</label
						>
						<select
							id="brand"
							bind:value={brand}
							class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors cursor-pointer"
						>
							<option>Apple</option>
							<option>Samsung</option>
							<option>Google</option>
							<option>OnePlus</option>
							<option>Xiaomi</option>
							<option>Realme</option>
							<option>Vivo</option>
							<option>Oppo</option>
							<option>Motorola</option>
						</select>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="price" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
								>Price (₹) *</label
							>
							<input
								type="number"
								id="price"
								bind:value={price}
								required
								min="1"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>

						<div>
							<label for="stock" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
								>Stock units *</label
							>
							<input
								type="number"
								id="stock"
								bind:value={stock}
								required
								min="0"
								class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label for="description" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Detailed description *</label
						>
						<textarea
							id="description"
							bind:value={description}
							required
							rows="4"
							placeholder="Introduce device flagship features, camera details, or design characteristics..."
							class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors resize-none"
						></textarea>
					</div>
				</div>
			</div>

			<!-- Specifications box -->
			<div
				class="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
			>
				<h2
					class="text-base font-bold font-display text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3"
				>
					Technical Specifications
				</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="screen" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Screen details</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
								<Smartphone class="w-4 h-4" />
							</span>
							<input
								type="text"
								id="screen"
								bind:value={screen}
								placeholder="e.g. 6.7 inch AMOLED 120Hz"
								class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label for="processor" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Processor / SoC</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
								<Cpu class="w-4 h-4" />
							</span>
							<input
								type="text"
								id="processor"
								bind:value={processor}
								placeholder="e.g. Snapdragon 8 Gen 3"
								class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label for="ram" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>RAM Capacity</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
								<Layers class="w-4 h-4" />
							</span>
							<select
								id="ram"
								bind:value={ram}
								class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none cursor-pointer"
							>
								<option>4 GB</option>
								<option>6 GB</option>
								<option>8 GB</option>
								<option>12 GB</option>
								<option>16 GB</option>
								<option>24 GB</option>
							</select>
						</div>
					</div>

					<div>
						<label for="storage" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Storage Capacity</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
								<HardDrive class="w-4 h-4" />
							</span>
							<select
								id="storage"
								bind:value={storage}
								class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none cursor-pointer"
							>
								<option>64 GB</option>
								<option>128 GB</option>
								<option>256 GB</option>
								<option>512 GB</option>
								<option>1 TB</option>
							</select>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label for="battery" class="block text-xxs font-bold text-zinc-400 uppercase mb-2"
							>Battery / Charging</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
								<Battery class="w-4 h-4" />
							</span>
							<input
								type="text"
								id="battery"
								bind:value={battery}
								placeholder="e.g. 5000 mAh with 80W charging"
								class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Media Upload card -->
		<div class="space-y-6 lg:col-span-1">
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
			>
				<h2
					class="text-base font-bold font-display text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3"
				>
					Device Image
				</h2>

				<div class="space-y-4">
					{#if imagePreview}
						<div
							class="w-full aspect-square rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950"
						>
							<img
								src={imagePreview}
								alt="Upload Preview"
								class="max-w-full max-h-full object-contain"
							/>
						</div>
					{:else}
						<div
							class="w-full aspect-square rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center text-zinc-400 p-6 bg-zinc-50 dark:bg-zinc-950"
						>
							<Image class="w-8 h-8 mb-2 text-zinc-300" />
							<p class="text-xxs text-center text-zinc-400">Select product photo (JPG, PNG)</p>
						</div>
					{/if}

					<label
						class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-850/80 text-xs font-semibold cursor-pointer text-zinc-700 dark:text-zinc-300 text-center transition-colors"
					>
						<span>Choose photo</span>
						<input type="file" accept="image/*" class="hidden" onchange={handleFileChange} />
					</label>
				</div>
			</div>

			<!-- Actions panel -->
			<button
				type="submit"
				disabled={isSaving}
				class="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102 cursor-pointer"
			>
				{#if isSaving}
					<span
						class="animate-spin w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full"
					></span>
					<span>Saving smartphone...</span>
				{:else}
					<Save class="w-4.5 h-4.5" />
					<span>Save Product</span>
				{/if}
			</button>
		</div>
	</form>
</div>
