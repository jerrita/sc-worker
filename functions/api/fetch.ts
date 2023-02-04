interface Env {
    SCACHE: KVNamespace;
}

const kvLoad = async (storage: KVNamespace, key: string) => {
    return await storage.get(key)
}

export const onRequest: PagesFunction<Env> = async (context) => {
    let data = {};

    try {
        const req = await context.request.json();
        console.log(req)

        if (req['hash'] == '')
            throw Error('Hash cannot be empty')

        const resp = await kvLoad(context.env.SCACHE, req['hash'])
        if (resp == null)
            throw Error('Query not exists.')

        data = {
            'code': 0,
            'payload': JSON.parse(resp),
            'msg': 'success'
        }
    } catch (e) {
        console.log(e)
        data = {
            'code': -1,
            'msg': e.message
        }
    }


    const json = JSON.stringify(data, null, 2)
    return new Response(json, {
        'headers': {
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}