<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    titleSegments?: string[]
    href?: string
    deck?: string
    heading?: 'h1' | 'h2'
  }>(),
  { heading: 'h2' }
)
</script>

<template>
  <section class="lead">
    <div v-if="kicker" class="lead-kicker">{{ kicker }}</div>
    <component :is="heading" class="lead-title">
      <a v-if="href" :href="href">
        <template v-if="titleSegments && titleSegments.length">
          <span v-for="(seg, i) in titleSegments" :key="i" class="whitespace-nowrap">{{ seg }}</span>
        </template>
        <template v-else>{{ title }}</template>
      </a>
      <template v-else>
        <template v-if="titleSegments && titleSegments.length">
          <span v-for="(seg, i) in titleSegments" :key="i" class="whitespace-nowrap">{{ seg }}</span>
        </template>
        <template v-else>{{ title }}</template>
      </template>
    </component>
    <p v-if="deck" class="lead-deck">{{ deck }}</p>
    <div class="lead-meta">
      <slot name="meta" />
    </div>
  </section>
</template>
