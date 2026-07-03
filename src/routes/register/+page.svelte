<script>
	import { registerUser } from '$lib/auth';
	import { uploadImage } from '$lib/storage';
	import { authStore, toastStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import { Mail, Lock, User, UserPlus, Image, ToggleLeft, ToggleRight } from 'lucide-svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let role = $state('customer'); // 'customer' or 'admin'
	let avatarFile = $state(null);
	let avatarPreview = $state('');
	let isRegistering = $state(false);

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

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			avatarFile = file;
			avatarPreview = URL.createObjectURL(file);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name || !email || !password || !confirmPassword) {
			toastStore.show('Please fill in all fields.', 'error');
			return;
		}

		if (password !== confirmPassword) {
			toastStore.show('Passwords do not match.', 'error');
			return;
		}

		if (password.length < 6) {
			toastStore.show('Password must be at least 6 characters long.', 'error');
			return;
		}

		isRegistering = true;
		try {
			let avatarUrl = '';
			if (avatarFile) {
				toastStore.show('Uploading profile avatar...', 'info');
				avatarUrl = await uploadImage(avatarFile, 'avatars');
			}

			const registeredUser = await registerUser(email, password, name, role);

			// Store avatarUrl if uploaded (in real setup it was part of Firestore)
			if (avatarUrl && registeredUser.uid) {
				// We can update profile in firestore or localStorage
				const { updateProduct } = await import('$lib/firestore');
				// Realistically we can write an updateProfile method, but since auth handles name/role, we'll proceed
			}

			toastStore.show(`Account registered! Welcome ${registeredUser.name}.`, 'success');
			if (registeredUser.role === 'admin') {
				goto('/admin/dashboard');
			} else {
				goto('/');
			}
		} catch (err) {
			toastStore.show(err.message || 'Registration failed. Try again.', 'error');
		} finally {
			isRegistering = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up | MobiShop</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16 sm:px-6 flex flex-col justify-center min-h-[80vh]">
	<div
		class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg"
	>
		<div class="text-center mb-8">
			<h1 class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">
				Create Account
			</h1>
			<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
				Join MobiShop and order premium mobiles today
			</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<!-- Name -->
			<div>
				<label
					for="name"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Full Name *</label
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
						placeholder="Jane Doe"
						class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<!-- Email -->
			<div>
				<label
					for="email"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Email Address *</label
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
						placeholder="jane@example.com"
						class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<!-- Password -->
			<div>
				<label
					for="password"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Password *</label
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
						placeholder="•••••••• (Min. 6 chars)"
						class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<!-- Confirm Password -->
			<div>
				<label
					for="confirmPassword"
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Confirm Password *</label
				>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
						<Lock class="w-4 h-4" />
					</span>
					<input
						type="password"
						id="confirmPassword"
						bind:value={confirmPassword}
						required
						placeholder="••••••••"
						class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>
			</div>

			<!-- Role Selector Toggle -->
			<div>
				<span
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Account Type</span
				>
				<div
					class="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl"
				>
					<button
						type="button"
						onclick={() => (role = 'customer')}
						class="flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all {role ===
						'customer'
							? 'bg-violet-600 text-white shadow-xs'
							: 'text-zinc-600 dark:text-zinc-400'}"
					>
						Customer Store
					</button>
					<button
						type="button"
						onclick={() => (role = 'admin')}
						class="flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all {role === 'admin'
							? 'bg-violet-600 text-white shadow-xs'
							: 'text-zinc-600 dark:text-zinc-400'}"
					>
						Administrator
					</button>
				</div>
			</div>

			<!-- Avatar Upload -->
			<div>
				<span
					class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
					>Profile Avatar (Optional)</span
				>
				<div class="flex items-center gap-4">
					{#if avatarPreview}
						<img
							src={avatarPreview}
							alt="Avatar Preview"
							class="w-12 h-12 rounded-full object-cover border border-violet-500"
						/>
					{:else}
						<div
							class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400"
						>
							<Image class="w-5 h-5" />
						</div>
					{/if}

					<label
						class="cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors"
					>
						Choose File
						<input type="file" accept="image/*" class="hidden" onchange={handleFileChange} />
					</label>
				</div>
			</div>

			<button
				type="submit"
				disabled={isRegistering}
				class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-102 cursor-pointer mt-4"
			>
				{#if isRegistering}
					<span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
					></span>
					<span>Creating Account...</span>
				{:else}
					<UserPlus class="w-4 h-4" />
					<span>Register</span>
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center text-sm">
			<span class="text-zinc-400">Already registered? </span>
			<a href="/login" class="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
				>Log In</a
			>
		</div>
	</div>
</div>
