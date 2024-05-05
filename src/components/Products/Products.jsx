import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Products() {

  let [products,setProducts] = useState([]);

  async function getProducts(){
    let {data} = await axios.get("");
    setProducts(data.products);
  }

  useEffect(()=> {
    getProducts();
  },[])

  return (
    <div className="row">
    <div className='my-4'>
      {products.map((product)=>{
        return (
          <div className='col-md-4'>
            <Link to={`/product/${product.slug}`} state={{id:product.id}}>
            <img src={product.mainImage.secure_url} className='w-100' alt={product.name} />
            <h2>{product.name}</h2>
            </Link>
          </div>
        ) 
      })}
    </div>
    </div>
  )
}
