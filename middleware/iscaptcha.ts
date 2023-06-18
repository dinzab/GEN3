export default defineNuxtRouteMiddleware(async (to,from) => {
    const captcha = await $fetch("/api/checkcaptcha")
    if(captcha) {
        return useRouter().push({name: 'signin'})
    } 
    
})