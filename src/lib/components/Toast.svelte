<script>
	import { toastStore } from '$lib/store';
	import { X, CheckCircle2, AlertCircle, Info } from 'lucide-svelte';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 pointer-events-auto hover:scale-102
				{toast.type === 'success'
				? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
				: ''}
				{toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' : ''}
				{toast.type === 'info'
				? 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400'
				: ''}"
		>
			<div class="flex-shrink-0">
				{#if toast.type === 'success'}
					<CheckCircle2 class="w-5 h-5" />
				{:else if toast.type === 'error'}
					<AlertCircle class="w-5 h-5" />
				{:else}
					<Info class="w-5 h-5" />
				{/if}
			</div>

			<p class="text-sm font-medium flex-1">{toast.message}</p>

			<button
				onclick={() => toastStore.remove(toast.id)}
				class="text-current opacity-70 hover:opacity-100 p-0.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
				aria-label="Close notification"
			>
				<X class="w-4 h-4" />
			</button>
		</div>
	{/each}
</div>
