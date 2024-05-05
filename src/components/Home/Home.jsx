import React from 'react'
import Category from '../Category/Category'
import { Helmet } from 'react-helmet'

export default function Home() {

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>A - Shop | Home Page</title>
        <meta name='description' content='This is home page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Category />
    </>
  )
}
