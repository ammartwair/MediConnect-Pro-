import React from 'react'
import { Helmet } from 'react-helmet'

export default function About() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | About Page</title>
        <meta name='description' content='This is About page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>
        <h2 className='my-4'>About Page</h2>
      </div>
    </>
  )
}
