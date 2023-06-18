export default defineEventHandler(async event => {

    const body = await readBody(event)

    setCookie(event , 'hashed', `${body.tel}`, {
        maxAge: 60 * 60 * 24 * 20
    })

    return true
})