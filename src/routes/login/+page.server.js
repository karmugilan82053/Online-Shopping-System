import { fail, redirect } from '@sveltejs/kit';

const users = [
	{
		username: 'student',
		password: '12345678',
		token: 'student-token'
	},
	{
		username: 'admin',
		password: 'admin1234',
		token: 'admin-token'
	}
];

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const user = users.find(
			(user) => user.username === username && user.password === password
		);

		if (!user) {
			return fail(400, {
				error: 'Invalid username or password'
			});
		}

		console.log('USER : ', user.username);

		cookies.set('session', user.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict'
		});

		if (user.username === 'admin') {
			throw redirect(303, '/fileUpload');
		} else {
			throw redirect(303, '/dashboard');
		}
	}
};
