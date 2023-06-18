export default defineNuxtRouteMiddleware(async(to,from) => {
    const app = useNuxtApp()
   const res = await $fetch('/api/checklogin')
   const r = await $fetch('/api/isdone')
   if(!res) {
        return navigateTo({name: 'signin'})
   }
   if(r) {
     return navigateTo({name: 'myaccount-success'})
   }
})