export default defineNuxtRouteMiddleware(async(to,from) => {
    const app = useNuxtApp()
   const res = await $fetch('/api/checklogin')
   if(res) {
        return navigateTo({name: 'myaccount-disabled'})
   }
})