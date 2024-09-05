import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

const saveImageToLocal = async (file: File) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');
	try {
		await writeFile(path.join(process.cwd(), 'public/uploads/' + filename), buffer);
		let filePath = path.join(process.cwd(), 'public/uploads/' + filename);
		return filePath;
	} catch (error) {
		console.log('Error occured ', error);
		return '';
	}
};

const fileToGenerativePart = (path: string, mimeType: string) => {
	return {
		inlineData: {
			data: Buffer.from(fs.readFileSync(path)).toString('base64'),
			mimeType,
		},
	};
};

export async function POST(request: Request) {
	try {
		const body = await request.formData();
		console.log('REQUEST LOG: ', body);

		const file = body.get('image');
		const prompt = body.get('question');
		const apiKey = body.get('key');

		console.log('FILE: ', file);
		console.log('QUESTION: ', prompt);
		console.log('KEY: ', apiKey);

		if (!apiKey) {
			return new NextResponse('API key is required', { status: 400 });
		}

		if (!file) {
			return new NextResponse('File is required', { status: 400 });
		}

		const filePath = await saveImageToLocal(file as File);

		const genAI = new GoogleGenerativeAI(apiKey);

		const model = genAI.getGenerativeModel({
			model: 'gemini-1.5-flash-latest',
		});

		const result = await model.generateContent([
			prompt,
			fileToGenerativePart(filePath, 'image/*'),
		]);

		const response = await result.response;
		const text = response.text();

		return NextResponse.json({ response: text });
	} catch (error) {
		console.log('ERROR: ', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
