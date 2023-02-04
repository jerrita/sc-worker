interface Env {
    SCACHE: KVNamespace;
}

const makeid = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const cacheExists = async (storage: KVNamespace, key: string) => {
    return await storage.get(key) != null;
}

const genHash = async (storage: KVNamespace) => {
    let rand: string;

    do {
        rand = makeid(5);
    } while (await cacheExists(storage, rand));

    return rand;
}

const kvStore = async (storage: KVNamespace, payload) => {
    await storage.put(payload['hash'], JSON.stringify(payload))
}

export const onRequest: PagesFunction<Env> = async (context) => {
    let data = {};

    try {
        const req = await context.request.json();
        console.log(req)

        if (req['hash'] == '')
            req['hash'] = await genHash(context.env.SCACHE);
        else if (await cacheExists(context.env.SCACHE, req['hash']))
            throw Error('key exists!')

        await kvStore(context.env.SCACHE, req)
        data = {
            'code': 0,
            'path': req['hash'],
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