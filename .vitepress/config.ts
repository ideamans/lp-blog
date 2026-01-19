import Dayjs from 'dayjs'
import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed.js'
import { genLLMs } from './genLLMs.js'
import { copyFrontmatterImages } from './copyImages.js'

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
  title: `ideaman's Today`,
  description: 'Webフィットネスの普及に向けた新しいWebの新常識',
  cleanUrls: false,
  ignoreDeadLinks: true,
  rewrites: {},
  head: [
    ['meta', { name: 'twitter:site', content: '@ideamans' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
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

    if (pageData.frontmatter?.index || !pageData.frontmatter?.title) {
      // インデックスページ
      const subTitle = pageData.frontmatter.subtext

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
        const relativePath = pageData.relativePath ?? ''
        const dir = relativePath.replace(/[^/]+$/, '')
        const imagePath = frontmatterImage.startsWith('./')
          ? dir + frontmatterImage.slice(2)
          : frontmatterImage.startsWith('/')
            ? frontmatterImage.slice(1)
            : dir + frontmatterImage
        ogImage = `https://today.ideamans.com/${imagePath}`
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
    }
  },
  appearance: false
})
