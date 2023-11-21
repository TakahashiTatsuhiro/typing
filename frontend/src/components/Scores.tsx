import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Score, midData, finalData } from '../../../globals';

const Scores = () => {
	// サーバーから取れる全得点データ -------------------------------------
	const [scores, setScores] = useState<Score[]>();
	useEffect(() => {
		const getScores = async () => {
			try {
				const getData = async () => {
					//サーバーからデータを取ってくる
					const response = await fetch('http://localhost:3001/scores');
					const data = await response.json();

					if (response.ok) {
						setScores(data.scores);
					} else {
						setScores([]);
					}
				};
				getData();
			} catch (error) {
				console.log('error', error);
			}
		};
		getScores();
	}, []);

	// ユーザーの最新スコアを表示----------------------------------------
	const [message, SetMessage] = useState('');
	const { userName } = useAuth();
	useEffect(() => {
		if (scores) {
			const userScores = scores.filter((score) => score.username === userName);
			if (userScores.length > 0) {
				const latestScore = userScores[userScores.length - 1].score;
				SetMessage(`あなたの最新WPMスコアは ${latestScore} だよ`);
			} else {
				SetMessage('全スコアのグラフだよ');
			}
		}
	}, [scores, userName]);

	//グラフ描画 https://zenn.dev/acha_n/articles/how-to-customize-recharts
	const makeChart = () => {
		//中間データに置き換える
		const midData = scores?.reduce((acc: midData[], { username, score }) => {
			const found = acc.find((item) => item.username == username);
			if (found) {
				found.scores.push(score);
			} else {
				acc.push({ username, scores: [score] });
			}
			return acc;
		}, []);

		// 描画する
		if (midData) {
			//メンバー別で最多プレイ数を調べる
			let maxPlays = 0;
			for (const user of midData) {
				if (maxPlays < user.scores.length) {
					maxPlays = user.scores.length;
				}
			}

			//最終データに変換する
			const finalData: finalData[] = [];
			for (let i = 0; i <= maxPlays; i++) {
				const playObj: finalData = { play: i + 1 };
				for (const user of midData) {
					if (user.scores[i] !== undefined) {
						playObj[user.username] = user.scores[i];
					}
				}
				finalData.push(playObj);
			}
			console.log('finalData', finalData);

			return (
				<LineChart className='menu' width={600} height={300} data={finalData}>
					<CartesianGrid stroke='#ccc' />
					<XAxis dataKey='play' />
					<YAxis />
					{midData.map((mid) => {
						return <Line type='monotone' dataKey={mid.username} stroke='#8884d8'></Line>;
					})}
				</LineChart>
			);
		} else {
			return <></>;
		}
	};

	// render---------------------------------------------------------
	return (
		<>
			<Navbar />
			{message && <p>{message}</p>}
			{makeChart()}
		</>
	);
};

export default Scores;
