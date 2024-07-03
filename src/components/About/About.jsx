import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './About.css'
import pic6 from '../../images/pic6.jpg'
import pic5 from '../../images/pic5.jpg'

export default function About() {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | About Page</title>
        <meta name='description' content='This is About page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="about">
        <div className="about-img">
          <img src={pic6} alt="medical photo" />
        </div>
        <div className="about-info">
          <span>TREATMENT <span className="our">FOR EVERYONE</span></span>
          <p>
            <b>MediConnect Pro</b>  Treatment for Everyone: MediConnect Pro is a
            state-of-the-art healthcare facility dedicated to providing exceptional
            medical care to individuals from all walks of life. With a comprehensive range of services,
            from routine check-ups to specialized treatments, we ensure that every patient receives the
            personalized care they need in a welcoming and inclusive environment. Our team of experienced
            healthcare professionals is committed to upholding the highest standards of medical excellence,
            leveraging cutting-edge technology and evidence-based practices to promote optimal health outcomes.
            At MediConnect Pro, we believe that access to quality healthcare is a right, not a privilege,
            making us a trusted partner in the well-being of our community.
          </p>
        </div>
      </div>
      <div className="about">
        <div className="about-info">
          <span>OUR <span className="our">VISION </span></span>
          <p>
            To be a leader in transforming the health landscape through high-quality care,
            innovation, and community service. We aim to set standards in medical excellence,
            patient satisfaction, and continuous improvement in healthcare.
          </p>
        </div>
        <div className="about-img">
          <img src={pic5} alt="medical photo" />
        </div>
      </div>

    </>
  )
}
