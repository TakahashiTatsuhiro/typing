import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/styles.css';

const UserHome = () => {
	const navigate = useNavigate();
	const handleScores = () => {
		navigate('/scores');
	}

	return (
		<>
			<Navbar />
			<div className='menu'>
				<div className='menu-item'>Typing</div>
				<div className='menu-item' onClick={handleScores}>Scores</div>
			</div>
		</>
	);
};

export default UserHome;
