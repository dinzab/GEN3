export default defineNuxtRouteMiddleware(async(to,from) => {
    const checkagain = await $fetch('/api/getlang')
    useNuxtApp().$i18n.setLocale(checkagain.data.lang)
    
})