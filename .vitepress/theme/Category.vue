<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '../../categories'
import { data as allPosts } from './posts.data.js'
import Dayjs from 'dayjs'

const props = defineProps<{
  category: Category
}>()

const posts = computed(() =>
  allPosts.filter((post) => post.categories?.includes(props.category.basename))
)

function fmtIdxDate(s: string) {
  return Dayjs(s).format('YYYY-MM-DD')
}

function rowExcerpt(p: { description?: string; excerpt?: string }) {
  const text = (p.description || (p.excerpt || '').replace(/<[^>]*>/g, '')).trim()
  return text.length > 100 ? text.slice(0, 100) + '…' : text
}
</script>

<template>
  <header class="arc-head">
    <div class="arc-eyebrow">CATEGORY · 部門</div>
    <h1 class="arc-year" style="font-family: var(--serif-jp); font-style: normal; font-weight: 700; letter-spacing: -0.02em;">
      {{ category.name }}
    </h1>
    <div class="arc-sub">
      <h2>全{{ posts.length }}篇</h2>
      <div class="stat">
        entries <span class="arc-stat-num">{{ posts.length }}</span>
      </div>
    </div>
  </header>

  <section class="index-wrap" style="padding-top: 24px">
    <div class="index-head">
      <h3>{{ category.name }} ──── Entries</h3>
      <span class="smc">{{ posts.length }} entries</span>
    </div>

    <a v-for="p in posts" :key="p.url" class="idx-row idx-link" :href="p.url">
      <div class="idx-date">{{ fmtIdxDate(p.date) }}</div>
      <div>
        <h3 class="idx-title">{{ p.title }}</h3>
        <p class="idx-excerpt">{{ rowExcerpt(p) }}</p>
      </div>
      <div class="idx-cat">— {{ category.name }}</div>
    </a>
  </section>
</template>
