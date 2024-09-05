'use client';

import { SetStateAction, useState } from 'react';
import axios from 'axios';
export default function Home() {
	const [image, setImage] = useState(null);
	const [value, setValue] = useState('');
	const [key, setKey] = useState('');
	const [response, setResponse] = useState('');
	const [error, setError] = useState('');

	const surpriseOptions: string[] = [
		'What is in this picture?',
		'Is there something tasty in this image?',
		'What is the background of this image?',
		'Decribe 5 features in this picture.',
	];

	const surprise = () => {
		const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
		setValue(randomValue);
	};

	const uploadImage = async (e: any) => {
		setImage(e.target.files[0]);
	};

	const analyzeImage = async () => {
		if (!image) {
			setError('Error! Must have an existing image..');
			return;
		}

		try {
			const { data } = await axios.post(
				'http://localhost:3000/api/',
				{
					question: value,
					key: key,
					image: image,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			console.log(data);
			setResponse(data.response);
		} catch (error) {
			console.log(error);
			setError("Something didn't work. Please try again.");
		}
	};

	const clear = () => {
		setValue('');
		setImage(null);
		setResponse('');
		setError('');
	};

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<h1>Home</h1>
			<section className='search-section'>
				<div className='image-container'>
					{image && <img src={URL.createObjectURL(image)} alt='Uploaded image' />}
				</div>
				<p className='extra-info'>
					<span>
						<label htmlFor='files'>Upload an image </label>
						<input
							onChange={uploadImage}
							id='files'
							accept='image/*'
							type='file'
							hidden
						/>
					</span>
					to ask questions about.
				</p>
				<p>
					What do you want to know about the image?
					<button className='surprise' onClick={surprise} disabled={response}>
						Surprise Me!
					</button>
				</p>
				<div className='input-container'>
					<input
						type='password'
						placeholder='Enter your Gemini api key'
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
					<br />
					<input
						type='text'
						placeholder='Type your question here...'
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					{!response && !error && <button onClick={analyzeImage}>Ask me</button>}
					{(response || error) && <button onClick={clear}>Clear</button>}
				</div>
				{error && <p className='error'>{error}</p>}
				{response && <p className='response'>{response}</p>}
			</section>
		</main>
	);
}
