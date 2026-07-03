<script>
	import { toastStore } from '$lib/store';
	import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-svelte';

	// Load contact details from env, falling back to defaults if not set
	const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL || 'karmugilan82052@gmail.com / kaliyappan1911@gmail.com / kamalesh.k1231@gamil.com';
	const contactPhone = import.meta.env.PUBLIC_CONTACT_PHONE || '+91 76677 22440 / +91 93442 17880';
	const contactAddress = import.meta.env.PUBLIC_CONTACT_ADDRESS || 'Sona College of Technology, Salem, TN';

	let fullName = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!fullName || !email || !message) {
			toastStore.show('Please fill in all required fields.', 'error');
			return;
		}

		isSubmitting = true;
		// Simulate network call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		toastStore.show('Thank you! Your inquiry has been sent.', 'success');
		fullName = '';
		email = '';
		subject = '';
		message = '';
		isSubmitting = false;
	}
</script>

<svelte:head>
	<title>Contact Us | MobiShop</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="text-center mb-16">
		<span
			class="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-600/10 px-3 py-1 rounded-full"
			>Get In Touch</span
		>
		<h1
			class="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white mt-4"
		>
			Contact Our Support Team
		</h1>
		<p class="text-md text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto">
			Have a query about billing, returns, or technical setup? We are here to help.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
		<!-- Sidebar Info -->
		<div class="space-y-6 lg:col-span-1">
			<div
				class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs"
			>
				<h2 class="text-lg font-bold font-display text-zinc-900 dark:text-white mb-6">
					Contact Channels
				</h2>

				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div
							class="p-2 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl"
						>
							<Mail class="w-5 h-5" />
						</div>
						<div>
							<h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
								Email Inquiries
							</h3>
							<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{contactEmail}</p>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div
							class="p-2 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl"
						>
							<Phone class="w-5 h-5" />
						</div>
						<div>
							<h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Call Support</h3>
							<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{contactPhone}</p>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div
							class="p-2 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl"
						>
							<MapPin class="w-5 h-5" />
						</div>
						<div>
							<h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
								Main Headquarters
							</h3>
							<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
								{contactAddress}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Contact Form -->
		<div class="lg:col-span-2">
			<form
				onsubmit={handleSubmit}
				class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6"
			>
				<h2 class="text-xl font-bold font-display text-zinc-900 dark:text-white">
					Send Us a Message
				</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div>
						<label
							for="fullName"
							class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
							>Full Name *</label
						>
						<input
							type="text"
							id="fullName"
							bind:value={fullName}
							required
							placeholder="John Doe"
							class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
						/>
					</div>

					<div>
						<label
							for="email"
							class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
							>Email Address *</label
						>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							placeholder="john@example.com"
							class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
						/>
					</div>
				</div>

				<div>
					<label
						for="subject"
						class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
						>Subject</label
					>
					<input
						type="text"
						id="subject"
						bind:value={subject}
						placeholder="Order question, setup help..."
						class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors"
					/>
				</div>

				<div>
					<label
						for="message"
						class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2"
						>Message *</label
					>
					<textarea
						id="message"
						bind:value={message}
						required
						rows="5"
						placeholder="How can we assist you?"
						class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:focus:ring-violet-500/50 transition-colors resize-none"
					></textarea>
				</div>

				<div class="flex justify-end pt-2">
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 transition-all shadow-md hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 cursor-pointer"
					>
						{#if isSubmitting}
							<span
								class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
							></span>
							<span>Sending...</span>
						{:else}
							<Send class="w-4 h-4" />
							<span>Send Message</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
