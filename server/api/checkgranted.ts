export default defineEventHandler(async event => {
    let res = false
    if(getCookie(event, "granted") == "Granted by dinzab") {
        res = true
    }

    return res
})