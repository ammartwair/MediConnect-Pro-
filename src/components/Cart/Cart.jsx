import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../Context/CartStore'
import { Helmet } from 'react-helmet';

export default function Cart() {

  const { getCart } = useContext(CartContext);
  const { products, setProducts } = useState([]);
  const { cart, setCart } = useState([]);

  async function getCartFunction() {
    const res = await getCart();
    if (res.message == 'success') {
      setProducts(res.cart.cartItems);
      setCart(res.cart);
    }
  }

  useEffect(() => {
    getCartFunction();
  }, [])
  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>A - Shop | Cart</title>
        <meta name='description' content='This is Cart page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <table>
        <th>
          <td>Name</td>
          <td>Price</td>
          <td>Discount</td>
          <td>Quantity</td>
          <td>Final Price</td>
        </th>

        {products.map((product) => {
          return (
            <tr className='col-md-4'>
              <td>{product.productId.name}</td>
              <td>{product.productId.price}</td>
              <td>{product.productId.discount}</td>
              <td>{product.quantity}</td>
              <td>{product.productId.price * product.productId.discount * product.quantity / 100}</td>
            </tr>
          )
        })}
        <tr>
          <td>Total Price</td>
          <td>{cart.totalPrice}</td>
        </tr>
      </table>
    </>
  )
}
