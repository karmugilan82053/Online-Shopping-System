<script>
	import { ShoppingBag } from 'lucide-svelte';
</script>

<footer
	class="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 py-12"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Column 1: Brand Info -->
			<div class="space-y-4">
				<a
					href="/"
					class="flex items-center gap-2 text-lg font-bold font-display tracking-tight text-zinc-900 dark:text-white"
				>
					<div class="p-1 bg-violet-600 text-white rounded-lg">
						<ShoppingBag class="w-4 h-4" />
					</div>
					<span>Mobi<span class="text-violet-600 dark:text-violet-400">Shop</span></span>
				</a>
				<p class="text-sm text-zinc-500 dark:text-zinc-400">
					A next-generation mobile shopping system featuring the latest smartphones, premium
					branding, and a secure ordering experience.
				</p>
			</div>

			<!-- Column 2: Navigation -->
			<div>
				<h3
					class="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4"
				>
					Shop Pages
				</h3>
				<ul class="space-y-2">
					<li>
						<a
							href="/"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>Home</a
						>
					</li>
					<li>
						<a
							href="/products"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>All Mobiles</a
						>
					</li>
					<li>
						<a
							href="/cart"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>Shopping Cart</a
						>
					</li>
					<li>
						<a
							href="/orders"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>Order History</a
						>
					</li>
				</ul>
			</div>

			<!-- Column 3: Corporate Info -->
			<div>
				<h3
					class="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4"
				>
					Company
				</h3>
				<ul class="space-y-2">
					<li>
						<a
							href="/about"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>About Us</a
						>
					</li>
					<li>
						<a
							href="/faq"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>FAQs & Help</a
						>
					</li>
					<li>
						<a
							href="/contact"
							class="text-sm text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
							>Contact Support</a
						>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4"
		>
			<p class="text-xs text-zinc-500 dark:text-zinc-400">
				&copy; {new Date().getFullYear()} MobiShop. All rights reserved.
			</p>
		</div>
	</div>
</footer>
