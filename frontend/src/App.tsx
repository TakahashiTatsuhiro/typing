import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserHome from './components/UserHome';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/userhome" element={<UserHome />} />
      </Routes>
    </Router>
  );
};

export default App;
