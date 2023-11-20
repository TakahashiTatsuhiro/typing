import React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/typing.css';

const Typing = () => {
	//ステート宣言------------------------------------
	const [sampleArr, setSampleArr] = useState<string[]>([]);
	const [sampleStr, setSampleStr] = useState(''); //正解文字列
	const [spans, setSpans] = useState<React.ReactElement[]>([]); //画面表示用のspanタグが入った配列
	const [rawInput, setRawInput] = useState(''); //ユーザーの打った内容そのもの
	const [input, setInput] = useState(''); //rawInputを結果集計のために加工したもの('?'を空文字に変換して、空文字でsplitする)
	const [running, setRunning] = useState(false); //プレイ時間制限用の開始判定
	const limitSec = 10; //時間制限(秒)
	const [countDown, setCountDown] = useState(limitSec);

	//正解配列--------------------------------------
	useEffect(() => {
		const getWords = async () => {
			try {
				const response = await fetch('http://localhost:3001/words');
				const data = await response.json();
				if (response.ok) {
					setSampleArr(data);
				} else {
					setSampleArr(['test', 'apple', 'banana', 'fish', 'meet']);
				}
			} catch (error) {}
		};
		getWords();
	}, []);

	//正解文字列-------------------------------------
	useEffect(() => {
		setSampleStr(sampleArr.join(' '));
	}, [sampleArr]);

	//画面表示用span要素作成----------------------------
	useEffect(() => {
		setSpans(
			sampleStr.split('').map((char, idx) => (
				<span key={idx} className='wait'>
					{char}
				</span>
			))
		);
	}, [sampleStr]);

	//キー入力----------------------------------------
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			//開始判定
			if (!running) {
				setRunning(true);
			}

			//キー入力を受け入れ
			if (e.key === 'Backspace') {
				setRawInput((prev) => prev.slice(0, -1));
			} else if (e.key.length === 1) {
				setRawInput((prev) => prev + e.key);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	//spans更新--------------------------------------
	const createSpans = () => {
		setInput('');
		return sampleStr.split('').map((char, idx) => {
			let className = 'wait';
			let displayChar = char; // 表示する文字

			if (idx < rawInput.length) {
				if (rawInput[idx] === sampleStr[idx]) {
					className = 'correct';
					setInput((prev) => prev + rawInput[idx]);
				} else {
					className = 'incorrect';
					if (sampleStr[idx] === ' ') {
						displayChar = '?'; // スペースのタイプミスの場合、?を表示
						setInput((prev) => prev + displayChar);
					} else {
						setInput((prev) => prev + rawInput[idx]);
					}
				}
			}

			return (
				<span key={idx} className={className}>
					{displayChar}
				</span>
			);
		});
	};
	useEffect(() => {
		setSpans(createSpans()); // userInputが変更されたらspansを更新
	}, [rawInput, sampleStr]);

	//タイマー処理------------------------------------
	const checkResult = () => {
		//入力結果を配列にして、正解した単語数を調べる
		let numOK = 0;
		const inputWords = input.replace('?', ' ').split(' ');
		for (let i = 0; i < inputWords.length; i++) {
			if (sampleArr[i] === inputWords[i]) {
				numOK += 1;
			}
		}

		//wpsを計算して返す
		const wps = Math.floor(numOK / (limitSec / 60));
		return wps;
	};
	const sendResult = (wps:number) => {

	};
	useEffect(() => {
		//https://jp-seemore.com/web/13310/#toc8
		if (running) {
			// カウントダウンの開始時間を10秒と設定
			let count = limitSec;

			// タイマー処理を1秒ごとに繰り返し行う
			const countdown = setInterval(() => {
				// カウントをデクリメント
				count--;
				setCountDown(count);

				// カウントが0になったらタイマーを終了し、終了メッセージを表示
				if (count === 0) {
					clearInterval(countdown);
					checkResult();
				}
			}, 1000);
		}
	}, [running]);

	//リターン----------------------------------------
	return (
		<>
			<Navbar />
			<div>残り{countDown}秒だよ</div>
			<div className='spans'>
				<p>{spans}</p>
			</div>
			<p>{rawInput}</p>
			<p>{input}</p>
		</>
	);
};

export default Typing;
