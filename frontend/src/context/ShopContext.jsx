import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {
    products as localProducts, getSizePrice, SIZES, isComboEligible,
    getEarnedTier, getNextTier, getMinimumForSizes, CUSTOM_SIZES,
} from '../assets/assets'
import { putFiles, deleteFiles, getFiles, pruneFiles } from '../utils/customPosterStore'

export const ShopContext = createContext();

// Everything the shopper has in progress is mirrored to localStorage, so a
// refresh (or coming back tomorrow) picks up exactly where they left off
// instead of dropping them on an empty default page.
const readStored = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw === null ? fallback : (JSON.parse(raw) ?? fallback)
    } catch {
        return fallback
    }
}

const writeStored = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode / quota — not critical */ }
}

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 49;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => readStored('cartItems', {}));
    const [products, setProducts] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [token, setToken] = useState('')
    const [wishlist, setWishlist] = useState(() => readStored('wishlist', []))
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState(() => readStored('shippingAddress', {}))
    const [couponCode, setCouponCode] = useState(() => readStored('couponCode', ''))

    // Autosave. Each of these is small, so writing on every change is cheap.
    useEffect(() => { writeStored('cartItems', cartItems) }, [cartItems])
    useEffect(() => { writeStored('shippingAddress', shippingAddress) }, [shippingAddress])
    useEffect(() => { writeStored('couponCode', couponCode) }, [couponCode])
    useEffect(() => { writeStored('wishlist', wishlist) }, [wishlist])

    // The order just placed, kept so the confirmation page survives a refresh.
    const [lastOrder, setLastOrder] = useState(() => readStored('lastOrder', null))

    const saveOrder = useCallback((order) => {
        setLastOrder(order)
        writeStored('lastOrder', order)
    }, [])

    // Combo the shopper is working towards, picked from a product page or armed
    // by the cart. Drives the progress bar; the discount itself is always the
    // best tier the basket earns.
    const [activeCombo, setActiveCombo] = useState(() => readStored('activeCombo', null))

    const startCombo = useCallback((tier) => {
        setActiveCombo(tier)
        writeStored('activeCombo', tier)
    }, [])

    const clearCombo = useCallback(() => {
        setActiveCombo(null)
        try { localStorage.removeItem('activeCombo') } catch { /* non-critical */ }
    }, [])

    // The slide-over cart. It opens itself on every add, so the shopper always
    // sees what just went in without leaving the page they are browsing.
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
    const [lastAdded, setLastAdded] = useState(null)
    const openCartDrawer = useCallback(() => setCartDrawerOpen(true), [])
    const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), [])

    // --- Uploaded artwork ----------------------------------------------------
    // An upload becomes an ordinary cart line under the id `custom:<posterId>`,
    // so the shopper can carry on adding catalogue posters and check the whole
    // lot out together. The metadata is small enough for localStorage; the files
    // themselves sit in IndexedDB as the originals.
    const [customPosters, setCustomPosters] = useState(() => readStored('customPosters', []))
    const [customPreviews, setCustomPreviews] = useState({})   // posterId -> [objectURL]

    useEffect(() => { writeStored('customPosters', customPosters) }, [customPosters])

    // Rebuild previews for whatever is on file, including after a refresh.
    useEffect(() => {
        let cancelled = false
        const urls = []

        const load = async () => {
            const next = {}
            for (const poster of customPosters) {
                try {
                    const rows = await getFiles(poster.id)
                    if (rows.length === 0) continue
                    next[poster.id] = rows.map(row => {
                        const url = URL.createObjectURL(row.blob)
                        urls.push(url)
                        return url
                    })
                } catch { /* the artwork is gone; the line still prices correctly */ }
            }
            if (!cancelled) setCustomPreviews(next)
            else urls.forEach(url => URL.revokeObjectURL(url))
        }

        load()
        return () => { cancelled = true; urls.forEach(url => URL.revokeObjectURL(url)) }
    }, [customPosters])

    // Save the artwork and hand back the cart id it now lives under.
    const addCustomPoster = useCallback(async ({ type, size, files, dimensions }) => {
        const id = `cp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
        let stored = []
        try {
            stored = await putFiles(id, files)
        } catch (error) {
            console.log(error)
            toast.error('This browser would not keep the artwork — try another browser.')
            return null
        }

        const poster = {
            id,
            type,
            size: CUSTOM_SIZES.includes(size) ? size : CUSTOM_SIZES[0],
            files: stored,
            dimensions: dimensions || null,
            createdAt: Date.now(),
        }
        setCustomPosters(prev => [poster, ...prev])
        return poster
    }, [])

    const removeCustomPoster = useCallback((posterId) => {
        setCustomPosters(prev => prev.filter(poster => poster.id !== posterId))
        deleteFiles(posterId).catch(() => { /* nothing to clean up */ })
    }, [])

    // On load, drop artwork nothing points at any more — a line that was removed
    // in an earlier session, or an order that has long since been sent.
    useEffect(() => {
        const keep = new Set()
        for (const itemId in cartItems) {
            if (itemId.startsWith('custom:')) keep.add(itemId.slice('custom:'.length))
        }
        for (const id of lastOrder?.customPosterIds || []) keep.add(id)

        setCustomPosters(prev => (
            prev.length === prev.filter(poster => keep.has(poster.id)).length
                ? prev
                : prev.filter(poster => keep.has(poster.id))
        ))
        pruneFiles([...keep]).catch(() => { /* nothing to clean up */ })
        // Once per load: the cart and the last order are both restored by then.
    }, [])

    // Each upload presents itself to the cart as a product.
    const customProducts = useMemo(() => customPosters.map(poster => ({
        _id: `custom:${poster.id}`,
        customPosterId: poster.id,
        posterType: poster.type,
        name: `${poster.type} — ${poster.files.length > 1 ? `${poster.files.length} photos` : poster.files[0]?.name || 'your artwork'}`,
        description: 'Your own artwork, printed on premium 200 GSM matte paper.',
        image: customPreviews[poster.id] || [],
        fileNames: poster.files.map(file => file.name),
        category: 'Custom',
        subCategory: 'Single',
        sizes: CUSTOM_SIZES,
        isCustom: true,
        date: poster.createdAt,
    })), [customPosters, customPreviews])

    const toggleWishlist = useCallback((itemId) => {
        setWishlist(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId])
    }, [])

    // --- Catalogue and basket, derived once per change ------------------------
    // The cart is read on nearly every render (navbar count, tiles, the basket
    // bar, the summary). Walking it and searching the catalogue each time adds
    // up, so everything derived from it is computed once and shared.

    // The catalogue plus whatever the shopper uploaded — uploads never appear in
    // listings, but the cart, the summary and checkout all have to find them.
    const productsById = useMemo(() => {
        const map = new Map()
        for (const product of products) map.set(product._id, product)
        for (const product of customProducts) map.set(product._id, product)
        return map
    }, [products, customProducts])

    const getProduct = useCallback((itemId) => productsById.get(itemId) || null, [productsById])

    const cartLines = useMemo(() => {
        const lines = []
        for (const itemId in cartItems) {
            const product = productsById.get(itemId)
            if (!product) continue
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size]
                if (quantity > 0) {
                    const { price } = getSizePrice(size, product.subCategory)
                    lines.push({ product, size, quantity, price })
                }
            }
        }
        return lines
    }, [cartItems, productsById])

    // Straight count of everything in the basket, catalogue or not — the navbar
    // badge should not wait for products to arrive.
    const cartCount = useMemo(() => {
        let total = 0
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size]
                if (quantity > 0) total += quantity
            }
        }
        return total
    }, [cartItems])

    const cartAmount = useMemo(
        () => cartLines.reduce((sum, line) => sum + line.price * line.quantity, 0),
        [cartLines]
    )

    // Combos are counted per size and never mix, so the basket is grouped by
    // size and each group earns its own tier.
    const comboBySize = useMemo(() => {
        const counts = new Map()
        for (const line of cartLines) {
            if (!isComboEligible(line.product)) continue
            counts.set(line.size, (counts.get(line.size) || 0) + line.quantity)
        }

        return SIZES.filter(size => counts.get(size)).map(size => {
            const count = counts.get(size)
            const { price } = getSizePrice(size, 'Single')
            const tier = getEarnedTier(count)
            const next = getNextTier(count)
            return {
                size,
                count,
                price,
                tier,
                discount: tier ? (tier.get - tier.buy) * price : 0,
                next,
                remaining: next ? next.get - count : 0,
                nextSaving: next ? (next.get - next.buy) * price : 0,
            }
        })
    }, [cartLines])

    // How many combo-eligible posters are in the basket, all sizes together.
    const comboQty = useMemo(
        () => comboBySize.reduce((sum, entry) => sum + entry.count, 0),
        [comboBySize]
    )

    const comboDiscount = useMemo(
        () => comboBySize.reduce((sum, entry) => sum + entry.discount, 0),
        [comboBySize]
    )

    // The size closest to its next rung — what the cart and the drawer nudge towards.
    const comboFocus = useMemo(() => {
        const open = comboBySize.filter(entry => entry.next)
        if (open.length === 0) return null
        return open.reduce((best, entry) => (entry.remaining < best.remaining ? entry : best))
    }, [comboBySize])

    // The minimum this basket has to clear, taken from the friendliest size in it.
    const cartMinimum = useMemo(
        () => getMinimumForSizes([...new Set(cartLines.map(line => line.size))]),
        [cartLines]
    )

    // Kept as functions because every page calls them that way.
    const getCartCount = useCallback(() => cartCount, [cartCount])
    const getCartAmount = useCallback(() => cartAmount, [cartAmount])
    const getComboQty = useCallback(() => comboQty, [comboQty])
    const getComboDiscount = useCallback(() => comboDiscount, [comboDiscount])

    const addToCart = useCallback(async (itemId, size, qty = 1) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        setCartItems(prev => {
            const cartData = structuredClone(prev)
            cartData[itemId] = cartData[itemId] || {}
            cartData[itemId][size] = (cartData[itemId][size] || 0) + qty
            return cartData
        })

        setLastAdded({ itemId, size, at: Date.now() })
        setCartDrawerOpen(true)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }, [token, backendUrl])

    const changeQuantity = useCallback(async (itemId, size, delta) => {

        let next = 0
        setCartItems(prev => {
            const cartData = structuredClone(prev)
            const current = cartData[itemId]?.[size] || 0
            next = Math.max(0, current + delta)
            cartData[itemId] = cartData[itemId] || {}
            cartData[itemId][size] = next
            return cartData
        })

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity: next }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }, [token, backendUrl])

    const updateQuantity = useCallback(async (itemId, size, quantity) => {

        // Emptying an uploaded poster's line throws the artwork away too.
        if (quantity <= 0 && itemId.startsWith('custom:')) {
            removeCustomPoster(itemId.slice('custom:'.length))
        }

        setCartItems(prev => {
            const cartData = structuredClone(prev)
            cartData[itemId] = cartData[itemId] || {}
            cartData[itemId][size] = quantity
            return cartData
        })

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }, [token, backendUrl, removeCustomPoster])

    useEffect(() => {
        let cancelled = false

        const getProductsData = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/product/list')
                if (cancelled) return
                setProducts(response.data.success ? response.data.products.reverse() : localProducts)
            } catch (error) {
                // Backend isn't reachable yet — fall back to the local catalogue
                // so the storefront still works.
                if (cancelled) return
                console.log(error)
                setProducts(localProducts)
            } finally {
                if (!cancelled) setProductsLoaded(true)
            }
        }

        getProductsData()
        return () => { cancelled = true }
    }, [backendUrl])

    useEffect(() => {
        const getUserCart = async (activeToken) => {
            try {
                const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: activeToken } })
                if (response.data.success) setCartItems(response.data.cartData)
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

        if (!token && localStorage.getItem('token')) {
            const stored = localStorage.getItem('token')
            setToken(stored)
            getUserCart(stored)
        } else if (token) {
            getUserCart(token)
        }
    }, [token, backendUrl])

    // A stable value object: consumers only re-render when something they use
    // actually changed, not on every keystroke in the search box.
    const value = useMemo(() => ({
        products, productsById, getProduct, productsLoaded, currency, delivery_fee,
        customPosters, customProducts, addCustomPoster, removeCustomPoster,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems, updateQuantity, changeQuantity,
        getCartCount, getCartAmount,
        getComboDiscount, getComboQty,
        comboBySize, comboFocus, cartMinimum,
        cartDrawerOpen, openCartDrawer, closeCartDrawer, lastAdded,
        activeCombo, startCombo, clearCombo, navigate, backendUrl,
        setToken, token,
        wishlist, toggleWishlist,
        shippingAddress, setShippingAddress,
        couponCode, setCouponCode,
        lastOrder, saveOrder,
    }), [
        products, productsById, getProduct, productsLoaded, search, showSearch, cartItems,
        customPosters, customProducts, addCustomPoster, removeCustomPoster,
        addToCart, updateQuantity, changeQuantity, getCartCount, getCartAmount, getComboDiscount,
        getComboQty, comboBySize, comboFocus, cartMinimum,
        cartDrawerOpen, openCartDrawer, closeCartDrawer, lastAdded,
        activeCombo, startCombo, clearCombo, navigate, backendUrl, token,
        wishlist, toggleWishlist, shippingAddress, couponCode, lastOrder, saveOrder,
    ])

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
