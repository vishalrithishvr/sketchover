import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { products as localProducts, getSizePrice } from '../assets/assets'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 49;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || []
        } catch {
            return []
        }
    })
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({})
    const [couponCode, setCouponCode] = useState('')

    const toggleWishlist = (itemId) => {
        setWishlist(prev => {
            const next = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
            localStorage.setItem('wishlist', JSON.stringify(next))
            return next
        })
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

    // "Buy 4 Get 4 Free" — applies to Single posters only, repeats every 8 units,
    // and discounts the cheapest eligible units first (standard combo-promo behaviour).
    const getComboDiscount = () => {
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
        if (unitPrices.length < 8) return 0;
        unitPrices.sort((a, b) => a - b);
        const freeCount = Math.floor(unitPrices.length / 8) * 4;
        return unitPrices.slice(0, freeCount).reduce((sum, p) => sum + p, 0);
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
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, getComboDiscount, navigate, backendUrl,
        setToken, token,
        wishlist, toggleWishlist,
        shippingAddress, setShippingAddress,
        couponCode, setCouponCode
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;