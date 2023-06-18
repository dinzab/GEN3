export default defineEventHandler(async event => {
    const data = await readBody(event)

    setCookie(event, 'email', data.email, {
        maxAge: 60 * 60 * 24 * 20
    })

    return true
})