import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Physicians() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors();
  }, []);

  async function getDoctors() {
    let res = await axios.get(`http://localhost:5000/user/doctorsAccepted`).then((response) => {
      if (response.data) {
        let { data } = response;
        if (data.message === "Success") {
          setDoctors(data.doctors);
          setLoading(false);
        } else {
          setLoading(false);
          console.log(response.data.message);
        }
      }
    })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      })
  }


  const addSpaces = (text) => {
    // This function processes the text to add spaces
    let result = '';
    let insideParentheses = false;

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      if (char === '(') {
        insideParentheses = true;
        result += ' ' + char;
      } else if (char === ')') {
        insideParentheses = false;
        result += char;
      } else if (char.match(/[A-Z]/) && !insideParentheses) {
        result += ' ' + char;
      } else {
        result += char;
      }
    }

    return result.trim();
  };


  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Joining Requests</title>
        <meta name="description" content="This is Specialty page" />
        <link rel="canonical" href="www.facebook.com" />
      </Helmet>
      <div>
        <div className="container">
        <h3 className='my-4' id="SpecialtyTitle">Our Providers: </h3>
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
                    </div>
                    <div className="doctor-content">
                      <h3>Dr. {doctor.userName}</h3>
                      <p>{doctor.specialties.map((specialty, index) => {
                        if (index === doctor.specialties.length - 1) {
                          return addSpaces(specialty)
                        }
                        return addSpaces(specialty) + ', '
                      })}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
              }
            </Swiper> : <>
              <h3> No Registerd Doctors Yet</h3>
            </>
          }
        </div>
      </div >
    </>
  )
}