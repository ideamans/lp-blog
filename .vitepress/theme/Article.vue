<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as posts } from './posts.data.js'
import { authors } from '../../authors'
import { categories } from '../../categories'
import { loadDefaultJapaneseParser } from 'budoux'
import Dayjs from 'dayjs'
import LeadBlock from './LeadBlock.vue'

const { frontmatter: data } = useData()
const route = useRoute()
const parser = loadDefaultJapaneseParser()

const categoryNameByBasename = new Map(categories.map((c) => [c.basename, c.name]))

const resolvedImage = computed(() => {
  const image = data.value.image
  if (!image) return null
  if (image.startsWith('/') || image.startsWith('http')) return image
  const dir = route.path.replace(/[^/]+$/, '')
  const imagePath = image.startsWith('./') ? image.slice(2) : image
  return withBase(dir + imagePath)
})

const currentIndex = computed(() => posts.findIndex((p) => p.url === route.path))
const date = computed(() => posts[currentIndex.value]?.date)

const author = computed(() => {
  const authorId = data.value.author || data.value.id || 'miyanaga'
  return authors.find((a) => a.username === authorId) || authors[0]
})

const titleSegments = computed(() => {
  if (!data.value.title) return []
  return parser.parse(data.value.title)
})

function formatJapaneseDate(d: any) {
  if (!d) return ''
  const dateStr = d?.string || d
  if (!dateStr) return ''
  const dt = new Date(dateStr)
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`
}

function formatBylineDate(d: any) {
  if (!d) return ''
  const dateStr = d?.string || d
  if (!dateStr) return ''
  return Dayjs(dateStr).format('DD MMM YYYY').toUpperCase()
}

function formatRelatedDate(d: any) {
  if (!d) return ''
  const dateStr = d?.string || d
  if (!dateStr) return ''
  return Dayjs(dateStr).format('YYYY · MMM DD').toUpperCase()
}

const sectionLabel = computed(() => {
  const first = data.value.categories?.[0]
  if (!first) return ''
  return categoryNameByBasename.get(first) || first
})

const sectionBasename = computed(() => data.value.categories?.[0])

const articleNumber = computed(() => {
  const idx = currentIndex.value
  if (idx < 0) return ''
  return String(posts.length - idx).padStart(3, '0')
})

const breadcrumbMonth = computed(() => {
  const d: any = date.value
  const dateStr = d?.string || d
  if (!dateStr) return ''
  return Dayjs(dateStr).format('MMMM').toUpperCase()
})

const breadcrumbYear = computed(() => {
  const d: any = date.value
  const dateStr = d?.string || d
  if (!dateStr) return ''
  return Dayjs(dateStr).format('YYYY')
})

const relatedPosts = computed(() => {
  const currentCategories = data.value.categories || []
  if (currentCategories.length === 0) return []
  const currentPath = route.path
  return posts
    .filter((post) => {
      if (post.url === currentPath) return false
      const postCategories = post.categories || []
      return postCategories.some((cat) => currentCategories.includes(cat))
    })
    .slice(0, 3)
})
</script>

<template>
  <article>
    <LeadBlock
      :kicker="sectionLabel ? `— ${sectionLabel}, no. ${articleNumber} —` : '— Editorial —'"
      :title="data.title"
      :title-segments="titleSegments"
      :deck="data.description"
      heading="h1"
    >
      <template #meta>
        <span style="color: var(--ink-soft)">FILED</span>&nbsp;<b>{{ formatBylineDate(date) }}</b>
        <template v-if="sectionLabel">
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <span style="color: var(--ink-soft)">SECTION</span>&nbsp;<b>{{ sectionLabel }}</b>
        </template>
        &nbsp;&nbsp;·&nbsp;&nbsp;
        <span style="color: var(--ink-soft)">BY</span>&nbsp;<b>{{ author.name }}</b>
      </template>
    </LeadBlock>

    <div v-if="resolvedImage" class="art-hero">
      <img :src="resolvedImage" :alt="data.title" />
    </div>

    <div class="art-body">
      <main class="art-main">
        <Content />

        <div class="art-author">
          <img :src="author.image" :alt="author.name" />
          <div class="meta">
            <div><b>{{ author.name }}</b></div>
            <div>{{ author.title }}</div>
            <div v-if="date">{{ formatJapaneseDate(date) }}</div>
          </div>
        </div>
      </main>
    </div>

    <section v-if="relatedPosts.length > 0" class="art-related">
      <div class="lbl">Related —— 同欄の記事</div>
      <div class="grid">
        <div v-for="post in relatedPosts" :key="post.url" class="rel">
          <a :href="post.url">
            <div class="d">{{ formatRelatedDate(post.date) }}</div>
            <div class="t">{{ post.title }}</div>
          </a>
        </div>
      </div>
    </section>
  </article>
</template>
