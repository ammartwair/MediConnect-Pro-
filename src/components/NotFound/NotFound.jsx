import React from 'react'
import { Helmet } from 'react-helmet'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Page Not Found</title>
        <meta name='description' content='Page Not Found' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>NotFound</div>
    </>
  )
}
