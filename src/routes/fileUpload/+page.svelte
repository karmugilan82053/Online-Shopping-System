<script>
	let selectedFile = null;
	let message = '';
	let uploadedFileUrl = '';

	function handleFileChange(event) {
		const input = event.target;
		selectedFile = input.files?.[0] || null;
	}

	async function uploadFile() {
		if (!selectedFile) {
			message = 'Please select a file first';
			return;
		}

		const formData = new FormData();
		formData.append('file', selectedFile);

		const response = await fetch('/api/postFile', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (!response.ok) {
			message = result.message;
			return;
		}

		message = result.message;
		uploadedFileUrl = result.fileUrl;
	}
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<div class="max-w-2xl mx-auto">
		<div class="bg-white rounded-lg shadow-lg p-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">File Upload Demo</h1>

			<div class="space-y-4">
				<input
					type="file"
					class="input border border-gray-400 rounded-lg active:border-emerald-600 focus:border-emerald-600 p-4 w-full"
					onchange={handleFileChange}
				/>

				<button
					class="btn p-4 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 font-semibold hover:bg-emerald-200 transition w-full"
					onclick={uploadFile}
				>
					Upload File
				</button>
			</div>

			{#if selectedFile}
				<p class="mt-4 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 p-4">
					Selected file: <strong>{selectedFile.name}</strong>
				</p>
			{/if}

			{#if message}
				<p class="mt-4 rounded-lg bg-blue-100 border border-blue-400 text-blue-900 p-4">
					{message}
				</p>
			{/if}

			{#if uploadedFileUrl}
				<p class="mt-4 rounded-lg bg-green-100 border border-green-400 text-green-900 p-4">
					Uploaded file:
					<a href={uploadedFileUrl} target="_blank" class="font-semibold underline">
						View File
					</a>
				</p>
			{/if}
		</div>
	</div>
</div>
