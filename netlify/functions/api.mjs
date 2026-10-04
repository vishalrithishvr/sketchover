// The whole API as one Netlify Function (v2), on the admin panel's own domain:
// no CORS, no mixed content, nothing on a laptop that has to stay running.
//
// v2 matters here. Data lives in Netlify Blobs, and only v2 functions get
// strongly consistent reads. With eventual consistency a write can take up to a
// minute to be seen, so two orders placed close together could each read the
// old order list and one would overwrite the other.
//
// Express speaks Node's req/res, a v2 function speaks fetch Request/Response.
// Rather than translate between them, the app listens on a loopback port inside
// the function (once, while the instance stays warm) and each request is passed
// straight through to it.
import http from 'node:http'
import { createApp } from '../../backend/app.js'

let origin = null

const ready = new Promise((resolve, reject) => {
    const server = http.createServer(createApp())
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
        origin = `http://127.0.0.1:${server.address().port}`
        resolve()
    })
})

// Headers that describe the hop rather than the request.
const HOP_BY_HOP = new Set(['host', 'connection', 'keep-alive', 'transfer-encoding', 'content-length', 'upgrade'])

export default async (request) => {
    await ready

    const url = new URL(request.url)
    const headers = new Headers()
    for (const [key, value] of request.headers) {
        if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
    }

    const hasBody = !['GET', 'HEAD'].includes(request.method)
    const response = await fetch(`${origin}${url.pathname}${url.search}`, {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        redirect: 'manual',
    })

    const out = new Headers(response.headers)
    for (const key of HOP_BY_HOP) out.delete(key)

    return new Response(response.body, { status: response.status, headers: out })
}

// Routed by path, so no redirect rules are needed for the API.
export const config = {
    path: ['/api', '/api/*', '/health'],
}
