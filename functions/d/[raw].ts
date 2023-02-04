interface Env {
    SCACHE: KVNamespace;
}


const kvLoad = async (storage: KVNamespace, key: string) => {
    return await storage.get(key)
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const req = context.request
    const hash = req.url.split('/').pop();

    let data: string
    try {
        data = await kvLoad(context.env.SCACHE, hash)
        data = JSON.parse(data).value
    } catch(e) {
        data = ''
    }

    return new Response(data)
}