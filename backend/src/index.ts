import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); //相対パスの起点はこのファイルがある階層ではなくアプリを起動する階層なので、この指示が正しい。

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import Knex from 'knex';
import knexfile from './knexfile';

//express設定-------------------------------------------------------------
const app = express();
const port = 3001; //vite側を3000にするため

declare module 'express-session' {
	interface SessionData {
		user?: {
			id:number,
			username:string,
			password:string
		};
	}
}

app.use(cors()); // CORS（Cross-Origin Resource Sharing）の設定
app.use(express.json()); // JSONリクエストボディの解析
app.use(
	session({
		secret: process.env.SESSTION_SECRET || 'secret_key_wo_ireyou',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: process.env.NODE_ENV === 'production' }, // 開発環境と本番環境で切り替える
	})
);

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.session && req.session.user) {
		return next();
	}
	res.status(401).json({ success: false, message: '未認証のアクセスです' });
}

// Knexインスタンスの初期化--------------------------------------------------
// 環境に応じたKnex設定の選択
const knexConfig = knexfile[process.env.NODE_ENV || 'development'];
const knex = Knex(knexConfig);

//ルート-------------------------------------------------------------------
app.get('/', (req, res) => {
	res.send('こちらはbackend側だよ');
});

//ログイン認証---------------------------------------------------------------
app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await knex('users').where({ username }).first();
		if (user && user.password === password) {
			// ユーザー情報をセッションに格納
			req.session.user = user;
			res.json({ success: true, message: 'ログイン成功' });
		} else {
			res.status(401).json({ success: false, message: 'ログイン失敗' });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: 'サーバーエラー' });
	}
});

//新規登録------------------------------------------------------------------
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
	
    try {
        // ユーザー名の重複チェック
        const existingUser = await knex('users').where({ username }).first();
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'ユーザー名が既に存在します' });
        }

        // 新規ユーザーの追加
        const newUser = await knex('users').insert({ username, password }).returning('*');
        res.json({ success: true, user: newUser[0], message: '新規登録成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

//ログアウト-----------------------------------------------------------------
app.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ success: false, message: 'ログアウトに失敗しました' });
		}
		res.json({ success: true, message: 'ログアウト成功' });
	});
});

//リッスン--------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
