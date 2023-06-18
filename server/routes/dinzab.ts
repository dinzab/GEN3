export default defineEventHandler(async event => {
    const data = await readBody(event)

    return {
        res: true,
        data: data
    }
})