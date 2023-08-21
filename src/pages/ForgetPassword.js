import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';
import { ForgotPasswordAction } from '../Action/user.action';

const Login = () => {

    const [form, setForm] = useState({ email: '' })
    const [validatioError, setvalidatioError] = useState({});

    const inputHandler = (e) => {
        const { name, value, id } = e.target
        setForm((old) => {
            return { ...old, [name]: value }
        })

        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }
    }

    function validate() {
        let emailError = "";

        if (form.email === '') {
            emailError = "Email is required."
        }
        if (emailError) {
            setvalidatioError({
                emailError
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
            let res = await ForgotPasswordAction(form);
            if (res.success) {
                setForm((old) => {
                    return { ...old, ['email']: '' }
                })
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.href = `${config.baseUrl}login`;
                }, 3000);
            } else {
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
                                <h1 className="heading text-center"></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-login tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                        <h2 className="tf-title-heading ct style-1">
                        Forget Password
                            </h2>
                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Forget Password</h5>
                                </div>

                                <div className="form-inner">
                                    <form onSubmit={SubmitForm}>
                                        <span className="validationErr">{validatioError.emailError}</span>
                                        <input autoComplete="off" name="email" id='emailError' onChange={inputHandler} type="email" placeholder="Enter Email Address" />
                                        <div className="row-form style-1">
                                            <Link to={`${config.baseUrl}login`} className="forgot-pass">Login?</Link>
                                        </div>
                                        <div className='footer mt-3 text-center '>
                                            <button className="submit"  style={{padding:"16px"}}>Request Resent Link</button>
                                        </div>
                                    </form>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Login;
