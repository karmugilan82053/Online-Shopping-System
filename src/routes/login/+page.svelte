<script>
	import { loginUser } from '$lib/auth';
	import { authStore, toastStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import { isUsingMock } from '$lib/firebase';
	import { Mail, Lock, LogIn, ShieldAlert, Sparkles, User } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let isLoggingIn = $state(false);

	// Redirect if user is already logged in
	$effect(() => {
		if (!authStore.loading && authStore.user) {
			if (authStore.user.role === 'admin') {
				goto('/admin/dashboard');
			} else {
				goto('/');
			}
		}
	});

	async function handleSubmit(e) {
		e.preventDefault();
		if (!email || !password) {
			toastStore.show('Please fill in all fields.', 'error');
			return;
		}

		isLoggingIn = true;
		try {
			const loggedInUser = await loginUser(email, password);
			toastStore.show(`Welcome back, ${loggedInUser.name}!`, 'success');
			if (loggedInUser.role === 'admin') {
				goto('/admin/dashboard');
			} else {
				goto('/');
			}
		} catch (err) {
			toastStore.show(err.message || 'Authentication failed. Please check credentials.', 'error');
		} finally {
			isLoggingIn = false;
		}
	}

	function fillCredentials(type) {
		if (type === 'admin') {
			email = 'admin@mobile.com';
			password = 'admin123';
		} else if (type === 'customer') {
			email = 'customer@mobile.com';
			password = 'customer123';
		}
	}
</script>

<svelte:head>
	<title>Sign In | MobiShop</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16 sm:px-6 flex flex-col justify-center min-h-[80vh]">
	<!-- Card Container -->
	<div
		class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg"
	>
		<div class="text-center mb-8">
			<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
				Welcome Back
			</h1>
			<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
				Sign in to access your MobiShop account
			</p>
		</div>

		<!-- Login Form -->
		<form onsubmit={handleSubmit} class="space-y-5">
			<div>
				<label
					for="email"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Email Address</label
				>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
						<Mail class="w-4 h-4" />
					</span>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						placeholder="email@example.com"
						class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<div>
				<label
					for="password"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Password</label
				>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
						<Lock class="w-4 h-4" />
					</span>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						placeholder="••••••••"
						class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isLoggingIn}
				class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102 cursor-pointer mt-2"
			>
				{#if isLoggingIn}
					<span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
					></span>
					<span>Signing In...</span>
				{:else}
					<LogIn class="w-4 h-4" />
					<span>Sign In</span>
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center text-sm">
			<span class="text-zinc-400">Don't have an account? </span>
			<a href="/register" class="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
				>Register</a
			>
		</div>

		<!-- Mock mode auto-fills (Academic evaluation guide) -->
		{#if isUsingMock}
			<div class="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
				<div
					class="flex items-center gap-1.5 mb-3 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider"
				>
					<Sparkles class="w-3.5 h-3.5" />
					<span>Sandbox Auto-Fill</span>
				</div>
				<p class="text-xxs text-zinc-400 dark:text-zinc-500 mb-3">
					Click below to load pre-seeded sandbox accounts.
				</p>
				<div class="grid grid-cols-2 gap-2">
					<button
						onclick={() => fillCredentials('customer')}
						type="button"
						class="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 dark:border-zinc-800 text-xxs font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
					>
						<User class="w-3.5 h-3.5 text-zinc-400" />
						<span>Customer Login</span>
					</button>

					<button
						onclick={() => fillCredentials('admin')}
						type="button"
						class="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 dark:border-zinc-800 text-xxs font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
					>
						<ShieldAlert class="w-3.5 h-3.5 text-violet-500" />
						<span>Admin Login</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
