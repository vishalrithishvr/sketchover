import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { products as localProducts, getSizePrice, COMBO_TIERS } from '../assets/assets'

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

    const toggleWishlist = useCallback((itemId) => {
        setWishlist(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId])
    }, [])

    // --- Catalogue and basket, derived once per change ------------------------
    // The cart is read on nearly every render (navbar count, tiles, the basket
    // bar, the summary). Walking it and searching the catalogue each time adds
    // up, so everything derived from it is computed once and shared.

    const productsById = useMemo(() => {
        const map = new Map()
        for (const product of products) map.set(product._id, product)
        return map
    }, [products])

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

    // Prices of every individual Single poster unit in the basket, cheapest first.
    const comboUnitPrices = useMemo(() => {
        const unitPrices = []
        for (const line of cartLines) {
            if (line.product.subCategory !== 'Single') continue
            for (let i = 0; i < line.quantity; i++) unitPrices.push(line.price)
        }
        return unitPrices.sort((a, b) => a - b)
    }, [cartLines])

    const comboQty = comboUnitPrices.length

    // Best combo tier the basket currently qualifies for, and the next rung up.
    const activeComboTier = useMemo(
        () => [...COMBO_TIERS].reverse().find(tier => comboQty >= tier.get) || null,
        [comboQty]
    )

    const nextComboTier = useMemo(
        () => COMBO_TIERS.find(tier => comboQty < tier.get) || null,
        [comboQty]
    )

    // The qualifying tier's free posters come off the cheapest units.
    const comboDiscount = useMemo(() => {
        if (!activeComboTier) return 0
        return comboUnitPrices
            .slice(0, activeComboTier.get - activeComboTier.buy)
            .reduce((sum, price) => sum + price, 0)
    }, [comboUnitPrices, activeComboTier])

    // What the next rung would take off the bill, used as the carrot in the cart.
    // Posters still to be added are costed at the cheapest one already in the basket.
    const nextComboSaving = useMemo(() => {
        if (!nextComboTier) return 0
        const cheapest = comboUnitPrices[0] || 0
        const padded = [
            ...comboUnitPrices,
            ...Array(Math.max(0, nextComboTier.get - comboUnitPrices.length)).fill(cheapest),
        ].sort((a, b) => a - b)
        return padded.slice(0, nextComboTier.get - nextComboTier.buy).reduce((sum, price) => sum + price, 0)
    }, [comboUnitPrices, nextComboTier])

    // Kept as functions because every page calls them that way.
    const getCartCount = useCallback(() => cartCount, [cartCount])
    const getCartAmount = useCallback(() => cartAmount, [cartAmount])
    const getComboQty = useCallback(() => comboQty, [comboQty])
    const getActiveComboTier = useCallback(() => activeComboTier, [activeComboTier])
    const getNextComboTier = useCallback(() => nextComboTier, [nextComboTier])
    const getComboDiscount = useCallback(() => comboDiscount, [comboDiscount])
    const getNextComboSaving = useCallback(() => nextComboSaving, [nextComboSaving])

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

    }, [token, backendUrl])

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
        products, productsById, productsLoaded, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems, updateQuantity, changeQuantity,
        getCartCount, getCartAmount,
        getComboDiscount, getActiveComboTier, getNextComboTier, getNextComboSaving, getComboQty,
        activeCombo, startCombo, clearCombo, navigate, backendUrl,
        setToken, token,
        wishlist, toggleWishlist,
        shippingAddress, setShippingAddress,
        couponCode, setCouponCode,
        lastOrder, saveOrder,
    }), [
        products, productsById, productsLoaded, search, showSearch, cartItems,
        addToCart, updateQuantity, changeQuantity, getCartCount, getCartAmount, getComboDiscount,
        getActiveComboTier, getNextComboTier, getNextComboSaving, getComboQty,
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
