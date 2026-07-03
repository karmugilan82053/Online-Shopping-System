import { onAuthChanged } from './auth';
import {
	getCartItems,
	addToCart,
	updateCartQuantity,
	removeCartItem,
	clearUserCart
} from './firestore';

// ==========================================
// THEME STORE
// ==========================================

export function createThemeStore() {
	let mode = $state('dark'); // Default to beautiful dark mode!

	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('theme');
		if (saved) {
			mode = saved;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			mode = 'light';
		}
		// Apply on load
		document.documentElement.classList.toggle('dark', mode === 'dark');
	}

	return {
		get mode() {
			return mode;
		},
		toggle() {
			mode = mode === 'dark' ? 'light' : 'dark';
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', mode);
				document.documentElement.classList.toggle('dark', mode === 'dark');
			}
		}
	};
}

export const themeStore = createThemeStore();

// ==========================================
// TOAST STORE (NOTIFICATIONS)
// ==========================================

export function createToastStore() {
	let toasts = $state([]);

	return {
		get toasts() {
			return toasts;
		},
		show(message, type = 'success', duration = 4000) {
			const id = Math.random().toString(36).substr(2, 9);
			toasts = [...toasts, { id, message, type }];

			setTimeout(() => {
				this.remove(id);
			}, duration);
		},
		remove(id) {
			toasts = toasts.filter((t) => t.id !== id);
		}
	};
}

export const toastStore = createToastStore();

// ==========================================
// AUTH STORE
// ==========================================

export function createAuthStore() {
	let user = $state(null);
	let loading = $state(true);

	// Setup listener
	if (typeof window !== 'undefined') {
		onAuthChanged((currentUser) => {
			user = currentUser;
			loading = false;
		});
	}

	return {
		get user() {
			return user;
		},
		get loading() {
			return loading;
		},
		get isLoggedIn() {
			return user !== null;
		},
		get isAdmin() {
			return user !== null && user.role === 'admin';
		}
	};
}

export const authStore = createAuthStore();

// ==========================================
// CART STORE
// ==========================================

export function createCartStore() {
	let items = $state([]);
	let loading = $state(false);

	const count = $derived(items.reduce((acc, item) => acc + item.quantity, 0));
	const total = $derived(
		items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
	);

	return {
		get items() {
			return items;
		},
		get loading() {
			return loading;
		},
		get count() {
			return count;
		},
		get total() {
			return total;
		},
		async load(userId) {
			if (!userId) {
				items = [];
				return;
			}
			loading = true;
			try {
				items = await getCartItems(userId);
			} catch (err) {
				console.error('Failed to load cart items:', err);
				toastStore.show('Failed to sync shopping cart.', 'error');
			} finally {
				loading = false;
			}
		},
		async add(userId, productId, quantity = 1) {
			if (!userId) {
				toastStore.show('Please log in to add items to your cart.', 'error');
				return false;
			}
			loading = true;
			try {
				await addToCart(userId, productId, quantity);
				await this.load(userId);
				toastStore.show('Added to cart successfully!', 'success');
				return true;
			} catch (err) {
				toastStore.show(err.message || 'Failed to add item to cart.', 'error');
				return false;
			} finally {
				loading = false;
			}
		},
		async update(userId, productId, quantity) {
			if (!userId) return false;
			loading = true;
			try {
				await updateCartQuantity(userId, productId, quantity);
				await this.load(userId);
				return true;
			} catch (err) {
				toastStore.show(err.message || 'Failed to update quantity.', 'error');
				return false;
			} finally {
				loading = false;
			}
		},
		async remove(userId, productId) {
			if (!userId) return false;
			loading = true;
			try {
				await removeCartItem(userId, productId);
				await this.load(userId);
				toastStore.show('Item removed from cart.', 'success');
				return true;
			} catch (err) {
				toastStore.show('Failed to remove item.', 'error');
				return false;
			} finally {
				loading = false;
			}
		},
		async clear(userId) {
			if (!userId) return false;
			loading = true;
			try {
				await clearUserCart(userId);
				items = [];
				return true;
			} catch (err) {
				console.error('Failed to clear cart:', err);
				return false;
			} finally {
				loading = false;
			}
		}
	};
}

export const cartStore = createCartStore();
