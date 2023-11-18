import Navbar from './Navbar';

const UserHome = () => {
	return (
		<>
			<Navbar isSignup={false}></Navbar>
			<div>ログインしました</div>
		</>
	);
};

export default UserHome;
