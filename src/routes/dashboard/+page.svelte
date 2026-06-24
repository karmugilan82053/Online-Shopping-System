<script>
	import { page } from '$app/stores';

	async function logout() {
		const response = await fetch('/logout', {
			method: 'POST'
		});

		if (response.ok) {
			window.location.href = '/login';
		}
	}
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<div class="max-w-4xl mx-auto">
		<div class="bg-white rounded-lg shadow-lg p-8">
			<div class="flex justify-between items-center mb-8">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p class="text-gray-600 mt-2">
						Welcome, <strong>{$page.data.user?.name || 'User'}</strong>
					</p>
				</div>
				<button
					on:click={logout}
					class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
				>
					Logout
				</button>
			</div>

			<div class="grid md:grid-cols-2 gap-6">
				<div class="border border-gray-200 rounded-lg p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-2">User Role</h2>
					<p class="text-gray-600 capitalize">{$page.data.user?.role || 'N/A'}</p>
				</div>

				<div class="border border-gray-200 rounded-lg p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-2">User ID</h2>
					<p class="text-gray-600">{$page.data.user?.id || 'N/A'}</p>
				</div>
			</div>

			<div class="mt-8">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
				<div class="space-y-2">
					<a
						href="/fileUpload"
						class="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-center"
					>
						Go to File Upload
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
