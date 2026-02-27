# OGP Image Generator - OGP画像生成スキル

ブログ記事のMarkdownと参照画像からOGP画像を生成するスキルです。Gemini APIを使用してマルチモーダル入力（テキスト＋画像）でOGP画像を生成します。

## 使い方

```
/ogp-image [記事ファイルパス]
```

例:
```
/ogp-image posts/2026/sitespeed-perception-gap.md
```

## 実行手順

1. **GEMINI_API_KEY の確認**

   まず環境変数 `GEMINI_API_KEY` が設定されているか確認してください:
   ```bash
   echo $GEMINI_API_KEY
   ```

   設定されていない場合は、ユーザーに以下のメッセージを表示して設定を促してください:

   > GEMINI_API_KEY が設定されていません。
   > Google AI Studio (https://aistudio.google.com/apikey) でAPIキーを取得し、
   > 以下のコマンドで設定してください:
   > ```
   > export GEMINI_API_KEY="your-api-key"
   > ```

2. **記事ファイルの読み込み**

   指定されたMarkdownファイルを読み込み、以下を抽出:
   - frontmatterの `date` から年を取得
   - ファイル名からslugを取得（拡張子なし）
   - 記事本文

3. **記事で使用されている画像の特定と取得**

   記事内の画像参照を解析:
   - `![...](...)` 形式
   - `<img src="...">` 形式

   **ローカル画像の場合:**
   - 記事ファイルからの相対パスで配置されている想定

   **外部URL画像の場合:**
   - 一時ディレクトリにダウンロードしてから使用
   - SVG画像は画像生成モデルには不向きなのでスキップ
   - 代表的な画像を2〜3枚程度選んでダウンロード

   ```bash
   # 外部画像のダウンロード例
   curl -L -o /tmp/image1.jpg "https://example.com/image.jpg"
   curl -L -o /tmp/image2.png "https://example.com/image.png"
   ```

4. **OGP画像の生成**

   ```bash
   node .claude/skills/ogp-image/generate.mjs \
     "<記事本文>" \
     "posts/{year}/{slug}.jpg" \
     "<画像ファイルパス1>" \
     "<画像ファイルパス2>" \
     ...
   ```

   - ウォーターマーク画像（`public/ideamans-today-watermark.png`）は自動で追加される
   - 参照画像は複数指定可能
   - 画像がない場合は画像引数なしで実行

5. **出力パスの規則**

   出力先: `posts/{year}/{slug}.jpg`（記事ファイルと同じディレクトリ、同名の `.jpg`）

   例:
   - `posts/2026/sitespeed-perception-gap.md` → `posts/2026/sitespeed-perception-gap.jpg`

6. **frontmatterの更新**

   生成後、記事のfrontmatterに `image` フィールドを追加/更新:
   ```yaml
   image: ./sitespeed-perception-gap.jpg
   ```

7. **結果の確認**

   生成された画像のパスをユーザーに報告します。

## パラメータ

generate.mjs の引数:

| 引数 | 必須 | 説明 |
|------|------|------|
| prompt | ○ | 記事の本文（Markdown） |
| output_path | ○ | 出力ファイルパス（`posts/{year}/{slug}.jpg`） |
| image_paths... | - | 参照画像ファイルパス（複数可） |

## 使用例

```bash
# 画像なしの場合
node .claude/skills/ogp-image/generate.mjs \
  "$(cat posts/2026/sample.md)" \
  "posts/2026/sample.jpg"

# 画像ありの場合
node .claude/skills/ogp-image/generate.mjs \
  "$(cat posts/2026/sample.md)" \
  "posts/2026/sample.jpg" \
  "posts/2026/image1.png" \
  "posts/2026/image2.jpg"
```

## 依存関係

- Node.js 18+
- GEMINI_API_KEY 環境変数
