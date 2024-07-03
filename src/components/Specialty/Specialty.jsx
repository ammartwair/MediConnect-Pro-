import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Specialty.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Specialty({ user }) {

    const [loading, setLoading] = useState(true);
    const { specialty } = useParams();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDoctors(specialty).then((result) => {
            setLoading(false)
            setDoctors(result);
        });
    }, []);

    async function getDoctors(specialty) {
        const spec = specialty.replace(/\s+/g, '');
        const encodedName = encodeURIComponent(spec);
        let docs = [];
        let res = await axios.get(`http://localhost:5000/specialties/${encodedName}/getDoctors`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    docs = data.doctors;
                    return docs;
                } else {
                    console.log(response.data.message);
                    setLoading(false)
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            })
        return docs;
    }
    if (loading) {
        return <Loading />
    }



    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Specialty</title>
                <meta name="description" content="This is Specialty page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            <div className={`specialty-container`}>
                <h2>
                    {specialty}
                </h2>
            </div>
            <div className={`container`} >
                <div className="specialtyAboutAll mt-5">
                    <h3>About Our Specialty</h3>
                    {specialty === 'Cardiology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro has one of the largest Cardio care programs in a community academic hospital in the GTA (Greater Toronto Area) and provides treatment for many types of CVD, including heart transplant, open heart surgery, angiogram, prostate, gynecological, and urinary treatments.</p>
                            <p>MediConnect Pro is constantly thinking and going beyond for our patients, our community, and our people. As people and communities change, MediConnect Pro will continuously evolve to meet their needs. We are driven to achieve the promise of people-centred care - to create a welcoming and inclusive environment that contributes to health equity.</p>
                        </div>
                    }
                    {specialty === 'Dermatology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers comprehensive dermatological care including diagnosis and treatment of skin conditions, cosmetic procedures, and skin cancer screenings.</p>
                            <p>Our dermatology specialists are committed to providing personalized care to ensure the health and beauty of your skin. We continuously evolve to meet the changing needs of our patients and communities, striving to achieve the promise of people-centred care.</p>
                        </div>
                    }
                    {specialty === 'Endocrinology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides expert care for endocrine disorders, including diabetes, thyroid disorders, and metabolic conditions.</p>
                            <p>Our endocrinology team is dedicated to delivering personalized treatment plans and staying at the forefront of medical advancements to improve patient outcomes. We are committed to evolving with the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Gastroenterology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers advanced care for digestive disorders, including endoscopic procedures, liver disease management, and treatment for gastrointestinal conditions.</p>
                            <p>Our gastroenterology specialists provide compassionate care and utilize the latest techniques to enhance patient health. We are driven by the promise of people-centred care and continuously adapt to meet the needs of our patients.</p>
                        </div>
                    }
                    {specialty === 'Hematology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro's hematology department specializes in the diagnosis and treatment of blood disorders, including anemia, leukemia, and clotting disorders.</p>
                            <p>We are committed to providing comprehensive care and support for patients with blood-related conditions, ensuring the highest standards of treatment and care. Our team evolves to meet the changing needs of our community.</p>
                        </div>
                    }
                    {specialty === 'Infectious Disease' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers specialized care for infectious diseases, including treatment and prevention of infections, immunizations, and travel medicine consultations.</p>
                            <p>Our infectious disease experts are dedicated to providing effective treatments and public health interventions to protect and improve community health. We continuously evolve to address emerging health threats.</p>
                        </div>
                    }
                    {specialty === 'Neurology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides comprehensive neurological care, including treatment for stroke, epilepsy, multiple sclerosis, and neuromuscular disorders.</p>
                            <p>Our neurology team is committed to delivering advanced treatments and personalized care to improve patient outcomes. We evolve to meet the needs of our patients and the community, driven by the promise of people-centred care.</p>
                        </div>
                    }
                    {specialty === 'Obstetrics And Gynecology (OB/GYN)' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers expert obstetric and gynecologic care, including prenatal and postnatal care, reproductive health services, and minimally invasive surgeries.</p>
                            <p>Our OB/GYN specialists are dedicated to providing compassionate and comprehensive care for women at all stages of life. We continuously adapt to meet the evolving needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Oncology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro's oncology department offers advanced cancer care, including chemotherapy, radiation therapy, and surgical oncology.</p>
                            <p>Our oncology team is committed to providing personalized treatment plans and supportive care to enhance the quality of life for cancer patients. We evolve to meet the changing needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Ophthalmology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides comprehensive eye care, including cataract surgery, glaucoma management, and treatment for retinal disorders.</p>
                            <p>Our ophthalmology specialists are dedicated to preserving and improving vision through advanced treatments and personalized care. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Orthopedics' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers expert orthopedic care, including joint replacement, sports medicine, and treatment for musculoskeletal injuries.</p>
                            <p>Our orthopedic specialists are committed to restoring mobility and improving the quality of life for our patients. We evolve to meet the changing needs of our community, driven by the promise of people-centred care.</p>
                        </div>
                    }
                    {specialty === 'Otolaryngology(ENT)' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides comprehensive ENT care, including treatment for ear, nose, and throat conditions, hearing loss, and sinus disorders.</p>
                            <p>Our ENT specialists are dedicated to providing effective treatments and personalized care to improve patient health. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Pediatrics' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers specialized pediatric care, including preventive health services, treatment for acute and chronic illnesses, and developmental screenings.</p>
                            <p>Our pediatric team is committed to providing compassionate and comprehensive care for children of all ages. We evolve to meet the changing needs of our patients and community, driven by the promise of people-centred care.</p>
                        </div>
                    }
                    {specialty === 'Pulmonology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides advanced care for respiratory conditions, including asthma, COPD, and pulmonary fibrosis.</p>
                            <p>Our pulmonology specialists are dedicated to delivering effective treatments and personalized care to improve respiratory health. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Rheumatology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers expert care for rheumatic diseases, including rheumatoid arthritis, lupus, and gout.</p>
                            <p>Our rheumatology team is committed to providing comprehensive care and effective treatments to improve the quality of life for our patients. We evolve to meet the changing needs of our community.</p>
                        </div>
                    }
                    {specialty === 'Urology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides specialized urological care, including treatment for urinary disorders, prostate conditions, and kidney stones.</p>
                            <p>Our urology specialists are dedicated to delivering personalized care and advanced treatments to improve patient outcomes. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Psychiatry' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers comprehensive psychiatric care, including treatment for mood disorders, anxiety, and behavioral health conditions.</p>
                            <p>Our psychiatry team is committed to providing compassionate care and effective treatments to improve mental health and well-being. We evolve to meet the changing needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Anesthesiology' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides expert anesthesiology services, including preoperative assessments, pain management, and sedation for surgical procedures.</p>
                            <p>Our anesthesiology team is dedicated to ensuring patient safety and comfort during medical procedures. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                    {specialty === 'Emergency Medicine' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro offers advanced emergency medical care, including trauma care, acute illness management, and rapid response services.</p>
                            <p>Our emergency medicine team is committed to providing prompt and effective care to improve patient outcomes in critical situations. We evolve to meet the changing needs of our community, driven by the promise of people-centred care.</p>
                        </div>
                    }
                    {specialty === 'Family Medicine' &&
                        <div className='specialtyAbout mt-5'>
                            <p>MediConnect Pro provides comprehensive family medicine services, including preventive care, chronic disease management, and health education.</p>
                            <p>Our family medicine team is dedicated to providing personalized and continuous care for individuals and families. We continuously evolve to meet the needs of our patients and community.</p>
                        </div>
                    }
                </div>
                <div className="generalSpecialties">
                    <h3 className='mt-5 mb-2' >Enhancing the patient and family experience</h3>
                    <p>At MediConnect Pro, we work to ensure our patients receive the highest standard of cancer care. All patients receive care guided by best practice standards of Cardio Care. These practices have been shown to provide the best patient outcomes. Patients and their families can quickly access a diverse range of cancer care services, including these facilities:</p>
                    <ul>
                        <li>The BMO Breast Diagnostic Clinic, part of the Karen, Heather & Lynn Steinberg Breast Centre</li>
                        <li>The Baruch/Weisz Cardio Centre</li>
                        <li>Freeman Centre for the Advancement of Palliative Care</li>
                        <li>Gale and Graham Wright Prostate Centre</li>
                    </ul>
                    <h3 className='mt-5 mb-2' >Patients supported by a dedicated team of experts</h3>
                    <p>Our interdisciplinary team of highly skilled and compassionate health-care professionals includes physicians, surgeons, radiologists, pathologists, oncologists, nurses, medical imaging professionals, case managers, and volunteers.</p>
                    <p>We partner with the two regional cancer centres: the Odette Cancer Centre at Sunnybrook Health Sciences Centre, and Princess Margaret Hospital at the University Health Network, to facilitate radiation treatments for our patients. A partnership between North York General and Sunnybrook Health Sciences Centre offers patients easy and timely access to quality colorectal cancer care.</p>
                </div>

                {/* Doctors */}
                <h3 className='my-5' id="SpecialtyTitle" style={{ textTransform: 'capitalize' }}>Available Doctors Under {specialty}</h3>
                {doctors.length > 0 ?
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={3}
                        onSlideChange={() => console.log('slide change')}
                    >
                        {doctors.map((doctor) => (
                            <SwiperSlide key={doctor._id}>
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <Link to={`/Profile/${doctor._id}`}>
                                            <img decoding="async" src={doctor.image.secure_url} alt={`DR ${doctor.userName}`} />
                                        </Link>
                                        {
                                            user?.role === 'Patient' &&
                                            <div className="doctor-btn">
                                                <Link to={`/Appointment/${doctor._id}`} className="default-btn">
                                                    <span className="icon-circle mx-2">
                                                        <FontAwesomeIcon icon={faArrowRight} className='rightArrow' />
                                                    </span>
                                                    <span style={{ fontSize: "20px" }}>Book an Appointment</span>
                                                </Link>
                                            </div>
                                        }

                                    </div>
                                    <div className="doctor-content">
                                        <h3><Link to={`/Profile/${doctor._id}`}>Dr. {doctor.userName}</Link></h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                        }
                    </Swiper>
                    : <>
                        <h5>No doctors are currently registered under this specialty. Please check back later.</h5>
                    </>
                }

                <div className="generalSpecialties my-5">
                    <h3>Information for new patients</h3>
                    <p>The following series of videos are designed for patients who are receiving treatment at the Anne Tanenbaum Chemotherapy Clinic. The first video, “A Day in Chemo Clinic,” is helpful to watch prior to starting treatment and provides insights on what to expect before your appointment.</p>
                    <p>Most patients will receive conventional chemotherapy and may find the videos explaining what chemotherapy is and how it is given helpful. For a general introduction, start with “Chemo 101.” This video covers important day-to-day considerations such as “Can I take supplements while on chemo?”, “Can I drink alcohol while on chemo?”, and “Do I have to avoid crowds while on chemo?” Additional videos include common side effects of chemotherapy, along with important prevention and management tips.</p>

                </div>
            </div>
        </>
    )
}