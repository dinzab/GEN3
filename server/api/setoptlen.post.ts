export default defineEventHandler(async event => {
    const body = await readBody(event)

    setCookie(event,"otpLEN",JSON.stringify({
        otpLEN: body.otpLEN
    }), {
        maxAge: 60*60*24*20
    })

    return true
})