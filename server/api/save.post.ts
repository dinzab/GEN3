export default defineEventHandler(async (event) => {
    const data = await readBody(event)

    await setCookie(event, "session",data.id, {
        maxAge: 60 * 60 * 24 * 20
    })
    return true
})