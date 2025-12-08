<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'
import Category from './Category.vue'
import NotFound from './NotFound.vue'
import { data as categories } from './categories.data.js'
import Dayjs from 'dayjs'

const { page, frontmatter } = useData()
const { path } = useRoute()

const category = computed(() => {
  const paths = path.split('/')
  if (paths[1] !== 'categories') return null
  const basename = (paths[2] || '').replace('.html', '')
  return categories.find((category) => category.basename === basename)
})
</script>

<template>
  <div class="antialiased bg-base-100 text-base-content min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 xl:max-w-6xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a
          class="text-3xl flex flex-row items-center"
          href="/"
          aria-label="ideaman's Today"
        >
          <img
            class="inline-block mr-2"
            style="width: 196px; height: 43px"
            alt="logo"
            src="/logo.svg"
          />
          <span
            v-if="!frontmatter.index"
            class="hidden md:inline text-base-content/60"
            >Today</span
          >
        </a>
        <div class="text-sm text-base-content/60 leading-5">
          <a
            class="hover:text-primary transition-colors"
            href="https://www.ideamans.com/"
            target="_blank"
            rel="noopener"
            >アイデアマンズ株式会社 →</a
          >
        </div>
      </nav>
    </div>
    <main class="max-w-4xl mx-auto px-4 sm:px-6">
      <Home v-if="frontmatter.index" />
      <Category v-else-if="category" :category="category" />
      <NotFound v-else-if="page.isNotFound" />
      <Article v-else />
    </main>
    <footer class="footer footer-center p-4 bg-neutral text-neutral-content mt-16">
      <aside>
        <p>
          Copyright © {{ Dayjs().year() }} - All right reserved by
          <a href="https://www.ideamans.com/" class="link link-secondary">ideaman's Inc.</a>
        </p>
      </aside>
    </footer>
  </div>
</template>
