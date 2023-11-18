import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import Navbar from './Navbar';

const SignupForm = () => {
	const [username, setUsername] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const { login, setUserName } = useAuth();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		console.log('username', username);
		console.log('pass1', password1);
		console.log('pass2', password2);

		if (username === '' || password1 !== password2) {
			setMessage('記入内容が不正です')
			return;
		}

		try {
			const response = await fetch('http://localhost:3001/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password1 }),
			});

			const data = await response.json();
			if (response.ok) {
				setMessage(data.message);
				login(); // ログイン状態を更新
				setUserName(username);
				navigate('/userhome'); // 登録成功時にUserHome画面に遷移
			} else {
				setMessage(data.message);
			}
		} catch (error) {
			setMessage('サーバーとの通信に失敗しました。');
		}
	};

	return (
		<div>
			<Navbar isSignup={true}></Navbar>
			<form className='form' onSubmit={handleSubmit}>
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='ユーザー名'
				/>
				<input
					type='password'
					value={password1}
					onChange={(e) => setPassword1(e.target.value)}
					placeholder='パスワード'
				/>
				<input
					type='password'
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					placeholder='パスワード確認'
				/>
				<button type='submit'>新規登録</button>
				<div>{message && <p>{message}</p>}</div>
			</form>
		</div>
	);
};

export default SignupForm;
