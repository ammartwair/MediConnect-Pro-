import React from 'react'
import { Helmet } from 'react-helmet'
import CoverPhoto from './CoverPhoto.jsx'
import style from './Home.css'

export default function Home() {

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Home Page</title>
        <meta name='description' content='This is home page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <CoverPhoto /><br /><br />
      <h3>Welcome to MediConnect Pro</h3>

    </>
  )
}
