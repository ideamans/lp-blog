<script setup lang="ts">
import Date from './Date.vue'
import { data as posts } from './posts.data.js'
import { useData } from 'vitepress'
import ArticleList from './ArticleList.vue'
import MainCategoriesMenu from './MainCategoriesMenu.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="divide-y divide-base-300">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl leading-9 font-extrabold text-base-content tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ frontmatter.title }}
      </h1>
      <p class="text-lg leading-7 text-base-content/60">
        {{ frontmatter.subtext }}
      </p>
      <MainCategoriesMenu />
    </div>
    <ArticleList :posts="posts.slice(0, 100)" />
  </div>
</template>
