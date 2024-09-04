import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import multer from 'multer';

/* const storage = multer.diskStorage({
	destination: 'public/uploads',
	filename: (request: Request, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage }).single('image');
 */
/* upload(request, response, (error: any) => {
	if (error) {
		return new NextResponse(error.message, { status: 500 });
	}
	filePath = file.name;
	console.log('FILE PATH: ', filePath);
});
 */
let filePath;

export async function POST(request: Request, response: Response) {
	try {
		const body = await request.formData();
		console.log('REQUEST LOG: ', body);

		const file = body.get('image');
		console.log('FILE: ', file);

		/* if (!apiKey) {
		return new NextResponse('API key is required', { status: 400 });
	} */

		if (!file) {
			return new NextResponse('File is required', { status: 400 });
		}

		/* const genAI = new GoogleGenerativeAI(apiKey); */

		return new NextResponse('File uploaded successfully', { status: 200 });
	} catch (error) {
		console.log('ERROR: ', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
