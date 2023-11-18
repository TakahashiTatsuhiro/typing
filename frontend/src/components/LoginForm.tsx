import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import Navbar from './Navbar';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const { login, setUserName } = useAuth();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3001/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			if (response.ok) {
				setMessage(data.message);
				login(); // ログイン状態を更新
				setUserName(username);
				navigate('/userhome'); // ログイン成功時にUserHome画面に遷移
			} else {
				setMessage(data.message);
			}
		} catch (error) {
			setMessage('サーバーとの通信に失敗しました。');
		}
	};

	return (
		<div>
			<Navbar></Navbar>
			<form className="login-form" onSubmit={handleSubmit}>
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='ユーザー名'
				/>
				<input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='パスワード'
				/>
				<button type='submit'>ログイン</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default LoginForm;
