<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from './posts.data.js'
import { categories } from '../../categories'
import Dayjs from 'dayjs'

const { frontmatter } = useData()

const categoryNameByBasename = new Map(categories.map((c) => [c.basename, c.name]))

const lead = computed(() => posts[0])
const recent = computed(() => posts.slice(1, 21))

function fmtIdxDate(s: string) {
  if (!s) return ''
  return Dayjs(s).format('YYYY-MM-DD')
}

function fmtLeadDate(s: string) {
  if (!s) return ''
  return Dayjs(s).format('YYYY · MMM DD').toUpperCase()
}

function categoryLabel(p: { categories?: string[] }) {
  const first = p.categories?.[0]
  if (!first) return ''
  return categoryNameByBasename.get(first) || first
}

function leadDeck(p: { description?: string; excerpt?: string }) {
  if (!p) return ''
  if (p.description) return p.description
  // strip HTML tags from excerpt
  return (p.excerpt || '').replace(/<[^>]*>/g, '').trim().slice(0, 220)
}

function rowExcerpt(p: { description?: string; excerpt?: string }) {
  const text = (p.description || (p.excerpt || '').replace(/<[^>]*>/g, '')).trim()
  return text.length > 100 ? text.slice(0, 100) + '…' : text
}
</script>

<template>
  <section v-if="lead" class="lead">
    <div class="lead-kicker">— Featured · Today's Lead —</div>
    <h2><a :href="lead.url">{{ lead.title }}</a></h2>
    <p class="lead-deck">{{ leadDeck(lead) }}</p>
    <div class="lead-meta">
      <span style="color: var(--ink-soft)">FILED</span>&nbsp;<b>{{ fmtLeadDate(lead.date) }}</b>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <span style="color: var(--ink-soft)">SECTION</span>&nbsp;<b>{{ categoryLabel(lead) || 'Editorial' }}</b>
    </div>
  </section>

  <section class="index-wrap">
    <div class="index-head">
      <h3>{{ frontmatter.subtext || '最新の記事' }} ──── Recent Entries</h3>
      <span class="smc">Showing {{ recent.length }} of {{ posts.length }}</span>
    </div>

    <a v-for="p in recent" :key="p.url" class="idx-row idx-link" :href="p.url">
      <div class="idx-date">{{ fmtIdxDate(p.date) }}</div>
      <div>
        <h3 class="idx-title">{{ p.title }}</h3>
        <p class="idx-excerpt">{{ rowExcerpt(p) }}</p>
      </div>
      <div class="idx-cat">— {{ categoryLabel(p) || 'Editorial' }}</div>
    </a>
  </section>
</template>
