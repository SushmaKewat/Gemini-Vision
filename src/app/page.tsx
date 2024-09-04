'use client';

import { useState } from 'react';
export default function Home() {
	const [image, setImage] = useState(null);
	const [value, setValue] = useState('');
	const [response, setResponse] = useState('');
	const [error, setError] = useState('');

	const surpriseOptions: string[] = [];

	const surprise = () => {
		const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
		setValue(randomValue);
	};

	const analyzeImage = async () => {
		if (!image) {
			setError('Error! Must have an existing image..');
			return;
		}

		try {
			const options = {
				method: 'POST',
				body: JSON.stringify({
					message: value,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const response = await fetch('http://localhost:3000/api/gemini/', options);
			const data = await response;
			console.log(data.statusText);
			setResponse(data.statusText);
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

	const uploadImage = async (e) => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
		setImage(e.target.files[0]);

		try {
			const options = {
				method: 'POST',
				body: formData,
				/* headers: {
					'Content-Type': 'multipart/form-data',
				}, */
				/* 'Content-Type': 'image/jpg, image/png', */
			};

			const response = await fetch('http://localhost:3000/api', options);
			console.log(response.statusText);
		} catch (error) {
			console.log(error);
			setError('Error!');
		}
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
