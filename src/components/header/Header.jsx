import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import DarkMode from './DarkMode';
import config from '../../config';
import Cookies from 'js-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
let p = 0;
let q = 0;
const Header = () => {
    const { pathname } = useLocation();
    const [walletAddress, setwalletAddress] = useState('');
    const headerRef = useRef(null)




    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });

    useEffect(async () => {
        setTimeout(() => {
            if (window.ethereum) {
                const { ethereum } = window;
                setwalletAddress(ethereum.selectedAddress)
            }
        }, 100);

    }, []);

    const isSticky = (e) => {
        const header = document.querySelector('.js-header');
        const scrollTop = window.scrollY;
        scrollTop >= 300 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed');
        scrollTop >= 400 ? header.classList.add('is-small') : header.classList.remove('is-small');
    };

    const menuLeft = useRef(null)
    const btnToggle = useRef(null)
    const btnSearch = useRef(null)

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }

    const searchBtn = () => {
        btnSearch.current.classList.toggle('active');
    }

    const [activeIndex, setActiveIndex] = useState(null);
    const handleOnClick = index => {
        setActiveIndex(index);
    };

    const connectMetasmask = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setwalletAddress(accounts[0])
        }
    }

    function logout() {
        Cookies.remove('loginSuccessScarlettUserpanel');
        Cookies.remove('token');
        setTimeout(() => {
            window.location.href = `${config.baseUrl}`
        });
    }

    return (
        <header id="header_main" className="header_1 js-header" ref={headerRef}>
            <div className="themesflat-container pl-0" >
                <div className="row">
                    <div className="col-md-12">
                        <div id="site-header-inner">
                            <div className="wrap-box flex">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link to={`${config.baseUrl}`} rel="home" className="main-logo">
                                            <img className='logo-dark' id="logo_header" src="images/Logo3_new.png" alt="nft-gaming" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flat-search-btn flex">
                                    {loginData?.email ?
                                        walletAddress ?
                                            <div className="sc-btn-top mg-r-12" id="site-header">
                                                <a target="_blank" href={`${config.blockchainUrl + walletAddress}`} className="sc-button"><span>{walletAddress.toString().substring(0, 4) + '...' + walletAddress.toString().substring(walletAddress.length - 4)}
                                                </span></a>
                                            </div>
                                            :
                                            <div className="sc-btn-top mg-r-12" id="site-header" style={{ cursor: 'pointer' }}>
                                                <a href="javascript:void(0)" className="sc-button"><span onClick={connectMetasmask}>Connect Wallet</span></a>
                                            </div>
                                        : ""
                                    }

                                    <div>
                                        <Link className='marketplace' to={`${config.baseUrl}marketplace`}>Marketplace</Link>
                                    </div>
                                    {loginData?.email ?
                                        <>
                                            <Dropdown className='profiledropdown'>
                                                <Dropdown.Toggle variant="" id="dropdown-basic" >
                                                    Profile
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className=''>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}profile`} >My Account </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}create-nft`} >Create NFT</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}createcategory`} >Create A Shop</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}Physicalrequest`} >Physical Request</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}portfolio`}>Portfolio</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}bids-history`} >Bid History</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}transactions-list`} >Transactions List</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </>
                                        :
                                        <div className="sc-btn-top mg-r-12" id="site-header">
                                            <Link to={`${config.baseUrl}sign-up`} className="sc-button"><span>Sign Up
                                            </span>
                                            </Link>&nbsp;&nbsp;
                                            <Link to={`${config.baseUrl}login`} className="sc-button"><span>Login
                                            </span>
                                            </Link>
                                        </div>
                                    }
                                </div>
                                <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                                <nav id="main-nav" className="main-nav" ref={menuLeft} >
                                    <ul>

                                        <li> <Link to={`${config.baseUrl}marketplace`} className=""><span>Marketplace
                                        </span></Link>
                                        </li>
                                        <li>
                                            <div className='mt-3'>
                                                {loginData?.email ?
                                                    "" :
                                                    <>
                                                        <Link to={`${config.baseUrl}sign-up`} className="sc-button sign"><span>Sign Up
                                                        </span></Link>&nbsp;&nbsp;&nbsp;
                                                        <Link to={`${config.baseUrl}login`} className="sc-button sign mt-3"><span>Login
                                                        </span></Link>
                                                    </>
                                                }
                                            </div>

                                        </li>
                                        <li>
                                        <div className='mt-3'>
                                                {loginData?.email ?
                                                       walletAddress ?                                                   
                                                        <a target="_blank" href={`${config.blockchainUrl + walletAddress}`} className="sc-button"><span>{walletAddress.toString().substring(0, 4) + '...' + walletAddress.toString().substring(walletAddress.length - 4)}
                                                        </span></a>
                                                        :
                                                        <a href="javascript:void(0)" className="sc-button"><span onClick={connectMetasmask}>Connect Wallet</span></a>
                                                   
                                                    : ""
                                                }
                                            </div>
                                            {/* {loginData?.email ?
                                                walletAddress ?
                                                    <div className="sc-btn-top mg-r-12" id="site-header">
                                                        <a target="_blank" href={`${config.blockchainUrl + walletAddress}`} className="sc-button"><span>{walletAddress.toString().substring(0, 4) + '...' + walletAddress.toString().substring(walletAddress.length - 4)}
                                                        </span></a>          
                                                    </div>
                                                    :
                                                    <div className="sc-btn-top mg-r-12" id="site-header" style={{ cursor: 'pointer' }}>
                                                        <a href="javascript:void(0)" className="sc-button"><span onClick={connectMetasmask}>Connect Wallet</span></a>
                                                    </div>
                                                : ""
                                            } */}
                                        </li>
                                    </ul>

                                    {loginData?.email ?
                                        <>
                                        <div className='pt-3' >
                                            <Dropdown className='profiledropdown'>
                                                <Dropdown.Toggle variant="" id="dropdown-basic" >
                                                    Profile
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className=''>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}profile`} >My Account </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}create-nft`} >Create NFT</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}Physicalrequest`} >Physical Request</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}portfolio`}>Portfolio</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}bids-history`} >Bid History</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Link to={`${config.baseUrl}transactions-list`} >Transactions List</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            </div>
                                        </>
                                        :
                                        ""
                                    }

                                </nav>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DarkMode />
        </header>
    );
}

export default Header;
