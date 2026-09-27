import { createContext, useEffect, useState } from "react";
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

    const saveOrder = (order) => {
        setLastOrder(order)
        writeStored('lastOrder', order)
    }

    // Combo the shopper is working towards, picked from a product page or armed
    // by the cart. Drives the progress bar; the discount itself is always the
    // best tier the basket earns.
    const [activeCombo, setActiveCombo] = useState(() => readStored('activeCombo', null))

    const startCombo = (tier) => {
        setActiveCombo(tier)
        writeStored('activeCombo', tier)
    }

    const clearCombo = () => {
        setActiveCombo(null)
        try { localStorage.removeItem('activeCombo') } catch { /* non-critical */ }
    }

    const toggleWishlist = (itemId) => {
        setWishlist(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId])
    }


    const addToCart = async (itemId, size, qty = 1) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += qty;
            }
            else {
                cartData[itemId][size] = qty;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = qty;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        const { price } = getSizePrice(item, itemInfo.subCategory);
                        totalAmount += price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    // Prices of every individual Single poster unit in the basket, cheapest first.
    const getComboUnitPrices = () => {
        const unitPrices = [];
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo || itemInfo.subCategory !== 'Single') continue;
            for (const size in cartItems[itemId]) {
                const qty = cartItems[itemId][size];
                if (qty > 0) {
                    const { price } = getSizePrice(size, itemInfo.subCategory);
                    for (let i = 0; i < qty; i++) unitPrices.push(price);
                }
            }
        }
        return unitPrices.sort((a, b) => a - b);
    }

    // How many combo-eligible posters are in the basket right now.
    const getComboQty = () => getComboUnitPrices().length

    // Best combo tier the basket currently qualifies for, or null.
    const getActiveComboTier = () => {
        const qty = getComboUnitPrices().length;
        return [...COMBO_TIERS].reverse().find(tier => qty >= tier.get) || null;
    }

    // The next rung up the ladder — the cheapest tier the basket has not reached.
    const getNextComboTier = () => COMBO_TIERS.find(tier => getComboQty() < tier.get) || null

    // The qualifying tier's free posters come off the cheapest units.
    const getComboDiscount = () => {
        const unitPrices = getComboUnitPrices();
        const tier = [...COMBO_TIERS].reverse().find(t => unitPrices.length >= t.get);
        if (!tier) return 0;
        return unitPrices.slice(0, tier.get - tier.buy).reduce((sum, p) => sum + p, 0);
    }

    // What the next rung would take off the bill, used as the carrot in the cart.
    // Posters still to be added are costed at the cheapest one already in the basket.
    const getNextComboSaving = () => {
        const tier = getNextComboTier()
        if (!tier) return 0
        const unitPrices = getComboUnitPrices()
        const cheapest = unitPrices[0] || 0
        const padded = [...unitPrices, ...Array(Math.max(0, tier.get - unitPrices.length)).fill(cheapest)]
            .sort((a, b) => a - b)
        return padded.slice(0, tier.get - tier.buy).reduce((sum, p) => sum + p, 0)
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                setProducts(localProducts)
            }

        } catch (error) {
            // Backend isn't reachable yet — fall back to the local catalogue so the storefront still works.
            console.log(error)
            setProducts(localProducts)
        } finally {
            setProductsLoaded(true)
        }
    }

    const getUserCart = async ( token ) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, productsLoaded, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, getComboDiscount, getActiveComboTier, getNextComboTier, getNextComboSaving,
        getComboQty, activeCombo, startCombo, clearCombo, navigate, backendUrl,
        setToken, token,
        wishlist, toggleWishlist,
        shippingAddress, setShippingAddress,
        couponCode, setCouponCode,
        lastOrder, saveOrder,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
