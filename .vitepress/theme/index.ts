import './style.css'
import Layout from './Layout.vue'
import ProductLink from './ProductLink.vue'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('ProductLink', ProductLink)
  }
}
