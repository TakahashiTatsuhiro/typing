import React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/typing.css';

const Typing = () => {
	//ステート宣言------------------------------------
	const [sample, setSample] = useState('');
	const [spans, setSpans] = useState<React.ReactElement[]>([]);
	const [userInput, setUserInput] = useState('');

	//正解文字列-------------------------------------
	useEffect(() => {
		setSample('test apple banana fish meet');
	}, []);

	//画面表示用span要素作成----------------------------
	useEffect(() => {
		setSpans(
			sample.split('').map((char, idx) => (
				<span key={idx} className='wait'>
					{char}
				</span>
			))
		);
	}, [sample]);

	//キー入力----------------------------------------
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			//キー入力を受け入れ
			if (e.key === 'Backspace') {
				setUserInput((prev) => prev.slice(0, -1));
			} else if (e.key.length === 1) {
				setUserInput((prev) => prev + e.key);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	//spans更新--------------------------------------
    const createSpans = () => {
        return sample.split('').map((char, idx) => {
            let className = 'wait';
            let displayChar = char; // 表示する文字

            if (idx < userInput.length) {
                if (userInput[idx] === sample[idx]) {
                    className = 'correct';
                } else {
                    className = 'incorrect';
                    if (sample[idx] === ' ') {
                        displayChar = '?'; // スペースのタイプミスの場合、?を表示
                    }
                }
            }

            return <span key={idx} className={className}>{displayChar}</span>;
        });
    };
	useEffect(() => {
        setSpans(createSpans()); // userInputが変更されたらspansを更新
    }, [userInput, sample]);

	return (
		<>
			<Navbar />
			<p>{sample}</p>
			<p>{userInput}</p>
			<div>{spans}</div>
		</>
	);
};

export default Typing;
