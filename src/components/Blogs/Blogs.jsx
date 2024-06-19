import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'

export default function Blogs({ user }) {


    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let [errors, setErrors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    let [statusError, setStatusErrors] = useState('');
    let navigate = useNavigate();
    const schema = Yup.object().shape({
        title: Yup.string().required('Title is required').min(4, 'Title must be at least 4 characters').max(100, 'Title must be at most 100 characters'),
        blogText: Yup.string().required('Blog text is required').min(5, 'Blog text must be at least 5 characters').max(5000000000, 'Blog text is too long'),
        file: Yup.mixed()
            .required('Image is required')
            .test('fileSize', 'File size is too large', (value) => {
                if (value) {
                    return value.size <= 1048576; // 1MB
                }
                return true; // No file uploaded
            })
            .test('fileType', 'Unsupported file type', (value) => {
                if (value) {
                    return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
                }
                return true; // No file uploaded
            })
    });
    let formik = useFormik({
        initialValues: {
            title: '',
            blogText: '',
            file: null
        }, validationSchema: schema,
        onSubmit: sendBlogData,
    })

    async function sendBlogData(values) {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', formik.values.title);
        formData.append('blogText', formik.values.blogText);
        formData.append('file', formik.values.file);

        console.log(formik.values.file);

        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            const response = await axiosInstance.post("http://localhost:5000/blog/createBlog", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Specify content type as multipart/form-data
                }
            });

            if (response.data.message === 'Blog Created') {
                setErrors([]);
                setStatusErrors('');
                toast.success("Blog Created successfully")
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setErrors(response.data.err[0]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const toggleFormVisibility = () => {
        setShowForm(prevState => !prevState);
    };

    const handleImageUpload = (file) => {
        formik.setFieldValue('file', file);
    };


    const fetchData = async () => {
        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            await axiosInstance.get('http://localhost:5000/blog').then((response) => {
                if (response.data.message === 'success') {
                    setBlogs(response.data.blogsWithUsernames);
                } else {
                    console.log(response.data.message);
                }
            })
        } catch (error) {
            setError(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    console.log(blogs);

    return (<>
        <Helmet>
            <meta charSet="utf-8" />
            <title>MediConnect Pro | Blogs</title>
            <meta name='description' content='This is Blogs page' />
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <h2>Blogs</h2>
        {user?.role == 'Doctor' ?
            !user.isAdmin ?
                <>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary mt-3" onClick={toggleFormVisibility}>Create a new blog</button>
                    </div>
                    <br />
                    {showForm && (<>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    placeholder="Title"
                                />
                                <label htmlFor="title">Title</label>
                                {formik.touched.title && formik.errors.title ? (
                                    <div>{formik.errors.title}</div>
                                ) : null}

                            </div>
                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    id="blogText"
                                    name="blogText"
                                    value={formik.values.blogText}
                                    onChange={formik.handleChange}
                                    placeholder="Blog Text"
                                />
                                <label htmlFor="blogText">Blog Text</label>
                                {formik.touched.blogText && formik.errors.blogText ? (
                                    <div>{formik.errors.blogText}</div>
                                ) : null}
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    id="file"
                                    name="file"
                                    className='form-control'
                                    type="file"
                                    onChange={(event) => handleImageUpload(event.target.files[0])}
                                />

                                <label htmlFor="file">Image</label>
                                {formik.touched.file && formik.errors.file ? (
                                    <div>{formik.errors.file}</div>
                                ) : null}
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary mt-3" type="submit">Submit</button>
                            </div>
                        </form>
                    </>
                    )}
                    <br /><br />
                </>
                : <></> : <></>
        }
        {
            blogs?.length > 0 ?
                blogs.map((blog, index) => (
                    <div key={index}>
                        <h4>{blog.title}</h4>
                        <p>{blog.blogText}</p>
                        <p>Written by: {blog.createdBy.userName}</p>
                    </div>
                ))
                : <>
                    <div>No Blogs Yet</div>
                </>
        }
    </>
    )
}