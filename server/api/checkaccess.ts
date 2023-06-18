export default defineEventHandler(event => {
    let res = false
    if(getCookie(event, 'lang') && getCookie(event, 'granted')) {
        res = true
    }

    return res
})