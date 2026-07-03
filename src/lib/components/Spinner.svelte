<script>
	let { size = 'md', color = 'violet' } = $props();

	const sizeClasses = {
		xs: 'w-4 h-4 border-2',
		sm: 'w-6 h-6 border-2',
		md: 'w-10 h-10 border-3',
		lg: 'w-16 h-16 border-4'
	};

	const colorClasses = {
		violet:
			'border-violet-600 border-t-transparent dark:border-violet-500 dark:border-t-transparent',
		emerald: 'border-emerald-500 border-t-transparent',
		white: 'border-white border-t-transparent'
	};
</script>

<div class="flex items-center justify-center">
	<div
		class="animate-spin rounded-full {sizeClasses[size] || sizeClasses.md} {colorClasses[color] ||
			colorClasses.violet}"
		role="status"
	>
		<span class="sr-only">Loading...</span>
	</div>
</div>
