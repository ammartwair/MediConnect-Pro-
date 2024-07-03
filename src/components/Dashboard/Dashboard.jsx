import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Cardiology from "../../images/Cardiology.png";
import Dermatology from "../../images/Dermatology.png";
import Endocrinology from "../../images/endocrinology.webp";
import Gastroenterology from "../../images/Gastroenterology.png";
import Hematology from "../../images/Hematology.png";
import Infectious from "../../images/Infectious-Diseases.jpg";
import Neurology from "../../images/Neurology.webp";
import ObstetricsAndGynecology from "../../images/ObstetricsAndGynecology.webp";
import Oncology from "../../images/Oncology.jpg";
import Ophthalmology from "../../images/Ophthalmology.jpg";
import Orthopedics from "../../images/Orthopedics.png";
import Otolaryngology from "../../images/Otolaryngology.png";
import Pediatrics from "../../images/Pediatrics.webp";
import Pulmonology from "../../images/Pulmonology.png";
import Rheumatology from "../../images/Rheumatology.jpg";
import Urology from "../../images/Urology.webp";
import Psychiatry from "../../images/Psychiatry.webp";
import Anesthesiology from "../../images/Anesthesiology.jpg";
import EmergencyMedicine from "../../images/EmergencyMedicine.jpeg";
import FamilyMedicine from "../../images/FamilyMedicine.jpg";


export default function Dashboard(user) {

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Hematology', 'Infectious Disease', 'Neurology', 'Obstetrics And Gynecology (OB/GYN)',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Otolaryngology(ENT)',
    'Pediatrics', 'Pulmonology', 'Rheumatology', 'Urology',
    'Psychiatry', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine'
  ];

  const Images = [
    Cardiology, Dermatology, Endocrinology, Gastroenterology, Hematology, Infectious,
    Neurology, ObstetricsAndGynecology, Oncology, Ophthalmology, Orthopedics, Otolaryngology,
    Pediatrics, Pulmonology, Rheumatology, Urology, Psychiatry, Anesthesiology, EmergencyMedicine, FamilyMedicine

  ]

  function replaceString(url) {
    return url.replace(/\//g, '%2F');
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Dashboard</title>
        <meta name='description' content='This is home page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>
        <div className="container">
          <h1 className='mt-5' style={{ textDecoration: "underline" }}>Our Specialties</h1>
          <div className="row mb-5 pb-5">
            {
              specialties.map((specialty, index) => (
                <div className='my-5 col-md-6' key={index}>
                  <div className=" d-flex justify-content-center w-100 h-100 my-5">
                    <div className='box-shadow d-flex justify-content-center' style={{ width: "100%", height: "100%", position: "relative" }}>
                      <Link to={`/Specialty/${replaceString(specialty)}`} style={{ width: "100%", height: "100%" }} >
                        <img src={Images[index]} alt={specialty} width={"100%"} height={"100%"} style={{ objectFit: "cover" }} />
                      </Link>
                      <Link className='link' style={{ width: "100%", textAlign: "center", position: "absolute", left: "50%", bottom: "-55px", transform: "translateX(-50%)", textDecoration: "none" }} to={`/Specialty/${replaceString(specialty)}`} ><h2>{specialty}</h2></Link>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
