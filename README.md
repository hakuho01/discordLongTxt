# LongTxt — Discord向け長文共有サービス

ふせったーのDiscord版のような、長文共有Webサービスです。

## 機能

- Discord OAuth ログイン（編集・削除の本人確認）
- Markdown 対応の長文投稿
- 公開 URL（`/p/{slug}`）で全文閲覧
- Open Graph メタタグ（Discord プレビュー対応）
- 論理削除
- レート制限（投稿: 10件/時間、API: 20req/分/IP）

## セットアップ

### 1. 依存関係

```bash
npm install
```

### 2. 環境変数

`.env.example` を `.env` にコピーして設定します。

```bash
cp .env.example .env
```

`AUTH_SECRET` の生成:

```bash
openssl rand -base64 32
```

### 3. Discord アプリ設定

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリを作成
2. OAuth2 → Redirects に以下を追加:
   - 開発: `http://localhost:3000/api/auth/callback/discord`
   - 本番: `https://your-app.up.railway.app/api/auth/callback/discord`
3. Client ID / Client Secret を `.env` に設定

### 4. データベース

PostgreSQL を用意して `DATABASE_URL` を設定し、マイグレーションを実行:

```bash
npm run db:migrate
```

### 5. 開発サーバー

```bash
npm run dev
```

## Railway デプロイ

1. GitHub リポジトリを Railway に連携
2. **PostgreSQL アドオンを追加**
3. **Web サービスに DB 接続文字列を渡す**（最重要）

   Web サービス → **Variables** → **New Variable** → **Add Reference**

   | Variable | 参照元 |
   |----------|--------|
   | `DATABASE_URL` | PostgreSQL サービスの `DATABASE_URL` |

   手入力する場合: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   （`Postgres` は PostgreSQL サービスの名前。自分の環境の名前に合わせる）

4. その他の環境変数を設定:
   - `AUTH_SECRET`
   - `AUTH_URL`（例: `https://your-app.up.railway.app`）
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
5. デプロイ（起動時に migrate → Next.js start）

Node.js 22 以上が必要です（`.nvmrc` / `nixpacks.toml` で指定済み）。

Discord OAuth の Redirect URL に本番 URL を忘れず追加してください。

## URL 構成

| パス | 説明 |
|------|------|
| `/` | トップ（ログイン・投稿一覧） |
| `/posts/new` | 新規投稿 |
| `/posts/{slug}/edit` | 編集 |
| `/p/{slug}` | 公開ページ（OG タグ付き） |
