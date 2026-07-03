<script>
	import { authStore, toastStore } from '$lib/store';
	import { logoutUser } from '$lib/auth';
	import { goto } from '$app/navigation';
	import {
		User,
		Mail,
		Calendar,
		ShieldCheck,
		LogOut,
		ShoppingCart,
		ListCollapse
	} from 'lucide-svelte';

	let name = $state('');
	let isSaving = $state(false);

	// Guard route: if not logged in and not loading, redirect to login
	$effect(() => {
		if (!authStore.loading && !authStore.user) {
			goto('/login');
		} else if (authStore.user) {
			name = authStore.user.name;
		}
	});

	async function handleUpdateProfile(e) {
		e.preventDefault();
		if (!name) {
			toastStore.show('Name cannot be empty.', 'error');
			return;
		}

		isSaving = true;
		try {
			// In simulated mock, update mock user name
			if (typeof window !== 'undefined') {
				const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
				const userIdx = mockUsers.findIndex((u) => u.uid === authStore.user.uid);
				if (userIdx !== -1) {
					mockUsers[userIdx].name = name;
					localStorage.setItem('mock_users', JSON.stringify(mockUsers));

					// Update current user session
					const currentUser = JSON.parse(localStorage.getItem('mock_current_user') || '{}');
					currentUser.name = name;
					localStorage.setItem('mock_current_user', JSON.stringify(currentUser));

					// Reload auth
					window.location.reload();
				} else {
					toastStore.show('Profile updated successfully!', 'success');
				}
			}
		} catch (error) {
			toastStore.show('Failed to update profile.', 'error');
		} finally {
			isSaving = false;
		}
	}

	async function handleLogout() {
		try {
			await logoutUser();
			toastStore.show('Logged out successfully!', 'info');
			goto('/login');
		} catch (error) {
			toastStore.show('Logout failed.', 'error');
		}
	}
</script>

<svelte:head>
	<title>My Profile | MobiShop</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	{#if authStore.loading || !authStore.user}
		<div class="flex items-center justify-center min-h-[50vh]">
			<div
				class="animate-spin rounded-full w-10 h-10 border-3 border-violet-600 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
			<!-- Profile Card -->
			<div
				class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm text-center md:col-span-1"
			>
				<div class="relative w-24 h-24 mx-auto mb-4">
					{#if authStore.user.avatarUrl}
						<img
							src={authStore.user.avatarUrl}
							alt="Avatar"
							class="w-full h-full rounded-full object-cover border-2 border-violet-500"
						/>
					{:else}
						<div
							class="w-full h-full rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center border-2 border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold text-3xl"
						>
							{authStore.user.name.charAt(0).toUpperCase()}
						</div>
					{/if}
				</div>

				<h2 class="text-xl font-bold font-display text-zinc-900 dark:text-white truncate">
					{authStore.user.name}
				</h2>
				<p class="text-xs text-zinc-400 dark:text-zinc-500 truncate mb-4">{authStore.user.email}</p>

				<span
					class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 capitalize mb-6"
				>
					{authStore.user.role} Account
				</span>

				<div class="space-y-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
					<a
						href="/cart"
						class="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
					>
						<span class="flex items-center gap-2"
							><ShoppingCart class="w-4 h-4 text-violet-500" /> My Cart</span
						>
						<span class="text-xs text-zinc-400 dark:text-zinc-500">View Items &rarr;</span>
					</a>
					<a
						href="/orders"
						class="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
					>
						<span class="flex items-center gap-2"
							><ListCollapse class="w-4 h-4 text-violet-500" /> Order History</span
						>
						<span class="text-xs text-zinc-400 dark:text-zinc-500">View Status &rarr;</span>
					</a>
				</div>
			</div>

			<!-- Profile Edit Form -->
			<div
				class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm md:col-span-2 space-y-6"
			>
				<h2 class="text-2xl font-bold font-display text-zinc-900 dark:text-white">
					Account details
				</h2>

				<form onsubmit={handleUpdateProfile} class="space-y-4">
					<div>
						<label
							for="name"
							class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
							>Display Name</label
						>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
								<User class="w-4 h-4" />
							</span>
							<input
								type="text"
								id="name"
								bind:value={name}
								required
								class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<div>
							<span
								class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
								>Email Address</span
							>
							<div
								class="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500"
							>
								<Mail class="w-4 h-4 text-zinc-400 flex-shrink-0" />
								<span class="truncate">{authStore.user.email}</span>
							</div>
						</div>

						<div>
							<span
								class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
								>Account ID</span
							>
							<div
								class="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500"
							>
								<ShieldCheck class="w-4 h-4 text-zinc-400 flex-shrink-0" />
								<span class="truncate font-mono text-xs">{authStore.user.uid}</span>
							</div>
						</div>
					</div>

					<div
						class="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-6"
					>
						<button
							type="button"
							onclick={handleLogout}
							class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
						>
							<LogOut class="w-4 h-4" />
							<span>Sign Out</span>
						</button>

						<button
							type="submit"
							disabled={isSaving}
							class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 transition-all disabled:opacity-50 cursor-pointer"
						>
							{#if isSaving}
								<span
									class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
								></span>
								<span>Saving...</span>
							{:else}
								Save Changes
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
