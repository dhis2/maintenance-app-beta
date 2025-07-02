import request from 'superagent';

const hostname = '127.0.0.1';

export async function fetchCategories() {
    try {
        const res = await request.get(`http://${hostname}:${process.env.API_PORT}/categories`);
        return res.body

    } catch (err) {
        console.error(err);
        throw new Error(`Error from response: ${err?.body ?? err.message}`);
    }
}
