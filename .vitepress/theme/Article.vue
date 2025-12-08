<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from './posts.data.js'
import { authors } from '../../authors'
import { loadDefaultJapaneseParser } from 'budoux'

const { frontmatter: data } = useData()

const route = useRoute()
const parser = loadDefaultJapaneseParser()

function findCurrentIndex() {
  return posts.findIndex((p) => p.url === route.path)
}

// use the customData date which contains pre-resolved date info
const date = computed(() => posts[findCurrentIndex()]?.date)

// Get author information
const author = computed(() => {
  const authorId = data.value.author || data.value.id || 'miyanaga'
  return authors.find(a => a.username === authorId) || authors[0]
})

// Split title with BudouX
const titleSegments = computed(() => {
  if (!data.value.title) return []
  return parser.parse(data.value.title)
})

// Format date in Japanese
function formatJapaneseDate(dateObj: any) {
  if (!dateObj) return ''
  // dateObj could be an object with string property or just a string
  const dateStr = dateObj.string || dateObj
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// Get related posts from the same category
const relatedPosts = computed(() => {
  const currentCategories = data.value.categories || []
  if (currentCategories.length === 0) return []

  const currentPath = route.path

  return posts
    .filter(post => {
      // Exclude current post
      if (post.url === currentPath) return false
      // Check if post has any matching category
      const postCategories = post.categories || []
      return postCategories.some(cat => currentCategories.includes(cat))
    })
    .slice(0, 5) // Take only first 5
})
</script>

<template>
  <article class="max-w-4xl mx-auto">
    <header class="pt-6 pb-2 space-y-4">
      <h1
        class="text-3xl leading-9 font-bold text-base-content tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-snug"
      >
        <span v-for="(segment, index) in titleSegments" :key="index">
          <span class="whitespace-nowrap">{{ segment }}</span>
        </span>
      </h1>

      <!-- Author Info -->
      <div class="flex items-center space-x-4">
        <img
          :src="author.image"
          :alt="author.name"
          class="w-16 h-16 rounded-full"
        >
        <div class="text-sm text-base-content/60">
          <div class="font-bold text-base-content">{{ author.name }}</div>
          <div>{{ author.title }}</div>
          <div>{{ formatJapaneseDate(date) }}</div>
        </div>
      </div>

      <!-- OGP Image -->
      <img
        v-if="data.image"
        :src="data.image"
        :alt="data.title"
        class="w-full rounded-box"
      >
    </header>

    <div class="pb-16">
      <Content class="prose max-w-none pb-8 prose-base-content prose-p:text-base-content/80 prose-strong:text-secondary prose-strong:font-bold prose-strong:bg-secondary/10 prose-strong:px-1 prose-headings:text-base-content prose-a:text-primary hover:prose-a:text-primary/80" />
    </div>

    <!-- Related Articles -->
    <section v-if="relatedPosts.length > 0" class="border-t border-base-300 pt-8 pb-8">
      <h2 class="text-2xl font-bold text-base-content mb-6">こちらもおすすめ</h2>
      <div class="space-y-4">
        <article v-for="post in relatedPosts" :key="post.url" class="border-l-4 border-primary pl-4">
          <a :href="post.url" class="block hover:opacity-75 transition-opacity">
            <h3 class="text-lg font-semibold text-base-content mb-1">{{ post.title }}</h3>
            <div class="text-sm text-base-content/60">
              {{ formatJapaneseDate(post.date) }}
            </div>
          </a>
        </article>
      </div>
    </section>

  </article>
</template>
