// Home.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CoverPhoto from './CoverPhoto';
import style from './Home.css';

export default function Home() {

  const [newPage, setNewPage] = useState(false);

  useEffect(() => {
    if (!newPage) {
      window.scrollTo(0, 0);
      setNewPage(true);
    }
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Home Page</title>
        <meta name='description' content='Welcome to MediConnect Pro, your comprehensive solution for managing medical records and appointments efficiently.' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <CoverPhoto /><br /><br />
      <div className="container">

        <h3>Welcome</h3>
        <p>Welcome to MediConnect Pro, the ultimate platform for healthcare management and collaboration. Our system allows medical professionals and patients to manage appointments, medical records, and consultations with ease and efficiency.</p>
        <section>
          <h4>Our Features</h4>
          <ul>
            <li>Easy Appointment Scheduling</li>
            <li>Secure Medical Record Management</li>
            <li>Real-Time Collaboration Tools</li>
          </ul>
        </section>
        <section>
          <h4>Why Choose Us?</h4>
          <p>At MediConnect Pro, we prioritize security and convenience to ensure that your medical management needs are met with the highest standards. Our platform is designed to be user-friendly and secure, providing you with the necessary tools to enhance patient care and workflow.</p>
        </section>
        <section>
          <h4>Testimonials</h4>
          <blockquote>
            "MediConnect Pro has revolutionized our clinic's operations. It's user-friendly and incredibly efficient." - Dr. Smith
          </blockquote>
        </section>
      </div>
    </>
  )
}