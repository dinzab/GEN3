export default defineEventHandler(event => {
    let hashed = "•4••6•••4"
    if(getCookie(event, 'hashed')) {
        hashed = getCookie(event, "hashed") || ""
    }

    return hashed
})