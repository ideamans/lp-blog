<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'
import Category from './Category.vue'
import NotFound from './NotFound.vue'
import { categories } from '../../categories'
import Dayjs from 'dayjs'
import { data as posts } from './posts.data.js'

const { page, frontmatter } = useData()
const { path } = useRoute()

const category = computed(() => {
  const paths = path.split('/')
  if (paths[1] !== 'categories') return null
  const basename = (paths[2] || '').replace('.html', '')
  return categories.find((c) => c.basename === basename)
})

const todayMeta = computed(() => {
  const now = Dayjs()
  return {
    year: now.format('YYYY')
  }
})

const stripUrls = computed(() => {
  return [
    { label: 'サイトスピード', basename: 'sitespeed' },
    { label: 'Core Web Vitals', basename: 'core-web-vitals' },
    { label: '画像最適化', basename: 'image-fitness' },
    { label: 'AI活用', basename: 'ai-utilization' },
    { label: 'Web設計', basename: 'web-architecture' }
  ].filter((s) => categories.some((c) => c.basename === s.basename))
})
</script>

<template>
  <div class="ed-page">
    <header class="mast mast-center">
      <h1 class="mast-title">
        <a href="/">ideaman's <span class="en">Today</span></a>
      </h1>
      <div class="mast-en">
        軽快なWebサイトを実現するための新常識
      </div>
      <div class="mast-search" style="margin-top: 0.5rem">
        <div data-knowledge-search data-set="today" data-label="記事を検索"></div>
      </div>
      <nav class="mast-strap">
        <a v-for="s in stripUrls" :key="s.basename" :href="`/categories/${s.basename}.html`">{{ s.label }}</a>
        <a href="https://www.ideamans.com/" target="_blank" rel="noopener">ideamans inc. →</a>
      </nav>
    </header>

    <main>
      <Home v-if="frontmatter.index" />
      <Category v-else-if="category" :category="category" />
      <NotFound v-else-if="page.isNotFound" />
      <Article v-else />
    </main>

    <footer class="ed-foot">
      <div><b>ideaman's Today</b> · ideamans inc. · est. 2002</div>
      <div>Set in Noto Serif JP &amp; EB Garamond</div>
      <div>© {{ todayMeta.year }} <a href="https://www.ideamans.com/">ideamans inc.</a></div>
    </footer>
  </div>
</template>
