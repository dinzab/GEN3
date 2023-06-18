
export default defineEventHandler(event => {
    
    setCookie(event, "captcha","true", {
        maxAge:60*20
    })
    return true
})