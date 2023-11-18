import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout, userName } = useAuth();

	const handleLogout = async () => {
		try {
			// バックエンドのログアウトエンドポイントにリクエストを送信
			const response = await fetch('http://localhost:3001/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				logout();
				navigate('/login');
			}
		} catch (error) {
			console.error('ログアウトに失敗しました', error);
		}
	};

	return (
		<div className='navbar'>
			<h2 className='navbar-header'>Let's Typing</h2>
			{isAuthenticated ? (
				<div className='navbar-leftDiv'>
					<h2 className='navbar-elem'>{userName}</h2>
					<button className='navbar-elem' onClick={handleLogout}>
						ログアウト
					</button>
				</div>
			) : (
				<button className='navbar-elem'>新規登録</button>
			)}
		</div>
	);
};

export default Navbar;
