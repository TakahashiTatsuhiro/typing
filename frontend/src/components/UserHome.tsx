import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // バックエンドのログアウトエンドポイントにリクエストを送信
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        // フロントエンドの認証状態を更新（ログアウト）
        logout();
        // ログインページにリダイレクト
        navigate('/login');
      }
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
    }
  };

  return (
    <>
      <div>ログインしました</div>
      <button onClick={handleLogout}>ログアウト</button>
    </>
  );
};

export default UserHome;
