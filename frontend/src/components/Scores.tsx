import Navbar from './Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const Scores = () => {
	const makeChart = () => {
		const data = [
			{ name: '1', wpm: 25 },
			{ name: '2', wpm: 27 },
			{ name: '3', wpm: 26 },
			{ name: '4', wpm: 29 },
			{ name: '5', wpm: 33 },
			{ name: '6', wpm: 31 },
			{ name: '7', wpm: 34 },
		];
		return (
			<LineChart className='menu' width={600} height={300} data={data}>
				<CartesianGrid stroke='#ccc' />
				<XAxis dataKey='name' />
				<YAxis />
				<Line type='monotone' dataKey='wpm' stroke='#8884d8' />
			</LineChart>
		);
	};

	return (
		<>
			<Navbar />
			{makeChart()}
		</>
	);
};

export default Scores;
