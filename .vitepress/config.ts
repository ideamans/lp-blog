import Dayjs from 'dayjs'
import markdownItCjkFriendly from 'markdown-it-cjk-friendly'
import { defineConfig } from 'vitepress'
import { withMachineReadability } from 'vitepress-machine-readability'
import { genLLMs } from './genLLMs.js'
import { copyFrontmatterImages } from './copyImages.js'
import { crosslinkPlugin } from './crosslink-plugin.js'
import { categories as categoryList } from '../categories.js'
// @ts-ignore ビルド済みの単一ファイル（services/knowledge が配布元）
import { buildKnowledgePackage } from './knowledge-indexer.mjs'

const categoryNameByBasename = new Map(categoryList.map((c) => [c.basename, c.name]))

function indexImageUrl(bgUrl: string, subTitle: string): string {
  const ogp = new URL('https://banners.ideamans.com/banners/type-a')
  ogp.searchParams.set('bgUrl', bgUrl)

  ogp.searchParams.set('text0', `ideaman's Today`)
  ogp.searchParams.set('text0width', '60%')

  ogp.searchParams.set('text1', subTitle)
  ogp.searchParams.set('text1width', '60%')

  return ogp.href
}

function articleImageUrl(bgUrl: string, title: string, meta: string): string {
  const ogp = new URL('https://banners.ideamans.com/banners/type-a')
  ogp.searchParams.set('bgUrl', bgUrl)

  ogp.searchParams.set('text0', `ideaman's Today`)
  ogp.searchParams.set('text0width', '60%')

  ogp.searchParams.set('text1', title)
  ogp.searchParams.set('texts[1].fontSize', '5%')
  ogp.searchParams.set('texts[1].minWidth', '60%')
  ogp.searchParams.set('texts[1].maxWidth', '90%')
  ogp.searchParams.set('text2', meta)
  ogp.searchParams.set(`text[2].fontSize`, '3%')
  ogp.searchParams.set(`text[2].minWidth`, '30%')
  ogp.searchParams.set(`text[2].maxWidth`, '40%')

  return ogp.href
}

function articleTwitterImageUrl(slug: string): string {
  const image = new URL('https://alogorithm2.ideamans.com/v2/rect.png')
  image.searchParams.set('seed', [slug, 'today'].join('@'))
  image.searchParams.set('width', '256')
  image.searchParams.set('height', '256')
  return image.href
}

function indexTwitterImageUrl(): string {
  const image = new URL('https://alogorithm2.ideamans.com/v2/rect.png')
  image.searchParams.set('seed', 'today')
  image.searchParams.set('width', '256')
  image.searchParams.set('height', '256')
  return image.href
}

