import path from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { createContentLoader, type SiteConfig } from 'vitepress'

export async function copyFrontmatterImages(config: SiteConfig) {
  const posts = await createContentLoader('posts/**/*.md', {
    excerpt: false,
    render: false
  }).load()

  for (const { url, frontmatter } of posts) {
    const image = frontmatter?.image
    if (!image) continue

    // Skip absolute paths and URLs
    if (image.startsWith('/') || image.startsWith('http')) continue

    // Resolve relative path
    // url is like /posts/2025/image-optimization.html
    const dir = url.replace(/[^/]+$/, '') // /posts/2025/
    const imagePath = image.startsWith('./') ? image.slice(2) : image

    // Source file path (relative to project root)
    const srcPath = path.join(config.srcDir, dir.slice(1), imagePath)

    // Destination path in dist
    const destPath = path.join(config.outDir, dir.slice(1), imagePath)

    if (existsSync(srcPath)) {
      // Ensure destination directory exists
      const destDir = path.dirname(destPath)
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true })
      }

      copyFileSync(srcPath, destPath)
      console.log(`Copied: ${srcPath} -> ${destPath}`)
    } else {
      console.warn(`Image not found: ${srcPath}`)
    }
  }
}
