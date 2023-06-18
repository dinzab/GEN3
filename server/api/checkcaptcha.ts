export default defineEventHandler(event => {
    let res = false
    if(getCookie(event ,"captcha")) {
        res = true
    }

    return res
})