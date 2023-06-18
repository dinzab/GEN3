export default defineEventHandler(event => {
    let res = false
    let tel = ""
    if(getCookie(event,"isCC")) {
        res = true
        tel = JSON.parse(getCookie(event,"isCC")).tel
    }

    return {
        'res':res,
        'tel':`${tel}`
    }
})