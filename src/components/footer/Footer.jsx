import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import logodark from '../../assets/images/logo/logo_dark.png'
import logofooter from '../../assets/images/logo/logo2.png'
import config from '../../config';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { addNewsLetterAction, getSocialLinksAction } from '../../Action/user.action';
const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
let socialList = [];
let p = 0;
const Footer = () => {

    const accountList = [
        {
            title: "Portfolio",
            link: "portfolio"
        },
        {
            title: "My Account",
            link: "profile"
        },
        {
            title: "Create NFT",
            link: "create-nft"
        },
    ]
    const resourcesList = [
        {
            title: "Terms & Condition",
            link: "terms-condition"
        },
        {
            title: "Privacy Policy",
            link: "privacy-policy"
        },
        {
            title: "Contact Us",
            link: "contact-us"
        }
    ]
    const companyList = [
        {
            title: "Home",
            link: ""
        },
        {
            title: "Marketplace",
            link: "marketplace"
        },
        {
            title: "About Us",
            link: "aboutus"
        }
    ]

    const [isVisible, setIsVisible] = useState(false);
    const [validatioError, setvalidatioError] = useState({ emailError: '' });

    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                autoDisplay: false,
            },
            "google_translate_element"
        );
    };


    useEffect(() => {
        if (p == 0) {
            var addScript = document.createElement("script");
            addScript.setAttribute(
                "src",
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            );
            document.body.appendChild(addScript);
            window.googleTranslateElementInit = googleTranslateElementInit;
            p++;
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        getSocialLinksAPI();
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const [email, setEmail] = useState("");
    const inputHandler = (e) => {
        const { name, value, id } = e.target
        setEmail(e.target.value);

        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }

    }

    function validate() {
        let emailError = "";

        if (email === '') {
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

    const addSubscriberAPI = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
        }
        else {
            let res = await addNewsLetterAction({ 'email': email });
            if (res.success) {
                toast.success(res.msg);
                setEmail('')
            } else {
                toast.error(res.msg);
            }
        }
    }

    const getSocialLinksAPI = async () => {
        let res = await getSocialLinksAction();
        if (res.success) {
            socialList = [
                {
                    icon: "fab fa-twitter",
                    link: res.data.twitter
                },
                {
                    icon: "fab fa-facebook",
                    link: res.data.facebook
                },
                {
                    icon: "fab fa-linkedin",
                    link: res.data.linkedin
                },
                {
                    icon: "fab fa-instagram",
                    link: res.data.insta
                },
                {
                    icon: "fab fa-youtube",
                    link: res.data.youtube
                }
            ]
        }
    }

    return (
        <>
            <Toaster />
            <footer id="footer" className="footer-light-style clearfix bg-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                            <div className="widget widget-logo">
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-12'>
                                        <div className="logo-footer" id="logo-footer">
                                            <Link to={`${config.baseUrl}`}>
                                                <img className='logo-dark' id="logo_footer" src="images/coin.png" alt="nft-gaming" />
                                                <img className='logo-light' id="logo_footer" src="images/coin.png" alt="nft-gaming" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-12'>
                                        <div id="google_translate_element"></div>
                                    </div>

                                </div>

                                <p className="sub-widget-logo">Victus Token's marketplace for creative digital assets, crypto collectibles and non-fungible tokens (NFT). Buy, sell and trade premium NFTs and also discover creatives from new talents. Victus Tokens fast, seemless and secure site ensures the upmost quality and service. Creators can add their NFT's by clicking on the link New Talents then by selecting create your own NFT.</p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-12">
                            <div className="widget widget-menu style-1">
                                <h5 className="title-widget">My Account</h5>
                                <ul>
                                    {
                                        accountList.map((item, index) => (
                                            <li key={index}><Link to={loginData?.id ? `${config.baseUrl + item.link}` : `${config.baseUrl}login`}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-7 col-12">
                            <div className="widget widget-menu style-2">
                                <h5 className="title-widget">Resources</h5>
                                <ul>
                                    {
                                        resourcesList.map((item, index) => (
                                            <li key={index}><Link to={`${config.baseUrl + item.link}`}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-12">
                            <div className="widget widget-menu fl-st-3">
                                <h5 className="title-widget">Company</h5>
                                <ul>
                                    {
                                        companyList.map((item, index) => (
                                            <li key={index}><Link to={`${config.baseUrl + item.link}`}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-subcribe">
                                <h5 className="title-widget">Subscribe Us</h5>
                                <div className="form-subcribe">
                                    <form id="subscribe-form" action="#" method="GET" acceptCharset="utf-8" className="form-submit">
                                        <input id="emailError" type="email" name="email" value={email} onChange={inputHandler} placeholder="Enter your email"
                                        />
                                        {/* onClick={addSubscriberAPI} */}
                                        <span className="validationErr">{validatioError.emailError}</span>
                                        <button id="submit" name="submit" onClick={addSubscriberAPI} type="submit"><i className="icon-fl-send"></i></button>
                                    </form>
                                </div>
                                <div className="widget-social style-1 mg-t32">
                                    <ul>
                                        {
                                            socialList.map((item, index) => (
                                                <li key={index}><a target="_blank" href={item.link}><i className={item.icon}></i></a></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-center copyright">Copyright 2023 <strong>Victus Token DWC LLC</strong></p>
                </div>
            </footer>
            {
                isVisible &&
                <Link onClick={scrollToTop} to='#' id="scroll-top"></Link>
            }
        </>
    );
}

export default Footer;
