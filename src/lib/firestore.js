import { db, isUsingMock } from './firebase';
import {
	collection,
	doc,
	addDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	onSnapshot
} from 'firebase/firestore';

// ==========================================
// MOCK DATA SEEDING & UTILS
// ==========================================

const DEFAULT_PRODUCTS = [
	{
		id: 'prod-apple-iphone15',
		name: 'iPhone 15 Pro Max',
		brand: 'Apple',
		price: 139900,
		description:
			'Titanium design with A17 Pro chip, 48MP main camera, 5x Telephoto camera, and USB-C port.',
		imageUrl:
			'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
		stock: 12,
		specs: {
			screen: '6.7" Super Retina XDR OLED',
			processor: 'Apple A17 Pro (3nm)',
			ram: '8 GB',
			storage: '256 GB',
			battery: '4441 mAh with 20W fast charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-samsung-s24',
		name: 'Galaxy S24 Ultra',
		brand: 'Samsung',
		price: 129999,
		description:
			'Built-in S Pen, Circle to Search with Google, 200MP main camera, Snapdragon 8 Gen 3, and Titanium frame.',
		imageUrl: '/galaxys24ultra.png',
		stock: 8,
		specs: {
			screen: '6.8" Dynamic AMOLED 2X, 120Hz',
			processor: 'Snapdragon 8 Gen 3',
			ram: '12 GB',
			storage: '512 GB',
			battery: '5000 mAh with 45W fast charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-google-pixel8',
		name: 'Pixel 8 Pro',
		brand: 'Google',
		price: 106999,
		description:
			'Advanced Google Tensor G3 chip, Magic Editor for photo refinement, and 7 years of OS updates.',
		imageUrl:
			'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
		stock: 5,
		specs: {
			screen: '6.7" Super Actua Display OLED',
			processor: 'Google Tensor G3 (4nm)',
			ram: '12 GB',
			storage: '128 GB',
			battery: '5050 mAh with 30W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-oneplus-12',
		name: 'OnePlus 12',
		brand: 'OnePlus',
		price: 64999,
		description:
			'4th Gen Hasselblad Camera for Mobile, 100W SUPERVOOC fast charging, and dual cryo-velocity cooling.',
		imageUrl: '/oneplus12.png',
		stock: 15,
		specs: {
			screen: '6.82" 2K 120Hz AMOLED ProXDR',
			processor: 'Snapdragon 8 Gen 3',
			ram: '16 GB',
			storage: '512 GB',
			battery: '5400 mAh with 100W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-xiaomi-13pro',
		name: 'Redmi Note 13 Pro+',
		brand: 'Xiaomi',
		price: 31999,
		description:
			'200MP camera with Optical Image Stabilization (OIS), IP68 dust/water protection, and 120W HyperCharge.',
		imageUrl: '/redminote13pro.png',
		stock: 22,
		specs: {
			screen: '6.67" 1.5K 120Hz Curved CrystalRes AMOLED',
			processor: 'MediaTek Dimensity 7200-Ultra',
			ram: '8 GB',
			storage: '256 GB',
			battery: '5000 mAh with 120W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-samsung-fold6',
		name: 'Galaxy Z Fold6',
		brand: 'Samsung',
		price: 164999,
		description:
			'Next-generation foldable phone with Snapdragon 8 Gen 3, dual display, enhanced durability, and advanced Galaxy AI multitasking.',
		imageUrl:
			'https://images.unsplash.com/photo-1651874217551-789a7cb1b212?w=600&auto=format&fit=crop&q=80',
		stock: 6,
		specs: {
			screen: '7.6" Foldable Dynamic AMOLED 2X (Main), 6.3" (Cover)',
			processor: 'Snapdragon 8 Gen 3 for Galaxy',
			ram: '12 GB',
			storage: '512 GB',
			battery: '4400 mAh with 25W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-apple-iphone15pro',
		name: 'iPhone 15 Pro',
		brand: 'Apple',
		price: 129900,
		description:
			'Aerospace-grade titanium design, A17 Pro chip, customizable Action button, and advanced 3x Telephoto camera.',
		imageUrl: '/iphone15pro.png',
		stock: 10,
		specs: {
			screen: '6.1" Super Retina XDR OLED',
			processor: 'Apple A17 Pro (3nm)',
			ram: '8 GB',
			storage: '128 GB',
			battery: '3274 mAh with 20W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-oneplus-open',
		name: 'OnePlus Open',
		brand: 'OnePlus',
		price: 139999,
		description:
			'Ultralight, thin foldable smartphone featuring Dual ProXDR displays and Hasselblad camera system.',
		imageUrl:
			'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=600&auto=format&fit=crop&q=80',
		stock: 7,
		specs: {
			screen: '7.82" Fluid AMOLED (Main), 6.31" (Cover)',
			processor: 'Snapdragon 8 Gen 2',
			ram: '16 GB',
			storage: '512 GB',
			battery: '4805 mAh with 67W charging'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-xiaomi-14ultra',
		name: 'Xiaomi 14 Ultra',
		brand: 'Xiaomi',
		price: 99999,
		description:
			'Co-engineered with Leica, featuring a massive 1-inch main camera sensor and Snapdragon 8 Gen 3.',
		imageUrl: '/xiaomi14ultra.png',
		stock: 8,
		specs: {
			screen: '6.73" WQHD+ AMOLED, 120Hz',
			processor: 'Snapdragon 8 Gen 3',
			ram: '16 GB',
			storage: '512 GB',
			battery: '5000 mAh with 90W HyperCharge'
		},
		createdAt: new Date().toISOString()
	},
	{
		id: 'prod-oneplus-13r',
		name: 'OnePlus 13R',
		brand: 'OnePlus',
		price: 42999,
		description:
			'Premium flagship design in Nebula Noir, featuring a Snapdragon 8 Gen 2 processor, 12GB RAM, and 100W SUPERVOOC charging.',
		imageUrl: '/oneplus13r.png',
		stock: 12,
		specs: {
			screen: '6.78" 1.5K LTPO AMOLED, 120Hz',
			processor: 'Snapdragon 8 Gen 2',
			ram: '12 GB',
			storage: '256 GB',
			battery: '5500 mAh with 100W charging'
		},
		createdAt: new Date().toISOString()
	}
];

function getMockData(key, defaultData = []) {
	if (typeof window === 'undefined') return defaultData;
	const data = localStorage.getItem(key);
	if (!data) {
		localStorage.setItem(key, JSON.stringify(defaultData));
		return defaultData;
	}
	let parsed = JSON.parse(data);
	// Automatically merge and update default products if they exist
	if (key === 'mock_products' && Array.isArray(parsed)) {
		let changed = false;
		for (const p of defaultData) {
			const idx = parsed.findIndex((item) => item.id === p.id);
			if (idx === -1) {
				parsed.push(p);
				changed = true;
			} else {
				// Sync changed fields from DEFAULT_PRODUCTS to localStorage (e.g. imageUrl, specs, price, description)
				if (parsed[idx].imageUrl !== p.imageUrl) {
					parsed[idx].imageUrl = p.imageUrl;
					changed = true;
				}
				if (parsed[idx].price !== p.price) {
					parsed[idx].price = p.price;
					changed = true;
				}
				if (parsed[idx].description !== p.description) {
					parsed[idx].description = p.description;
					changed = true;
				}
			}
		}
		if (changed) {
			localStorage.setItem(key, JSON.stringify(parsed));
		}
	}
	return parsed;
}

function saveMockData(key, data) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// PRODUCTS CRUD OPERATIONS
// ==========================================

export async function addProduct(productData) {
	if (isUsingMock) {
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const newProduct = {
			id: 'prod-' + Math.random().toString(36).substr(2, 9),
			...productData,
			createdAt: new Date().toISOString()
		};
		products.unshift(newProduct);
		saveMockData('mock_products', products);
		// Broadcast update
		triggerMockChange('products');
		return newProduct;
	} else {
		const colRef = collection(db, 'products');
		const docRef = await addDoc(colRef, {
			...productData,
			createdAt: new Date().toISOString()
		});
		return { id: docRef.id, ...productData };
	}
}

export async function updateProduct(productId, productData) {
	if (isUsingMock) {
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const idx = products.findIndex((p) => p.id === productId);
		if (idx === -1) throw new Error('Product not found.');
		products[idx] = { ...products[idx], ...productData };
		saveMockData('mock_products', products);
		triggerMockChange('products');
		return products[idx];
	} else {
		const docRef = doc(db, 'products', productId);
		await updateDoc(docRef, productData);
		return { id: productId, ...productData };
	}
}

export async function deleteProduct(productId) {
	if (isUsingMock) {
		let products = getMockData('mock_products', DEFAULT_PRODUCTS);
		products = products.filter((p) => p.id !== productId);
		saveMockData('mock_products', products);
		triggerMockChange('products');
		return true;
	} else {
		const docRef = doc(db, 'products', productId);
		await deleteDoc(docRef);
		return true;
	}
}

export async function getProducts() {
	if (isUsingMock) {
		return getMockData('mock_products', DEFAULT_PRODUCTS);
	} else {
		const colRef = collection(db, 'products');
		const q = query(colRef, orderBy('createdAt', 'desc'));
		const snap = await getDocs(q);
		return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	}
}

export async function getProduct(productId) {
	if (isUsingMock) {
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const prod = products.find((p) => p.id === productId);
		if (!prod) throw new Error('Product not found.');
		return prod;
	} else {
		const docRef = doc(db, 'products', productId);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) throw new Error('Product not found.');
		return { id: docSnap.id, ...docSnap.data() };
	}
}

// ==========================================
// SHOPPING CART MANAGEMENT
// ==========================================

export async function getCartItems(userId) {
	if (isUsingMock) {
		const cart = getMockData('mock_cart');
		const userCart = cart.filter((item) => item.userId === userId);
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);

		// Map product details onto cart items
		return userCart.map((item) => {
			const product = products.find((p) => p.id === item.productId) || {
				name: 'Deleted Product',
				price: 0,
				imageUrl: '',
				stock: 0
			};
			return {
				...item,
				product
			};
		});
	} else {
		const colRef = collection(db, 'cart');
		const q = query(colRef, where('userId', '==', userId));
		const snap = await getDocs(q);
		const cartItems = snap.docs.map((d) => d.data());

		// Retrieve product details for each cart item
		const itemsWithProduct = await Promise.all(
			cartItems.map(async (item) => {
				try {
					const prodRef = doc(db, 'products', item.productId);
					const prodSnap = await getDoc(prodRef);
					return {
						...item,
						id: item.userId + '_' + item.productId,
						product: prodSnap.exists()
							? { id: prodSnap.id, ...prodSnap.data() }
							: { name: 'Unknown Product', price: 0, imageUrl: '', stock: 0 }
					};
				} catch (err) {
					return {
						...item,
						product: { name: 'Error loading', price: 0, imageUrl: '', stock: 0 }
					};
				}
			})
		);
		return itemsWithProduct;
	}
}

export async function addToCart(userId, productId, quantity = 1) {
	if (isUsingMock) {
		const cart = getMockData('mock_cart');
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const prod = products.find((p) => p.id === productId);
		if (!prod) throw new Error('Product not found.');
		if (prod.stock < quantity) throw new Error('Insufficient stock.');

		const existing = cart.find((item) => item.userId === userId && item.productId === productId);
		if (existing) {
			const newQty = existing.quantity + quantity;
			if (prod.stock < newQty) throw new Error('Cannot add more than available stock.');
			existing.quantity = newQty;
		} else {
			cart.push({ userId, productId, quantity });
		}
		saveMockData('mock_cart', cart);
		triggerMockChange('cart');
		return true;
	} else {
		const cartDocId = `${userId}_${productId}`;
		const cartRef = doc(db, 'cart', cartDocId);
		const cartSnap = await getDoc(cartRef);

		let currentQty = 0;
		if (cartSnap.exists()) {
			currentQty = cartSnap.data().quantity || 0;
		}
		const newQty = currentQty + quantity;

		// Verify stock before adding
		const prodRef = doc(db, 'products', productId);
		const prodSnap = await getDoc(prodRef);
		if (!prodSnap.exists()) throw new Error('Product not found.');
		if (prodSnap.data().stock < newQty) throw new Error('Insufficient stock available.');

		await setDoc(cartRef, {
			userId,
			productId,
			quantity: newQty
		});
		return true;
	}
}

export async function updateCartQuantity(userId, productId, quantity) {
	if (quantity <= 0) {
		return removeCartItem(userId, productId);
	}
	if (isUsingMock) {
		const cart = getMockData('mock_cart');
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const prod = products.find((p) => p.id === productId);
		if (!prod) throw new Error('Product not found.');
		if (prod.stock < quantity) throw new Error('Not enough stock available.');

		const item = cart.find((item) => item.userId === userId && item.productId === productId);
		if (!item) throw new Error('Item not in cart.');
		item.quantity = quantity;
		saveMockData('mock_cart', cart);
		triggerMockChange('cart');
		return true;
	} else {
		// Verify stock
		const prodRef = doc(db, 'products', productId);
		const prodSnap = await getDoc(prodRef);
		if (!prodSnap.exists()) throw new Error('Product not found.');
		if (prodSnap.data().stock < quantity) throw new Error('Insufficient stock.');

		const cartDocId = `${userId}_${productId}`;
		const cartRef = doc(db, 'cart', cartDocId);
		await updateDoc(cartRef, { quantity });
		return true;
	}
}

export async function removeCartItem(userId, productId) {
	if (isUsingMock) {
		let cart = getMockData('mock_cart');
		cart = cart.filter((item) => !(item.userId === userId && item.productId === productId));
		saveMockData('mock_cart', cart);
		triggerMockChange('cart');
		return true;
	} else {
		const cartDocId = `${userId}_${productId}`;
		const cartRef = doc(db, 'cart', cartDocId);
		await deleteDoc(cartRef);
		return true;
	}
}

export async function clearUserCart(userId) {
	if (isUsingMock) {
		let cart = getMockData('mock_cart');
		cart = cart.filter((item) => item.userId !== userId);
		saveMockData('mock_cart', cart);
		triggerMockChange('cart');
		return true;
	} else {
		const colRef = collection(db, 'cart');
		const q = query(colRef, where('userId', '==', userId));
		const snap = await getDocs(q);
		const batchDeletes = snap.docs.map((d) => deleteDoc(d.ref));
		await Promise.all(batchDeletes);
		return true;
	}
}

// ==========================================
// ORDERS MANAGEMENT
// ==========================================

export async function placeOrder(userId, customerInfo, productsList, totalAmount, shippingAddress) {
	const orderPayload = {
		userId,
		customerName: customerInfo.name,
		customerEmail: customerInfo.email,
		products: productsList, // Array of { productId, name, price, quantity, imageUrl }
		totalAmount,
		shippingAddress,
		status: 'Pending',
		orderDate: new Date().toISOString()
	};

	if (isUsingMock) {
		// Adjust product stock
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		for (const item of productsList) {
			const prod = products.find((p) => p.id === item.productId);
			if (prod) {
				if (prod.stock < item.quantity) {
					throw new Error(`Insufficient stock for ${prod.name}`);
				}
				prod.stock -= item.quantity;
			}
		}
		saveMockData('mock_products', products);

		// Record order
		const orders = getMockData('mock_orders', []);
		const newOrder = {
			id: 'order-' + Math.random().toString(36).substr(2, 9),
			...orderPayload
		};
		orders.unshift(newOrder);
		saveMockData('mock_orders', orders);

		// Empty cart
		let cart = getMockData('mock_cart');
		cart = cart.filter((item) => item.userId !== userId);
		saveMockData('mock_cart', cart);

		// Broadcast events
		triggerMockChange('products');
		triggerMockChange('orders');
		triggerMockChange('cart');
		return newOrder;
	} else {
		// Adjust stock in real Firestore (simple transaction emulation or direct writes)
		await Promise.all(
			productsList.map(async (item) => {
				const prodRef = doc(db, 'products', item.productId);
				const prodSnap = await getDoc(prodRef);
				if (prodSnap.exists()) {
					const currentStock = prodSnap.data().stock || 0;
					await updateDoc(prodRef, {
						stock: Math.max(0, currentStock - item.quantity)
					});
				}
			})
		);

		// Create order document
		const colRef = collection(db, 'orders');
		const docRef = await addDoc(colRef, orderPayload);

		// Clear shopping cart
		await clearUserCart(userId);
		return { id: docRef.id, ...orderPayload };
	}
}

export async function getOrders(userId = null) {
	if (isUsingMock) {
		const orders = getMockData('mock_orders', []);
		if (userId) {
			return orders.filter((o) => o.userId === userId);
		}
		return orders;
	} else {
		const colRef = collection(db, 'orders');
		let q;
		if (userId) {
			q = query(colRef, where('userId', '==', userId), orderBy('orderDate', 'desc'));
		} else {
			q = query(colRef, orderBy('orderDate', 'desc'));
		}
		const snap = await getDocs(q);
		return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	}
}

export async function getOrder(orderId) {
	if (isUsingMock) {
		const orders = getMockData('mock_orders', []);
		const order = orders.find((o) => o.id === orderId);
		if (!order) throw new Error('Order not found.');
		return order;
	} else {
		const docRef = doc(db, 'orders', orderId);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) throw new Error('Order not found.');
		return { id: docSnap.id, ...docSnap.data() };
	}
}

export async function updateOrderStatus(orderId, status) {
	if (isUsingMock) {
		const orders = getMockData('mock_orders', []);
		const order = orders.find((o) => o.id === orderId);
		if (!order) throw new Error('Order not found.');
		order.status = status;
		saveMockData('mock_orders', orders);
		triggerMockChange('orders');
		return order;
	} else {
		const docRef = doc(db, 'orders', orderId);
		await updateDoc(docRef, { status });
		return { id: orderId, status };
	}
}

// ==========================================
// ADMINISTRATIVE UTILITIES & STATS
// ==========================================

export async function getAllUsers() {
	if (isUsingMock) {
		return getMockData('mock_users');
	} else {
		const colRef = collection(db, 'users');
		const snap = await getDocs(colRef);
		return snap.docs.map((doc) => doc.data());
	}
}

export async function getAdminStats() {
	if (isUsingMock) {
		const products = getMockData('mock_products', DEFAULT_PRODUCTS);
		const orders = getMockData('mock_orders', []);
		const users = getMockData('mock_users');

		const totalProducts = products.length;
		const totalOrders = orders.length;
		const totalUsers = users.length;
		const totalSales = orders
			.filter((o) => o.status !== 'Cancelled')
			.reduce((acc, o) => acc + o.totalAmount, 0);

		return {
			totalProducts,
			totalOrders,
			totalUsers,
			totalSales
		};
	} else {
		const prodSnap = await getDocs(collection(db, 'products'));
		const orderSnap = await getDocs(collection(db, 'orders'));
		const userSnap = await getDocs(collection(db, 'users'));

		const totalProducts = prodSnap.size;
		const totalOrders = orderSnap.size;
		const totalUsers = userSnap.size;

		let totalSales = 0;
		orderSnap.forEach((doc) => {
			const data = doc.data();
			if (data.status !== 'Cancelled') {
				totalSales += data.totalAmount || 0;
			}
		});

		return {
			totalProducts,
			totalOrders,
			totalUsers,
			totalSales
		};
	}
}

// ==========================================
// REAL-TIME LISTENER PATTERNS
// ==========================================

// Registry of subscribers for local storage changes (Mock Mode real-time update engine)
let mockListeners = {
	products: [],
	orders: [],
	cart: []
};

function triggerMockChange(collectionName) {
	if (mockListeners[collectionName]) {
		mockListeners[collectionName].forEach((cb) => {
			if (collectionName === 'products') {
				cb(getMockData('mock_products', DEFAULT_PRODUCTS));
			} else if (collectionName === 'orders') {
				cb(getMockData('mock_orders', []));
			} else if (collectionName === 'cart') {
				// Cart real-time updates are context-specific, listeners handle mapping individually
				cb(getMockData('mock_cart'));
			}
		});
	}
}

export function subscribeToProducts(callback) {
	if (isUsingMock) {
		mockListeners.products.push(callback);
		// Call immediately
		callback(getMockData('mock_products', DEFAULT_PRODUCTS));
		return () => {
			mockListeners.products = mockListeners.products.filter((cb) => cb !== callback);
		};
	} else {
		const colRef = collection(db, 'products');
		const q = query(colRef, orderBy('createdAt', 'desc'));
		return onSnapshot(q, (snap) => {
			const prods = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			callback(prods);
		});
	}
}

export function subscribeToOrders(userId, callback) {
	if (isUsingMock) {
		const handler = () => {
			const orders = getMockData('mock_orders', []);
			if (userId) {
				callback(orders.filter((o) => o.userId === userId));
			} else {
				callback(orders);
			}
		};
		mockListeners.orders.push(handler);
		handler(); // Invoke initial
		return () => {
			mockListeners.orders = mockListeners.orders.filter((cb) => cb !== handler);
		};
	} else {
		const colRef = collection(db, 'orders');
		let q;
		if (userId) {
			q = query(colRef, where('userId', '==', userId), orderBy('orderDate', 'desc'));
		} else {
			q = query(colRef, orderBy('orderDate', 'desc'));
		}
		return onSnapshot(q, (snap) => {
			const ords = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			callback(ords);
		});
	}
}
