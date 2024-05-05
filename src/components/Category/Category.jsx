import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from './Category.module.css'
import Slider from "react-slick";

export default function Category() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    let [categories, setCategories] = useState([]);
    let [subCategories, setSubCategories] = useState([]);

    async function getCategory() {
        try {
            let { data } = await axios.get("https://king-prawn-app-3mgea.ondigitalocean.app/category");
            setCategories(data.category);
        } catch (e) {
            console.log(e);
        }

    }
    async function getSubCategories(id) {
        try {
            let { data } = await axios.get(`https://king-prawn-app-3mgea.ondigitalocean.app/category/${id}/subcategory`);
            setSubCategories(data.subCategory);
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        getCategory();
    }, []);

    return (
        <>
            <div className="container">
                <div className="row">
                    <Slider {...settings}>
                        {categories.map((category) => {
                            return (
                                <div className='col-md-4' key={category.id}>
                                    <div className="category text-center">
                                        <img src={category.image.secure_url} className={`${style.img} w-100`} alt={category.name} onClick={() => getSubCategories(category.id)} />
                                        <p>{category.name}</p>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </Slider>
                </div>
            </div>
            <div className='mt-5 container'>
                <div className="row">
                    {subCategories.map((category) => {
                        return (
                            <div className='col-md-4' key={category.id}>
                                <div className="subCategory text-center">
                                    <img src={category.image.secure_url} className={`${style.img} w-100`} alt={category.name} />
                                    <p>{category.name}</p>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}
