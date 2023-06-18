export default defineEventHandler(event => {
    let res = false
    if(getCookie(event , 'done')) {
        res = true
    }

    return res
})