// Running the API on a machine. On Netlify the same app is served by
// netlify/functions/api.js instead.
import 'dotenv/config'
import { createApp } from './app.js'
import { storageKind } from './lib/db.js'

const port = process.env.PORT || 4000
const app = createApp()

app.listen(port, () => {
    console.log(`[server] listening on ${port}`)
    console.log(`[server] storage: ${storageKind()}`)
})

export default app
