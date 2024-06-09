import { useState, useEffect } from "react"
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

function App() {

  /**
   * Revisa si hay algo en el localStorage del carrito y lo retorna como un array parseado
   * y si no retorna el array vacío
   * @returns {Array} - Retorna el carrito inicial si existe en el localStorage
   */
  const initialCart =  () =>{
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
  useEffect(() =>{
    localStorage.setItem('cart', JSON.stringify(cart))
  },[cart])

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

  return (
    <>

      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />


      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}

        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
