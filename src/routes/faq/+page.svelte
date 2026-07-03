<script>
	import { ChevronDown, HelpCircle } from 'lucide-svelte';

	let faqs = $state([
		{
			q: 'What shipping options do you offer for mobile phones?',
			a: 'We offer standard delivery (3-5 business days) and expedited shipping (1-2 business days) across all regions. All smartphone shipments are fully insured and require a signature upon delivery.',
			open: false
		},
		{
			q: 'What is your return policy?',
			a: 'We offer a 14-day replacement or return window for all mobile phones. The device must be in original condition, with original packaging, accessories, and promotional items intact.',
			open: false
		},
		{
			q: 'Do the products come with a warranty?',
			a: 'Yes, all devices listed on MobiShop are 100% genuine and come with a standard 1-year manufacturer warranty. You can redeem your warranty at authorized brand centers with your order receipt invoice.',
			open: false
		},
		{
			q: 'How does the offline simulator mode work?',
			a: "MobiShop features a dual-mode database. If you haven't configured Firebase credentials, the system automatically uses a browser localStorage mock database. All registrations, cart actions, image uploads, and admin orders work in offline sandbox mode so you can test all features instantly!",
			open: false
		},
		{
			q: 'How can I connect my own Firebase account?',
			a: 'Create a `.env` file in the project root directory and add your Firebase configurations: API key, project ID, auth domain, storage bucket, etc. Once the app restarts, it will automatically switch from Mock Mode to your live Cloud Firebase backend.',
			open: false
		}
	]);

	function toggleFaq(index) {
		faqs[index].open = !faqs[index].open;
	}
</script>

<svelte:head>
	<title>Frequently Asked Questions | MobiShop</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="text-center mb-12">
		<HelpCircle class="w-12 h-12 text-violet-600 dark:text-violet-400 mx-auto" />
		<h1
			class="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white mt-4"
		>
			Frequently Asked Questions
		</h1>
		<p class="text-md text-zinc-500 dark:text-zinc-400 mt-2">
			Need help with orders, delivery, or configuring your workspace? Find the answers below.
		</p>
	</div>

	<!-- FAQ Accordion -->
	<div class="space-y-4">
		{#each faqs as faq, index}
			<div
				class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs transition-colors duration-200"
			>
				<button
					onclick={() => toggleFaq(index)}
					class="w-full flex items-center justify-between p-5 text-left font-medium text-zinc-950 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
					aria-expanded={faq.open}
				>
					<span class="text-base sm:text-lg font-display font-semibold">{faq.q}</span>
					<ChevronDown
						class="w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 {faq.open
							? 'rotate-180 text-violet-600'
							: ''}"
					/>
				</button>

				<!-- Collapsible content -->
				<div
					class="accordion-content transition-all duration-300 {faq.open
						? 'open border-t border-zinc-100 dark:border-zinc-800'
						: ''}"
				>
					<div
						class="p-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/20"
					>
						{faq.a}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
