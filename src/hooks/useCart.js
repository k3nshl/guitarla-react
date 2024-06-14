import { useState, useEffect, useMemo} from "react"
import { db } from "../data/db"

export const useCart = () => {

    /**
   * Revisa si hay algo en el localStorage del carrito y lo retorna como un array parseado
   * y si no retorna el array vacío
   * @returns {Array} - Retorna el carrito inicial si existe en el localStorage
   */
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    /**
     * El useEffect se ejecuta cada vez que cambia el carrito y react lo hace de manera
     * automatica ya que esta sincronizado con el estado del cart
     */
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {

        const itemExists = cart.findIndex(guitar => guitar.id === item.id)

        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    function removeFromCart(id) {
        setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {

        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item, //mantener el resto de propiedades
                    quantity: item.quantity + 1 //aumentar la cantidad
                }
            }
            return item //mantener el resto de items sin cambios
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id) {

        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([]) //setear el carrito vacío
    }

// State Derivado
const isEmpty = useMemo(() => cart.length === 0, [cart])
const carTotal = useMemo(() => cart.reduce(
    (total, item) => total + (item.quantity * item.price), 0), [cart])



    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        carTotal
    }

}
