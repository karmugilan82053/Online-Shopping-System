<script>
	import { authStore, cartStore, themeStore, toastStore } from '$lib/store';
	import { logoutUser } from '$lib/auth';
	import {
		ShoppingBag,
		ShoppingCart,
		User,
		Menu,
		X,
		Sun,
		Moon,
		LayoutDashboard,
		LogOut,
		Info,
		HelpCircle,
		Mail,
		PhoneCall
	} from 'lucide-svelte';

	let isMobileMenuOpen = $state(false);
	let isProfileDropdownOpen = $state(false);

	// Load user cart once auth is loaded and user is present
	$effect(() => {
		if (authStore.user) {
			cartStore.load(authStore.user.uid);
		}
	});

	async function handleLogout() {
		try {
			await logoutUser();
			toastStore.show('Logged out successfully!', 'info');
			isProfileDropdownOpen = false;
			isMobileMenuOpen = false;
		} catch (err) {
			toastStore.show('Logout failed. Please try again.', 'error');
		}
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function toggleProfileDropdown() {
		isProfileDropdownOpen = !isProfileDropdownOpen;
	}

	function toggleTheme() {
		themeStore.toggle();
	}
</script>

<nav
	class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<a
					href="/"
					class="flex items-center gap-2 text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white"
				>
					<div class="p-1.5 bg-violet-600 text-white rounded-lg">
						<ShoppingBag class="w-5 h-5" />
					</div>
					<span>Mobi<span class="text-violet-600 dark:text-violet-400">Shop</span></span>
				</a>
			</div>

			<!-- Desktop Nav Links -->
			<div class="hidden md:flex items-center space-x-6">
				<a
					href="/"
					class="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
					>Home</a
				>
				<a
					href="/products"
					class="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
					>Mobiles</a
				>
				<a
					href="/about"
					class="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
					>About Us</a
				>
				<a
					href="/faq"
					class="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
					>FAQs</a
				>
				<a
					href="/contact"
					class="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
					>Contact</a
				>
			</div>

			<!-- Utilities and User Menu -->
			<div class="hidden md:flex items-center space-x-4">
				<!-- Light/Dark Mode Toggle -->
				<button
					onclick={toggleTheme}
					class="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
					aria-label="Toggle dark mode"
				>
					{#if themeStore.mode === 'dark'}
						<Sun class="w-5 h-5 text-amber-400 animate-pulse" />
					{:else}
						<Moon class="w-5 h-5 text-indigo-600" />
					{/if}
				</button>

				<!-- Cart -->
				<a
					href="/cart"
					class="p-2 relative text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all hover:scale-105"
					aria-label="Shopping cart"
				>
					<ShoppingCart class="w-5 h-5" />
					{#if cartStore.count > 0}
						<span
							class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xxs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-violet-600 rounded-full animate-bounce"
						>
							{cartStore.count}
						</span>
					{/if}
				</a>

				<!-- Auth / Dropdown -->
				{#if authStore.loading}
					<div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
				{:else if authStore.user}
					<div class="relative">
						<button
							onclick={toggleProfileDropdown}
							class="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
						>
							{#if authStore.user.avatarUrl}
								<img
									src={authStore.user.avatarUrl}
									alt="Avatar"
									class="w-8 h-8 rounded-full object-cover border border-violet-500"
								/>
							{:else}
								<div
									class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold text-sm"
								>
									{authStore.user.name.charAt(0).toUpperCase()}
								</div>
							{/if}
							<span class="text-sm font-medium text-zinc-700 dark:text-zinc-200 pr-1"
								>{authStore.user.name.split(' ')[0]}</span
							>
						</button>

						{#if isProfileDropdownOpen}
							<!-- Click away backdrop -->
							<button
								onclick={() => (isProfileDropdownOpen = false)}
								class="fixed inset-0 z-10 cursor-default"
								aria-label="Close user menu"
							></button>

							<div
								class="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-1.5 z-20 transition-all transform scale-100 origin-top-right"
							>
								<div class="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
									<p class="text-xs text-zinc-400 dark:text-zinc-500">Signed in as</p>
									<p class="text-sm font-semibold truncate text-zinc-800 dark:text-zinc-200">
										{authStore.user.name}
									</p>
									<p class="text-xs truncate text-zinc-400 dark:text-zinc-500">
										{authStore.user.email}
									</p>
									<span
										class="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xxs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 capitalize"
									>
										{authStore.user.role}
									</span>
								</div>

								{#if authStore.isAdmin}
									<a
										href="/admin/dashboard"
										onclick={() => (isProfileDropdownOpen = false)}
										class="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
									>
										<LayoutDashboard class="w-4 h-4 text-violet-500" />
										<span>Admin Panel</span>
									</a>
								{/if}

								<a
									href="/profile"
									onclick={() => (isProfileDropdownOpen = false)}
									class="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
								>
									<User class="w-4 h-4 text-violet-500" />
									<span>My Profile</span>
								</a>

								<a
									href="/orders"
									onclick={() => (isProfileDropdownOpen = false)}
									class="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
								>
									<ShoppingCart class="w-4 h-4 text-violet-500" />
									<span>My Orders</span>
								</a>

								<button
									onclick={handleLogout}
									class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-rose-600 dark:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-800 mt-1"
								>
									<LogOut class="w-4 h-4" />
									<span>Sign Out</span>
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/login"
						class="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-200 dark:hover:text-violet-400 px-3 py-1.5 transition-colors"
						>Log In</a
					>
					<a
						href="/register"
						class="text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-600/20"
						>Sign Up</a
					>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden flex items-center space-x-2">
				<!-- Light/Dark Mode Toggle for Mobile -->
				<button
					onclick={toggleTheme}
					class="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
				>
					{#if themeStore.mode === 'dark'}
						<Sun class="w-5 h-5 text-amber-400" />
					{:else}
						<Moon class="w-5 h-5 text-indigo-600" />
					{/if}
				</button>

				<!-- Mobile Cart -->
				<a
					href="/cart"
					class="p-2 relative text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>
					<ShoppingCart class="w-5 h-5" />
					{#if cartStore.count > 0}
						<span
							class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xxs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-violet-600 rounded-full"
						>
							{cartStore.count}
						</span>
					{/if}
				</a>

				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
					aria-label="Toggle main menu"
				>
					{#if isMobileMenuOpen}
						<X class="w-6 h-6" />
					{:else}
						<Menu class="w-6 h-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Panel -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-2 transition-all"
		>
			<a
				href="/"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>Home</a
			>
			<a
				href="/products"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>Mobiles</a
			>
			<a
				href="/about"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>About Us</a
			>
			<a
				href="/faq"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>FAQs</a
			>
			<a
				href="/contact"
				onclick={() => (isMobileMenuOpen = false)}
				class="block px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
				>Contact</a
			>

			<div class="border-t border-zinc-200 dark:border-zinc-800 my-2 pt-2">
				{#if authStore.loading}
					<div class="h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
				{:else if authStore.user}
					<div class="px-3 py-2">
						<p class="text-xs text-zinc-400">Logged in as</p>
						<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
							{authStore.user.name}
						</p>
						<p class="text-xs text-zinc-400 truncate">{authStore.user.email}</p>
					</div>

					{#if authStore.isAdmin}
						<a
							href="/admin/dashboard"
							onclick={() => (isMobileMenuOpen = false)}
							class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-violet-600 dark:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
						>
							<LayoutDashboard class="w-5 h-5" />
							<span>Admin Panel</span>
						</a>
					{/if}

					<a
						href="/profile"
						onclick={() => (isMobileMenuOpen = false)}
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
					>
						<User class="w-5 h-5" />
						<span>My Profile</span>
					</a>

					<a
						href="/orders"
						onclick={() => (isMobileMenuOpen = false)}
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
					>
						<ShoppingCart class="w-5 h-5" />
						<span>My Orders</span>
					</a>

					<button
						onclick={handleLogout}
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left"
					>
						<LogOut class="w-5 h-5" />
						<span>Sign Out</span>
					</button>
				{:else}
					<div class="grid grid-cols-2 gap-2 mt-2">
						<a
							href="/login"
							onclick={() => (isMobileMenuOpen = false)}
							class="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
							>Log In</a
						>
						<a
							href="/register"
							onclick={() => (isMobileMenuOpen = false)}
							class="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700"
							>Sign Up</a
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
