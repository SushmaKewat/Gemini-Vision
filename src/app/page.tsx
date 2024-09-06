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
		<main className='flex min-h-screen flex-col items-center p-24 mx-auto lg:w-1/2 xl:w-1/2'>
			<h1 className='font-bold text-6xl bg-gradient-to-r from-[#3f5efb] to-[#fc466b] bg-clip-text text-transparent'>
				VisionX
			</h1>
			<section className='search-section'>
				<div className='flex flex-col w-2/3 mx-auto my-4 '>
					<input
						className='bg-white text-black px-2 py-1 text-md shadow-md'
						type='password'
						placeholder='Enter your Gemini API key'
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
				</div>
				<div className='image-container w-1/3 flex flex-col my-6 mx-auto'>
					{image && <img src={URL.createObjectURL(image)} alt='Uploaded image' />}
				</div>
				<p className='extra-info text-center my-4'>
					<span>
						<label
							htmlFor='files'
							className='text-pink-600 text-md border border-[#fc466b] rounded-md px-4 py-1 hover:bg-[#fc466b] hover:text-white'>
							Upload an image to ask questions about.
						</label>
						<input
							onChange={uploadImage}
							id='files'
							accept='image/*'
							type='file'
							hidden
						/>
					</span>
				</p>
				<p className='mt-8'>
					<span className='text-gray-400'>What do you want to know about the image?</span>
					<button
						className='surprise text-sm text-gray-400 mx-2 border border-gray-400 rounded-md px-2 py-0 hover:bg-[#3f5efb] hover:border-[#3f5efb] hover:text-white'
						onClick={surprise}
						disabled={response}>
						Surprise Me!
					</button>
				</p>
				<div className='input-container grid grid-cols-12 gap-1 my-4'>
					<input
						className='col-span-10 bg-white text-black px-2 py-1 text-md shadow-md'
						type='text'
						placeholder='Type your question here...'
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					{!response && !error && (
						<button
							onClick={analyzeImage}
							className='col-span-2 bg-white px-2 py-1 text-md shadow-md text-black font-semibold'>
							Ask me
						</button>
					)}
					{(response || error) && (
						<button
							onClick={clear}
							className='col-span-2 bg-white px-2 py-1 text-md shadow-md text-black font-semibold'>
							Clear
						</button>
					)}
				</div>

				{error && <div className='error text-red-500 text-wrap'>{error}</div>}
				{response && (
					<div className='flex flex-row space-between my-6'>
						<div className='mr-2'>
							<div className='w-8 h-8 rounded-full text-center font-bold text-2xl text-white bg-gradient-to-r from-[#3f5efb] to-[#fc466b]'>
								X
							</div>
						</div>
						<div className='response text-wrap'>{response}</div>
					</div>
				)}
			</section>
		</main>
	);
}
