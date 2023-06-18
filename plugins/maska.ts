import { vMaska } from "maska"
import VueTheMask from 'vue-the-mask'
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive("maska",vMaska)
    nuxtApp.vueApp.use(VueTheMask)
})