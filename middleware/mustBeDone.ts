export default defineNuxtRouteMiddleware((to,from) => {
    const res = $fetch("/api/isdone")

    
    if(!res) {
        return navigateTo({name: 'signin'})
    }
})