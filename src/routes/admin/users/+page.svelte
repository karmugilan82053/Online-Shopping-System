<script>
	import { getAllUsers } from '$lib/firestore';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Users, Search, AlertTriangle, ShieldCheck, User } from 'lucide-svelte';

	let users = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');

	// Pagination
	let currentPage = $state(1);
	const itemsPerPage = 8;

	$effect(() => {
		loadUsers();
	});

	async function loadUsers() {
		loading = true;
		try {
			users = await getAllUsers();
		} catch (error) {
			console.error('Failed to load user directory:', error);
		} finally {
			loading = false;
		}
	}

	// Filtered users
	const filteredUsers = $derived(
		users.filter(
			(u) =>
				u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const paginatedUsers = $derived(
		filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredUsers.length / itemsPerPage) || 1);

	$effect(() => {
		searchQuery;
		currentPage = 1;
	});
</script>

<svelte:head>
	<title>Registered Users | Admin MobiShop</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div>
		<h1
			class="text-3xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
		>
			<Users class="w-7 h-7 text-violet-600 dark:text-violet-400" />
			<span>User Directory</span>
		</h1>
		<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
			Directory of registered customers and administrators
		</p>
	</div>

	<!-- Controls & search -->
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
				placeholder="Search name, email..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-all shadow-xs"
			/>
		</div>

		<div class="text-xxs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
			Total Count: {filteredUsers.length}
		</div>
	</div>

	<!-- Table Panel -->
	<div
		class="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
	>
		{#if loading}
			<div class="flex items-center justify-center py-20">
				<Spinner size="lg" />
			</div>
		{:else if filteredUsers.length === 0}
			<div class="text-center py-16 p-8 max-w-sm mx-auto">
				<AlertTriangle class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
				<p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No users found</p>
				<p class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
					We couldn't find any registered accounts matching the parameters.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse text-xs">
					<thead>
						<tr
							class="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-xxs uppercase tracking-wider font-bold"
						>
							<th class="p-4">Identity</th>
							<th class="p-4">Name</th>
							<th class="p-4">Email</th>
							<th class="p-4">System Role</th>
							<th class="p-4 text-right">Registration Date</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/40">
						{#each paginatedUsers as user (user.uid)}
							<tr class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors">
								<!-- Identity avatar/icon -->
								<td class="p-4">
									<div
										class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold"
									>
										{#if user.role === 'admin'}
											<ShieldCheck class="w-4 h-4 text-violet-600 dark:text-violet-400" />
										{:else}
											<User class="w-4 h-4 text-zinc-400" />
										{/if}
									</div>
								</td>
								<!-- Name -->
								<td class="p-4 font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</td>
								<!-- Email -->
								<td class="p-4 font-mono text-zinc-500">{user.email}</td>
								<!-- Role -->
								<td class="p-4">
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border text-xxs capitalize
										{user.role === 'admin'
											? 'bg-violet-100 text-violet-850 dark:bg-violet-950/40 dark:text-violet-300 border-violet-200/50'
											: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/50'}"
									>
										{user.role}
									</span>
								</td>
								<!-- Reg Date -->
								<td class="p-4 text-right text-zinc-500 text-xxs font-mono">
									{user.createdAt
										? new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
										: 'Simulated'}
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
