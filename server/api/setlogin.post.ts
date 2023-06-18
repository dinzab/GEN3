export default defineEventHandler(async event => {
    let isEmail = false
    const data = await readBody(event)
    if(data.email.includes("@")) {
        isEmail = true

    }
    setCookie(event,"isLogged",JSON.stringify({
        isEmail: isEmail,
        login: data.email,
        isLogged: true
    }), {
        maxAge: 60*60*24*20
    })

    return true
})