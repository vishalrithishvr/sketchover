import jwt from 'jsonwebtoken'

// Admin routes carry the token from /api/user/admin in a `token` header.
const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded?.role !== 'admin' || decoded?.user !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        next()
    } catch (error) {
        // An expired session should say so, rather than looking like a bug.
        const message = error.name === 'TokenExpiredError'
            ? 'Your session has expired — sign in again.'
            : "Not Authorized Login Again"
        res.json({ success: false, message })
    }
}

export default adminAuth
