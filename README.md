# shosai

Hono + Cloudflare Workers で動く、Google ログイン付きのユーザー専用ページ。

- 認証: Google OAuth (`@hono/oauth-providers`)
- セッション: HS256 署名 JWT を HttpOnly Cookie に保存（7日間）
- DB: Cloudflare D1（`users` テーブル）
- CSS: Tailwind CSS v4（`src/style.css` → `public/static/style.css`。`wrangler dev` / `deploy` 時に自動ビルド）

## ルート

| パス | 内容 |
| --- | --- |
| `GET /` | トップ（ログインリンク） |
| `GET /auth/google` | Google ログイン開始 / コールバック |
| `GET /me` | ログインユーザー専用ページ（要ログイン） |
| `POST /logout` | ログアウト |

## セットアップ

### 1. Google OAuth クライアント作成

Google Cloud Console → 「APIとサービス」→「認証情報」→ OAuth クライアント ID（ウェブアプリケーション）を作成し、承認済みリダイレクト URI に以下を登録する。

- `http://localhost:8787/auth/google`
- `https://<本番ドメイン>/auth/google`

### 2. ローカル開発

```sh
pnpm install
cp .dev.vars.example .dev.vars   # Client ID / Secret / SESSION_SECRET を記入
pnpm db:migrate:local
pnpm dev                         # http://localhost:8787
```

### 3. デプロイ

```sh
pnpm wrangler login
pnpm wrangler d1 create shosai-db   # 出力された database_id を wrangler.jsonc に反映
pnpm db:migrate:remote
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
pnpm wrangler secret put SESSION_SECRET
pnpm run deploy                   # pnpm deploy は pnpm 組込コマンドと衝突するため run 必須
```
