import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); //相対パスの起点はこのファイルがある階層ではなくアプリを起動する階層なので、この指示が正しい。

import express from 'express';
import cors from 'cors';
import Knex from 'knex';
import knexfile from './knexfile';

const app = express();
const port = 3001; //vite側を3000にするため

app.use(cors()); // CORS（Cross-Origin Resource Sharing）の設定
app.use(express.json()); // JSONリクエストボディの解析

// Knexインスタンスの初期化
// 環境に応じたKnex設定の選択
const knexConfig = knexfile[process.env.NODE_ENV || 'development'];
const knex = Knex(knexConfig);

//ルート
app.get('/', (req, res) => {
	res.send('Hello World!!');
});

//ログイン認証
app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await knex('users').where({ username }).first();
		if (user && user.password === password) {
			res.json({ success: true, message: 'ログイン成功' });
		} else {
			res.status(401).json({ success: false, message: 'ログイン失敗' });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: 'サーバーエラー' });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
