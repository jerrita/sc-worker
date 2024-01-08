const site_prefix = "https://sc.ka5umi.eu.org/#/"

interface Env {
    SCACHE: KVNamespace;
}

const kvLoad = async (storage: KVNamespace, key: string) => {
    return await storage.get(key)
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const req = context.request;
    const hash = req.url.split('/').pop();

    try {
        const data = JSON.parse(await kvLoad(context.env.SCACHE, hash));
        if (data.type == 'redir')
            return Response.redirect(data.value, 302);
        else
            return Response.redirect(site_prefix + hash, 302)
    } catch (e) {
        return Response.redirect(site_prefix, 302);
    }
}
