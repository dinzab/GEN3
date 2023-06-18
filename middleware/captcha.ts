export default defineNuxtRouteMiddleware(async (to,from) => {
    if(to.name == 'myaccount-success') {
        const res = await $fetch("/api/isdone")

    
        if(!res) {
            return navigateTo({name: 'signin'})
        } else {
            const captcha = await $fetch("/api/checkcaptcha")
            if(!captcha) {
                return navigateTo({name: 'captcha', query: {return_url: from.name}})
            }
        }
    } else {
        const captcha = await $fetch("/api/checkcaptcha")
        if(!captcha) {
            return navigateTo({name: 'captcha', query: {return_url: from.name}})
        }
    }
})