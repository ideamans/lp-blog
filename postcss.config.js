import tailwind from 'tailwindcss'
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'

// Clear Sky & Vitamin Pop テーマ
const clearSkyTheme = {
  'clearsky': {
    'primary': '#00B3E6',           // スカイブルー
    'primary-content': '#FFFFFF',
    'secondary': '#FF8200',         // ビタミンオレンジ
    'secondary-content': '#FFFFFF',
    'accent': '#FF8200',            // ビタミンオレンジ
    'accent-content': '#FFFFFF',
    'neutral': '#363F59',           // ネイビーグレー
    'neutral-content': '#FFFFFF',
    'base-100': '#F8F9FC',          // メイン背景色
    'base-200': '#F0F3F9',          // サブ背景色
    'base-300': '#E2E6F2',          // 境界線・無効色
    'base-content': '#262D3F',      // 本文テキスト
    'info': '#3ABFF8',              // 明るいシアン
    'info-content': '#FFFFFF',
    'success': '#00CDB8',           // ミントグリーン
    'success-content': '#FFFFFF',
    'warning': '#FFB600',           // ゴールドイエロー
    'warning-content': '#262D3F',
    'error': '#FF5861',             // ソフトレッド
    'error-content': '#FFFFFF',
    '--rounded-box': '0.25rem',     // カード・ボックス
    '--rounded-btn': '1rem',        // ボタン（ピル型）
    '--rounded-badge': '1rem',      // バッジ
    '--tab-radius': '0.25rem',      // タブ
  }
}

export default {
  plugins: [
    tailwind({
      content: ['./.vitepress/theme/**/*.vue', './posts/**/*.md'],
      plugins: [tailwindTypography, daisyui],
      darkMode: 'class',
      daisyui: {
        darkTheme: 'clearsky',
        themes: [clearSkyTheme]
      },
      theme: {
        extend: {
          typography: (theme) => ({
            DEFAULT: {
              css: {
                fontSize: '1.1em'
              }
            }
          })
        }
      }
    })
  ]
}
