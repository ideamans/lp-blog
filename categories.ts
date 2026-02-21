export interface Category {
  basename: string
  name: string
}

const categories: Category[] = [
  {
    basename: 'sitespeed',
    name: 'サイトスピード改善'
  },

  {
    basename: 'image-fitness',
    name: '画像最適化'
  },

  {
    basename: 'ai-utilization',
    name: 'AI活用'
  }
]

export { categories }
