import request from 'superagent';

const hostname = '127.0.0.1';

export async function fetchCategories() {
    try {
        const res = await request.get(`http://${hostname}:${process.env.API_PORT}/categories?page=1&pageSize=20&filter=name%3Ane%3Adefault&fields=displayName,dataDimensionType,sharing%5Bpublic%5D,lastUpdated,id,access,displayName`);
        return res.body

    } catch (err) {
        console.error(err);
        throw new Error(`Error from response: ${err?.body ?? err.message}`);
    }
}
