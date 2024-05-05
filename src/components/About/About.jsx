import React from 'react'
import { Helmet } from 'react-helmet'

export default function About() {
  return (
    <>
    <Helmet>
    <meta charSet="utf-8" />
    <title>A - Shop | About Page</title>
    <meta name='description' content='This is About page' />
    <link rel="canonical" href="http://mysite.com/example" />
  </Helmet>
    <div>About</div>
    </>
  )
}
