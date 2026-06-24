<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let error = $derived($page.form?.error || '');
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
	<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
		<div class="mb-6 text-center">
			<h1 class="text-3xl font-bold text-gray-900">Login</h1>
			<p class="mt-2 text-sm text-gray-500">Enter your username and password</p>
		</div>

		{#if error}
			<div class="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
				<p class="text-sm font-medium">{error}</p>
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-5">
			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-gray-700">Username</label>
				<input id="username" name="username" type="text" placeholder="Enter username" required class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
				<input id="password" name="password" type="password" placeholder="Enter password" required class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
			</div>

			<button type="submit" class="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">Login</button>
		</form>

		<div class="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
			<p class="font-semibold text-gray-700">Demo Credentials</p>
			<div class="mt-2 space-y-1">
				<p><span class="font-medium">Student</span> - student / 12345678</p>
				<p><span class="font-medium">Admin</span> - admin / admin1234</p>
			</div>
		</div>
	</div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #ff9966, #ff5e62);
    }

    .login-card {
        width: 380px;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    h1 {
        text-align: center;
        color: #ff5e62;
        margin-bottom: 5px;
    }

    h3 {
        text-align: center;
        color: #555;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        padding: 12px;
        background: #ff5e62;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    button:hover {
        background: #e64a4f;
    }

    .signup {
        text-align: center;
        margin-top: 15px;
    }

    .signup a {
        color: #ff5e62;
        text-decoration: none;
        font-weight: bold;
    }

    .message {
        text-align: center;
        margin-top: 15px;
        font-weight: bold;
    }
</style>