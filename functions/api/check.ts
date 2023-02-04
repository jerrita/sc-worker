interface Env {
    SCACHE: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    let data = {};

    try {
        const req = await context.request.json();
        const value = await context.env.SCACHE.get(req['hash'])

        if (value == null) {
            data = {
                'code': 0,
                'msg': 'available'
            }
        } else {
            data = {
                'code': 1,
                'msg': 'occupied'
            }
        }
    } catch (err) {
        console.log(err)
        data = {
            'code': -1,
            'msg': err.message
            
        }
    }


    const json = JSON.stringify(data, null, 2)
    return new Response(json, {
        'headers': {
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}