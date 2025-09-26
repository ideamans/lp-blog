<script setup lang="ts">
import type { Post } from './posts.data.js'
import Date from './Date.vue'

const props = defineProps<{
  posts: Post[]
}>()
</script>

<template>
  <div class="pb-16">
    <ul class="space-y-6">
      <li
        class="py-4"
        v-for="{ title, url, date } of posts"
      >
        <article class="space-y-2">
          <Date :date="date" />
          <h2 class="text-xl leading-7 font-semibold tracking-tight">
            <a class="text-gray-900 dark:text-white hover:text-gray-600" :href="url">{{
              title
            }}</a>
          </h2>
        </article>
      </li>
    </ul>
  </div>
</template>
