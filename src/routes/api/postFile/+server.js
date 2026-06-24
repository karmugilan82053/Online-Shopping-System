import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return json(
			{
				message: 'No file uploaded'
			},
			{ status: 400 }
		);
	}

	const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
	if (!allowedTypes.includes(file.type)) {
		return json(
			{
				message: 'Only PNG, JPG and PDF files are allowed'
			},
			{ status: 400 }
		);
	}

	const maxSize = 5 * 1024 * 1024; // 5 MB
	if (file.size > maxSize) {
		return json(
			{
				message: 'File size should be less than 5 MB'
			},
			{ status: 400 }
		);
	}

	const uploadDir = path.join(process.cwd(), 'static', 'uploads');
	await mkdir(uploadDir, { recursive: true });

	const safeFileName = `${Date.now()}-${file.name.replaceAll(' ', '-')}`;
	const filePath = path.join(uploadDir, safeFileName);

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	await writeFile(filePath, buffer);

	return json(
		{
			message: 'File uploaded successfully',
			fileName: safeFileName,
			fileUrl: `/uploads/${safeFileName}`
		},
		{ status: 201 }
	);
};
