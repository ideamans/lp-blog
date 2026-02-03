<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const props = defineProps<{
  code: string
  title: string
  description: string
  url: string
}>()

const route = useRoute()

// 記事のslugを取得（/posts/2025/slug.html → slug）
const getSlug = (path: string): string => {
  const match = path.match(/\/([^/]+)\.html$/)
  return match ? match[1] : 'unknown'
}

// UTMパラメータ付きURLを生成（cross-link-manager仕様準拠）
const trackedUrl = computed(() => {
  const url = new URL(props.url)
  url.searchParams.set('utm_source', 'today.ideamans.com')
  url.searchParams.set('utm_medium', 'owned_media')
  url.searchParams.set('utm_campaign', 'regular')
  url.searchParams.set('utm_content', getSlug(route.path))
  return url.toString()
})

// GA4コンバージョンイベントを発火
const trackClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'product_link_click', {
      product_code: props.code,
      product_title: props.title,
      product_url: props.url,
      source_page: route.path
    })
  }
}
</script>

<template>
  <a
    :href="trackedUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="not-prose block border border-base-300 rounded-box p-4 hover:bg-base-200 transition-colors group"
    @click="trackClick"
  >
    <div class="flex items-start gap-4">
      <img
        :src="`https://alogorithm2.ideamans.com/v2/icon.svg?seed=${code}&width=128`"
        :alt="title"
        class="w-16 h-16 flex-shrink-0"
      >
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
          {{ title }}
        </h3>
        <p class="text-sm text-base-content/70 mt-1">
          {{ description }}
        </p>
      </div>
    </div>
  </a>
</template>
