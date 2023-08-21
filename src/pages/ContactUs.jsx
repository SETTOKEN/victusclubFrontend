import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { ContactFormAction } from '../Action/user.action';

const Login = () => {

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [validatioError, setvalidatioError] = useState({ nameError: '', emailError: '', phoneError: '', subjectError: '', messageError: '' });
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {

    }, []);

    const inputHandler = (e) => {
        const { name, value, id } = e.target
        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }

        setForm((old) => {
            return { ...old, [name]: value }
        })
    }

    function validate() {
        let nameError = "";
        let emailError = "";
        let subjectError = "";
        let messageError = "";

        if (form.name === '') {
            nameError = "Name is required."
        }
        if (form.email === '') {
            emailError = "Email is required."
        }
        if (form.subject === '') {
            subjectError = "Subject is required."
        }
        if (form.message === '') {
            messageError = "Message is required."
        }
        if (nameError || emailError || subjectError || messageError) {
            setvalidatioError({
                nameError, emailError, subjectError, messageError
            })
            return false
        } else {
            return true
        }
    }

    const SubmitForm = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {

        }
        else {
            setisLoading(true);
            let res = await ContactFormAction(form);
            if (res.success) {
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setisLoading(false);
                toast.error(res.msg);
            }
        }
    }
    return (
        <div>
            <Toaster />
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Contact Us</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-login tf-section">
                <div className="themesflat-container">
                    <div className="row mt-4">
                        <div className="col-12">

                            <div className="flat-form box-login-email mt-5" >
                                <div className="form-inner">
                                    <form autoComplete='off' onSubmit={SubmitForm}>


                                        <input autoComplete="off" name="name" id='nameError' onChange={inputHandler} type="text" placeholder="Enter Name" />
                                        <span className="validationErr">{validatioError.nameError}</span>

                                        <input autoComplete="off" name="email" id='emailError' onChange={inputHandler} type="email" placeholder="Enter Email Address" />
                                        <span className="validationErr">{validatioError.emailError}</span>

                                        <input autoComplete="off" name="subject" id='subjectError' onChange={inputHandler} type="text" placeholder="Enter Subject" />
                                        <span className="validationErr">{validatioError.subjectError}</span>

                                        <textarea autoComplete="off" name="message" id='messageError' onChange={inputHandler} type="text" placeholder="Enter Message" />
                                        <span className="validationErr">{validatioError.messageError}</span>
                                        <br />
                                        {isLoading ?
                                            <>
                                                <div className='text-center'>
                                                    <button disabled className="submit">Processing &nbsp; <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i></button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='text-center'>
                                                    <button className="submit">Submit</button>
                                                </div>
                                            </>
                                        }
                                    </form>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
