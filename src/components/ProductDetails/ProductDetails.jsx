import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CartContext } from '../Context/CartStore';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';


export default function ProductDetails() {
  let [product, setProduct] = useState({});
  let [images, setImages] = useState([]);
  const location = useLocation();
  let id = location.id;

  async function getProduct() {
    try {
      let { data } = await axios.get(`https://king-prawn-app-3mgea.ondigitalocean.app/product/${id}`);
      setProduct(data.product);
      setImages(data.sub_Images);
    } catch (e) {
      console.log(e);
    }
  }

  const { addToCart } = useContext(CartContext);
  async function addToCartFunc(productId) {
    const res = await addToCart(productId);
    if (res.message == 'success') {
      toast.success("Product added successfully")
    }
  }

  useEffect(() => {
    getProduct();
  }, [])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>A - Shop | Product Details</title>
        <meta name='description' content='This is Product Details page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>{product.name}</div>
      <img src={product.mainImage.secure_url} alt={product.name} className='w-100' />
      <div className="container my-4">
        <div className="row">
          {images.map((img) => {
            return (
              <>
                <div className="col-md-4">
                  <div className="product">
                    <img src={img.secure_url} alt="" />
                  </div>
                </div>
                <button className='btn btn-success' onClick={() => addToCartFunc(product._id)}>Add to cart</button>
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}
