# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ideaman's Today - VitePress + Vue 3で構築されたテクニカルブログシステム

## 開発コマンド

```bash
yarn dev          # 開発サーバーの起動（ブラウザ自動オープン）
yarn build        # プロダクションビルド
yarn serve        # ビルド結果のプレビュー
yarn x-ai-posting # X(Twitter)自動投稿エージェントの実行
```

## アーキテクチャ

### 技術スタック
- **VitePress 1.0** - 静的サイトジェネレーター（MPA モード）
- **Vue 3** - UIフレームワーク（Composition API）
- **Tailwind CSS 3** + **DaisyUI 4** - スタイリング
- **TypeScript** - 型安全性

### 主要ディレクトリ

- `/.vitepress/config.ts` - サイト設定、OGP画像生成、ビルドフック
- `/.vitepress/theme/` - カスタムテーマ（Layout.vue がルーティング制御）
- `/.vitepress/theme/*.data.ts` - VitePressデータローダー（posts, categories, authors）
- `/posts/YYYY/*.md` - ブログ記事（年別）
- `/products/` - 製品情報（記事末尾のProductLink用）
- `/frameworks/` - 記事執筆フレームワーク（6種類のライティングスタイル）
- `/agents/x-ai-posting.ts` - Gemini APIによるX自動投稿

### ビルドプロセス

VitePressの`buildEnd`フックで以下を実行:
1. `genFeed.ts` → `feed.rss` 生成
2. `genLLMs.ts` → `llms-full.txt` 生成
3. `copyFrontmatterImages.ts` → frontmatterのimage画像をコピー

OGP画像は`https://banners.ideamans.com`で動的生成、またはfrontmatterのimageフィールドで指定。

## 記事のfrontmatter

```yaml
---
id: miyanaga                    # 著者ID（必須）
title: 記事タイトル              # 30文字以内推奨（必須）
date: 2025-01-24                # 日付（必須）
image: ./記事slug.jpg           # OGP画像（任意、nanobanana MCPで生成）
categories:                     # カテゴリ（任意）
  - sitespeed
  - image-fitness
---
```

## 記事の執筆

@WRITING.md を参照のこと。

### ProductLinkコンポーネント

記事末尾で製品紹介に使用:
```vue
<ProductLink
  code="製品コード"
  title="製品名"
  description="説明文"
  url="https://example.com/"
/>
```

製品情報は `/products/*.md` を参照し、適切な製品を選択。

## 環境変数（.env）

```
GEMINI_API_KEY=       # Gemini API キー（x-ai-posting用）
TWITTER_APP_KEY=      # Twitter API Consumer Key
TWITTER_APP_SECRET=   # Twitter API Consumer Secret
TWITTER_ACCESS_TOKEN= # Twitter API Access Token
TWITTER_ACCESS_SECRET=# Twitter API Access Secret
X_AI_POSTING_PROD=    # 本番環境フラグ（設定時のみ実投稿）
```

## 弊社製品情報

@products 以下に情報を記載。記事との関連性に応じて参照。