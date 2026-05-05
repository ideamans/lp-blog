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

// Issue / volume number from total post count (auto-incrementing label)
const issueNumber = computed(() => String(posts.length).padStart(3, '0'))

const todayMeta = computed(() => {
  const now = Dayjs()
  const monthEn = now.format('MMM').toUpperCase()
  return {
    year: now.format('YYYY'),
    month: monthEn,
    day: now.format('DD')
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
    <header class="mast">
      <div class="mast-row">
        <div>
          <h1 class="mast-title">
            <a href="/">ideaman's <span class="en">Today</span></a>
          </h1>
          <div class="mast-en">
            Web Performance &nbsp;·&nbsp; Image Optimization &nbsp;·&nbsp; AI Engineering
          </div>
        </div>
        <div class="mast-meta">
          <div><b>VOL. XXIV</b> &nbsp;·&nbsp; NO. {{ issueNumber }}</div>
          <div>{{ todayMeta.year }} <span class="vermilion">·</span> {{ todayMeta.month }} <span class="vermilion">·</span> ideamans inc.</div>
          <div>EDITED BY MIYANAGA K.</div>
        </div>
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
