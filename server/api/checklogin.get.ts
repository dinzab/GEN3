export default defineEventHandler(async event => {
    let res = false
    if(getCookie(event,"isLogged")) {
        res = true

    }
    

    return res
})