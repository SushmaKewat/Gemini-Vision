import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST = async (request: Request) => {
	try {
		const body = await request.json();
		console.log('BODY', body);
		const { apiKey, message } = body;

		const genAI = new GoogleGenerativeAI(apiKey);

		const model = genAI.getGenerativeModel({
			model: 'gemini-1.5-flash-latest',
		});
		console.log(message);
		return new NextResponse('Gemini has responded', { status: 200 });
	} catch (error) {
		console.log('ERROR: ', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
