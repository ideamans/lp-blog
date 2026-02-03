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
- **Tailwind CSS 3** + **DaisyUI 4** - スタイリング（Nordテーマ、ダーク）
- **TypeScript** - 型安全性

### 主要ディレクトリ

- `/.vitepress/config.ts` - サイト設定、OGP画像生成、ビルドフック
- `/.vitepress/theme/` - カスタムテーマ（Layout.vue がルーティング制御）
- `/.vitepress/theme/*.data.ts` - VitePressデータローダー（posts, categories）
- `/posts/YYYY/*.md` - ブログ記事（年別）
- `/products/` - 製品情報（記事末尾のProductLink用）
- `/frameworks/` - 記事執筆フレームワーク（6種類のライティングスタイル）
- `/agents/x-ai-posting.ts` - Gemini APIによるX自動投稿

### ビルドプロセス

VitePressの`buildEnd`フックで以下を実行:
1. `genFeed.ts` → `feed.rss` 生成（最新10件）
2. `genLLMs.ts` → `llms-full.txt` 生成（全記事のマークダウン）
3. `copyFrontmatterImages.ts` → frontmatterのimage画像をdistにコピー

OGP画像は`https://banners.ideamans.com`で動的生成、またはfrontmatterのimageフィールドで指定。

## 記事ファイルとURL対応

### ファイル構造とURL変換

| ソースファイル | 公開URL |
|---------------|---------|
| `posts/2025/sitespeed-revenue-mechanism.md` | `https://today.ideamans.com/posts/2025/sitespeed-revenue-mechanism.html` |
| `posts/2026/sitespeed-perception-gap.md` | `https://today.ideamans.com/posts/2026/sitespeed-perception-gap.html` |

VitePressのMPAモードにより、各記事は `.html` 拡張子付きの静的ページとして生成される。

### 記事ファイル命名規則

```
posts/{YYYY}/{slug}.md
```
- `YYYY`: 記事の公開年（`date` コマンドで取得）
- `slug`: 記事テーマを表す英語ハイフン区切り（例: `sitespeed-revenue-mechanism`）

## 記事のfrontmatter

```yaml
---
id: miyanaga                    # 著者ID（必須、authors.tsで定義）
title: 記事タイトル              # 30文字以内推奨（必須）
date: 2025-01-24                # 日付（必須、dateコマンドで正確に取得）
image: ./記事slug.jpg           # OGP画像（任意、nanobanana MCPで生成）
categories:                     # カテゴリ（任意、categories.tsで定義）
  - sitespeed
  - image-fitness
---
```

### 利用可能なカテゴリ（categories.ts）
- `sitespeed` → サイトスピード改善
- `image-fitness` → 画像最適化

### 著者情報（authors.ts）
- `miyanaga` → 代表取締役 宮永 邦彦（現在唯一の著者）

## 記事の執筆

@WRITING.md を参照のこと。

### 文体とトーン

- **対象読者**: Web業界の人だが技術的バックグラウンドはない。ビジネスマンが理解できるレベル
- **記事長**: 本文1800〜2500文字（製品紹介セクション除く）
- **見出し数**: 3〜5程度
- **タイトル**: 30文字以内、読者が得られる価値が一目でわかる

## 6種類の執筆フレームワーク

`/frameworks/` 以下に詳細ガイドラインあり。記事作成時はランダムに1つを選択。

| フレームワーク | 特徴 | 適した記事 |
|---------------|------|-----------|
| **問題解決型** | 共感→構造化→感情深掘り→解決→行動 | BtoB課題解決、業務改善 |
| **物語導入型** | 体験→感情変化→気づき→読者への橋渡し | 事例紹介、変化のストーリー |
| **問いかけ連鎖型** | 連続する問いで読者の思考を導く | 概念説明、気づきを促す |
| **共感集中型** | 読者の感情に深く寄り添う | 悩み解決、信頼構築 |
| **未来逆算型** | 理想の未来から逆算して今を示す | ビジョン提示、行動喚起 |
| **フリースタイル** | 自由形式 | 雑記、実験的コンテンツ |

### 問題解決型フレームの構成例

1. **問題の共感提示** - 「これ、まさにうちのことだ」と思わせる
2. **問題の構造化** - 「個人の問題」から「仕組みの問題」へ転換
3. **感情パート強化** - 焦りや不安の奥にある「変わりたい願い」を描く
4. **解決の方向性提示** - データではなく「変化の物語」として伝える
5. **再共感と行動誘導** - 「小さな一歩」を許す締め

## Vueコンポーネント

### ProductLink - 製品紹介カード

記事末尾で関連製品を紹介する際に使用:

```vue
<ProductLink
  code="speedismoney"
  title="Speed is Money"
  description="2〜3行の説明文。記事との関連性を意識して書く。"
  url="https://speedis.money/"
/>
```

**propsの説明:**
- `code`: 製品コード（`/products/{code}.md`と対応、アイコン生成にも使用）
- `title`: 製品名
- `description`: 説明文（記事との繋がりを意識）
- `url`: 製品の公式URL

**自動付与される機能:**
- UTMパラメータ（utm_source=ideamans-today, utm_medium=blog, utm_campaign=product_link）
- GA4コンバージョンイベント（product_link_click）
- アイコン画像（`https://alogorithm2.ideamans.com/v2/icon.svg?seed={code}`）

### 製品情報の参照

`/products/*.md` に各製品の詳細情報を記載:
- `speedismoney` - サイトスピード分析
- `lightfile-proxy` - WebP自動変換
- `lightfile-self` - 画像最適化ライブラリ
- `lightfile-next` - Next.js最適化
- `lightfile-simulator` - パフォーマンスシミュレーター
- `pagespeed-rehearsal` - PageSpeedテスト
- `ranklet4` - ランキング/アナリティクス
- `sitespeed-chronicle` - スピード履歴追跡

各製品ファイルには「紹介ルール」（どのようなテーマの記事で言及すべきか）が記載されているので参照のこと。

## OGP/代表画像の生成

記事執筆時は不要。ユーザーの指示に応じて:

1. **nanobanana MCPサーバー**を使用
2. 記事全文（マークダウン）を渡す
3. JPEG形式、記事ファイルと同名のbasename + `.jpg` で出力
4. 出力先: 記事ファイルと同じディレクトリ（例: `posts/2025/記事slug.jpg`）

## 新機能の追加方法

### 新しいカテゴリを追加

`categories.ts` に追加:
```typescript
{
  basename: 'new-category',
  name: '新しいカテゴリ名'
}
```

### 新しい著者を追加

`authors.ts` に追加:
```typescript
{
  name: '氏名',
  title: '役職',
  username: 'username',
  email: 'email@example.com',
  image: 'Gravatar URL',
  bio: '自己紹介文'
}
```

### 新しいVueコンポーネントを追加

1. `/.vitepress/theme/` にコンポーネントを作成
2. `/.vitepress/theme/index.ts` でグローバル登録:
```typescript
enhanceApp({ app }) {
  app.component('NewComponent', NewComponent)
}
```

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
