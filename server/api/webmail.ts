export default defineEventHandler(async event => {
    let res = false
    let data = {}
    if(getCookie(event,"isLogged")) {
        const x  = await JSON.parse(getCookie(event,"isLogged"))
        if(x.isEmail) {
            data = {
                isEmail: true,
                Email: x.login
            }
        } else {
            data = {
                isEmail: false
            }
        }
        res = true
    } else {
        res = false
    }
    return {
        res: res,
        data: data
    }
})