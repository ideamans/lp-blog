# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ideaman's Today - VitePress + Vue 3で構築されたテクニカルブログシステム

## 開発コマンド

```bash
# 開発サーバーの起動
yarn dev
# または
npm run dev

# プロダクションビルド
yarn build
# または
npm run build

# ビルド結果のプレビュー
yarn serve
# または
npm run serve

# X(Twitter)自動投稿エージェントの実行
yarn x-ai-posting
# または
npm run x-ai-posting
```

## アーキテクチャ

### 技術スタック
- **VitePress 1.0** - 静的サイトジェネレーター
- **Vue 3** - UIフレームワーク（Composition API）
- **Tailwind CSS 3** + **DaisyUI 4** - スタイリング
- **TypeScript** - 型安全性
- **PostCSS** - CSS処理
- **Dayjs** - 日付処理

### ディレクトリ構造

- `/.vitepress/` - VitePress設定とカスタマイズ
  - `/config.ts` - サイト設定、OGP画像生成、GA設定
  - `/theme/` - カスタムテーマ実装
    - `Layout.vue` - メインレイアウト（ヘッダー、フッター、ルーティング）
    - `Home.vue`, `Article.vue`, `Category.vue` - ページコンポーネント
    - `style.css` - Tailwindベースのスタイル定義
  - `/genFeed.ts` - RSS フィード生成（ビルド時）
  - `/genLLMs.ts` - LLM用テキスト出力生成（ビルド時）

- `/posts/` - ブログ記事（年別ディレクトリ構造）
  - `/YYYY/*.md` - Markdown記事ファイル

- `/agents/` - 自動化スクリプト
  - `x-ai-posting.ts` - Gemini APIを使った記事のX自動投稿

- `/categories/` - カテゴリページ

## ビルドプロセス

1. VitePressがMarkdown記事を静的HTMLに変換
2. `genFeed.ts`がRSSフィード（`feed.rss`）を生成
3. `genLLMs.ts`がLLM用テキストファイル（`llms-full.txt`）を生成
4. OGP画像は動的生成（`https://banners.ideamans.com`サービス使用）

## 環境変数（.env）

```
GEMINI_API_KEY=       # Gemini API キー（x-ai-posting用）
TWITTER_APP_KEY=      # Twitter API Consumer Key
TWITTER_APP_SECRET=   # Twitter API Consumer Secret
TWITTER_ACCESS_TOKEN= # Twitter API Access Token
TWITTER_ACCESS_SECRET=# Twitter API Access Secret
X_AI_POSTING_PROD=    # 本番環境フラグ（設定時のみ実投稿）
```

## PostCSS設定

Tailwind CSSをVitePressで使用するために、`postcss.config.js`でプラグインチェーンを設定。VitePressのMarkdownコンテンツもTailwindのcontent対象に含める。

# 記事の執筆

@WRITING.md を参照のこと。

# 弊社製品情報

@projects 以下に情報を記載する。随時参照する。