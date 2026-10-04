// The whole API as one Netlify Function, so the admin panel and its backend sit
// on the same domain: no CORS, no mixed content, nothing to keep running on a
// laptop. Data lives in Netlify Blobs, which the site already has.
import serverless from 'serverless-http'
import { connectLambda } from '@netlify/blobs'
import { createApp } from '../../backend/app.js'

const app = createApp()

const run = serverless(app, {
    // Media comes back as bytes, so the wrapper must not try to read it as text.
    binary: ['image/*', 'video/*', 'audio/*', 'application/octet-stream'],
})

export const handler = async (event, context) => {
    // Lambda-style functions have to hand Blobs its credentials from the
    // incoming event; without this every read fails with "not configured".
    connectLambda(event)
    return run(event, context)
}
