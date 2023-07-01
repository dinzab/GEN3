import { json } from "stream/consumers"

export default defineEventHandler(async event => {
    let res = false
    let data = {}
    if(getCookie(event, 'otpLEN')) {
        const cookie = await JSON.parse(getCookie(event, 'otpLEN'))
        data = {
            otpLEN: cookie.otpLEN
        }
        res = true
    }

    return {res,data}
})