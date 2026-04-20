import Dayjs from 'dayjs'
import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed.js'
import { genLLMs } from './genLLMs.js'
import { copyFrontmatterImages } from './copyImages.js'
import { crosslinkPlugin } from './crosslink-plugin.js'
import { categories as categoryList } from '../categories.js'

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

export default defineConfig({
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
        async: '1',
        src: 'https://free.ranklet4.com/widgets/JEfB8ZpuktdYw2GQ2auB.js'
      }
    ]
  ],
  buildEnd: async (config) => {
    await genFeed(config)
    await genLLMs(config)
    await copyFrontmatterImages(config)
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
})
