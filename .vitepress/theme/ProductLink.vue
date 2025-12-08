<script setup lang="ts">
defineProps<{
  code: string
  title: string
  description: string
  url: string
}>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="not-prose block border border-base-300 rounded-box p-4 hover:bg-base-200 transition-colors group"
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