export default defineConfig(
  withMachineReadability({
  mpa: true,
  lang: 'ja',
  title: `ideaman's Today`,
  description: 'Webフィットネスの普及に向けた新しいWebの新常識',
  cleanUrls: false,
  ignoreDeadLinks: true,
  srcExclude: ['frameworks/**', 'products/**', 'policy/**', 'CLAUDE.md', 'WRITING.md', 'ideas.md'],
  rewrites: {},
  sitemap: {
    hostname: 'https://today.ideamans.com',
    transformItems: (items) => {
      // 記事とトップページ、カテゴリページのみsitemapに含める
      return items.filter((item) => {
        const url = item.url
        return (
          url === '' ||
          url === 'index.html' ||
          url.startsWith('posts/') ||
          url.startsWith('categories/')
        )
      })
    }
  },
  markdown: {
    config: (md) => {
      // CJK句読点の隣で **太字** が機能しない CommonMark の問題を回避
      md.use(markdownItCjkFriendly)
      md.use(crosslinkPlugin, {
        getSlug: (env) => {
          // posts/2025/example.md → example
          const match = env.relativePath?.match(/\/([^/]+)\.md$/)
          return match ? match[1] : 'unknown'
        }
      })
    }
  },
  head: [
    ['meta', { name: 'twitter:site', content: '@ideamans' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap'
      }
    ],
    // [
    //   'meta',
    //   {
    //     name: 'twitter:image',
    //     content: 'https://logo.ideamans.com/ogp.svg?width=800&phrase=today'
    //   }
    // ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/today.svg'
      }
    ],
    [
      'script',
      {
        src: 'https://tags.ideamans.com/scripts/today.js',
        async: '1'
      }
    ],
    [
      'script',
      {
        // ナレッジ基盤の検索UI。MPAなのでVueのハンドラは使えず素のJSで動く。
        // 本体（InstantSearch）は検索を始めた人だけが読む遅延ロード。
        src: '/knowledge-search.js',
        defer: ''
      }
    ],
    [
      'script',
      {
        async: '1',
        src: 'https://free.ranklet4.com/widgets/JEfB8ZpuktdYw2GQ2auB.js'
      }
    ]
  ],
  buildEnd: async (config) => {
    await genLLMs(config)
    await copyFrontmatterImages(config)

    // ナレッジパッケージ。deploy.sh が knowledge.ideamans.com へ送る。
    const pkg = await buildKnowledgePackage(config, {
      id: 'today',
      title: "ideaman's Today",
      description: 'Webフィットネスの普及に向けた新しいWebの新常識',
      origin: 'https://today.ideamans.com',
      include: 'posts/**/*.md',
      out: 'knowledge/today.zip',
      outline: { group_by: 'date' },
      search: { facets: ['category_labels', 'category_path', 'author', 'year'] },
      map: (page) => {
        const fm = page.frontmatter
        if (fm.draft) return null

        const categories: string[] = Array.isArray(fm.categories) ? fm.categories : []
        return {
          title: fm.title,
          summary: fm.description ?? page.excerpt,
          published_at: fm.date,
          category_path: categories,
          category_labels: categories.map(
            (id: string) => categoryList.find((c) => c.basename === id)?.name ?? id
          ),
          // このサイトは著者IDを id で持つ（authorId ではない）
          author: fm.id,
          image: fm.ogp ?? fm.image,
        }
      },
    })
    console.log(
      `[knowledge] ${pkg.out} (${pkg.documents}件 / ${(pkg.bytes / 1024).toFixed(1)}KB / ${pkg.generation})`
    )
  },
  // 月別・カテゴリは動的ルートで、テンプレートの frontmatter がそのまま
  // title になる（5ページが揃って同じ <title> だった）。params から作る。
  transformPageData: (pageData) => {
    const params = pageData.params as Record<string, string> | undefined
    if (!params) return
    if (params.year && params.month) {
      return { title: `${params.year}年${Number(params.month)}月の記事` }
    }
    if (params.category) {
      const label = categoryList.find((c) => c.basename === params.category)?.name ?? params.category
      return { title: `${label}の記事` }
    }
  },

  transformHead: ({ head, pageData }) => {
    const ogpBgUrl = 'https://today.ideamans.com/ogp-background.jpg'
    const siteUrl = 'https://today.ideamans.com'

    // ページURLの構築
    const relativePath = pageData.relativePath ?? ''
    const pagePath = relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')
    const pageUrl = `${siteUrl}/${pagePath}`

    // canonical URL
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    // og:url
    head.push(['meta', { property: 'og:url', content: pageUrl }])

    // og:title（全ページ共通）
    const pageTitle = pageData.frontmatter?.title || `ideaman's Today`
    head.push(['meta', { property: 'og:title', content: pageTitle }])

    if (pageData.frontmatter?.index || !pageData.frontmatter?.title) {
      // インデックスページ
      const subTitle = pageData.frontmatter.subtext
      const description =
        pageData.frontmatter.description || pageData.frontmatter.subtext || 'Webフィットネスの普及に向けた新しいWebの新常識'

      head.push(['meta', { property: 'og:type', content: 'website' }])
      head.push(['meta', { property: 'og:description', content: description }])
      head.push([
        'meta',
        {
          property: 'og:image',
          content: indexImageUrl(ogpBgUrl, subTitle)
        }
      ])
      head.push([
        'meta',
        {
          property: 'twitter:image',
          content: indexTwitterImageUrl()
        }
      ])
    } else {
      // 記事ページ
      const title = pageData.frontmatter.title
      const id = pageData.frontmatter.id
      const date = Dayjs(pageData.frontmatter.date).format('YYYY/MM/DD')
      const frontmatterImage = pageData.frontmatter.image
      const description = pageData.frontmatter.description || pageData.description || ''

      head.push(['meta', { property: 'og:type', content: 'article' }])

      if (description) {
        head.push(['meta', { property: 'og:description', content: description }])
      }

      // Twitter Card
      head.push([
        'meta',
        {
          name: 'twitter:title',
          content: title
        }
      ])

      // OGP画像 - フロントマターにimageがあればそれを使用
      let ogImage: string
      let twitterImage: string

      if (frontmatterImage) {
        // 相対パスを絶対URLに変換
        const dir = relativePath.replace(/[^/]+$/, '')
        const imagePath = frontmatterImage.startsWith('./')
          ? dir + frontmatterImage.slice(2)
          : frontmatterImage.startsWith('/')
            ? frontmatterImage.slice(1)
            : dir + frontmatterImage
        ogImage = `${siteUrl}/${imagePath}`
        twitterImage = ogImage
      } else {
        ogImage = articleImageUrl(ogpBgUrl, title, `${date} @${id}`)
        twitterImage = articleTwitterImageUrl(
          pageData.relativePath ?? pageData.filePath ?? ''
        )
      }

      head.push([
        'meta',
        {
          property: 'twitter:image',
          content: twitterImage
        }
      ])

      // OGP
      head.push([
        'meta',
        {
          property: 'og:image',
          content: ogImage
        }
      ])

      // 構造化データ (JSON-LD) - Article
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        datePublished: Dayjs(pageData.frontmatter.date).format('YYYY-MM-DD'),
        author: {
          '@type': 'Person',
          name: '宮永 邦彦',
          url: 'https://www.ideamans.com/'
        },
        publisher: {
          '@type': 'Organization',
          name: 'アイデアマンズ株式会社',
          url: 'https://www.ideamans.com/',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/today.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        ...(ogImage ? { image: ogImage } : {}),
        ...(description ? { description } : {})
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(jsonLd)
      ])

      // 構造化データ (JSON-LD) - BreadcrumbList
      // ホーム > (カテゴリ) > 記事タイトル
      const firstCatBasename = Array.isArray(pageData.frontmatter.categories)
        ? pageData.frontmatter.categories[0]
        : undefined
      const firstCatName = firstCatBasename
        ? categoryNameByBasename.get(firstCatBasename)
        : undefined

      const breadcrumbItems: Array<{
        '@type': 'ListItem'
        position: number
        name: string
        item: string
      }> = [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${siteUrl}/` }
      ]
      if (firstCatBasename && firstCatName) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: firstCatName,
          item: `${siteUrl}/categories/${firstCatBasename}.html`
        })
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: pageUrl
        })
      } else {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: pageUrl
        })
      }

      const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(breadcrumbLd)
      ])
    }
  },
  appearance: false
},
  // 検索エンジンとAIから読める状態にする。既存の transformHead / buildEnd は潰さない
  {
    hostname: 'https://today.ideamans.com/',
    organization: {
      name: 'アイデアマンズ株式会社',
      url: 'https://www.ideamans.com/'
    },
    map: { description: ['description'] },
    feed: { pattern: 'posts/**/*.md', title: "ideaman's Today" },
    // Markdown の原本も配る（LLMがHTMLから本文を復元しなくて済む）
    markdownSource: true,
    lint: 'warn'
  })
)
