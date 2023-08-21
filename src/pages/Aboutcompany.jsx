import React from 'react';
import shape1 from '../assets/images/backgroup-secsion/bg-gradient1.png'
import shape2 from '../assets/images/backgroup-secsion/bg-gradient2.png'
import shape3 from '../assets/images/backgroup-secsion/bg-gradient3.png'
import imgbg from '../assets/images/backgroup-secsion/img_bg_page_title.jpg'
import Cookies from 'js-cookie';
import whitepaper from '../assets/images/team/Scarlett-Global-Whitepaper.pdf'
import logo from '../assets/images/team/logo.png'
const Aboutcompany = () => {
    return (
        <div className="flat-title-page" style={{ backgroundImage: `url(${imgbg})` }}>
            <img className="bgr-gradient gradient1" src={shape1} alt="Axies" />
            <img className="bgr-gradient gradient2" src={shape2} alt="Axies" />
            <img className="bgr-gradient gradient3" src={shape3} alt="Axies" />
            <div className="shape item-w-16"></div>
            <div className="shape item-w-22"></div>
            <div className="shape item-w-32"></div>
            <div className="shape item-w-48"></div>
            <div className="shape style2 item-w-51"></div>
            <div className="shape style2 item-w-51 position2"></div>
            <div className="shape item-w-68"></div>
            <div className="overlay"></div>
            <div className="themesflat-container ">
                <div className='row'>
                    <div className='col-lg-6 col-md-6'>
                        <div className="content">
                            <h5 className="headings">SCARLETT GLOBAL - THE CRYPTO INDUSTRIAL REVOLUTION</h5>
                            {/* <h1 className="headings mb-style"><span className="tf-text s1">{props.item.title_2}</span>                                          
                                    </h1>
                                    <h5 className="headings">{props.item.title_3}</h5> */}
                            <p className="sub-heading">Scarlett Global is a technology company with a focus on crypto currency, Non-Fungible Tokens (NFT), Blockchain, Metaverse, digital wallets, and finding ways to apply those to potential industrial applications. Founded in Perth, Australia, we are a team of global professionals, business owners, and investors who are aware of the importance to innovate and utilise new technology.Our focus is to find true industrial utility through our technology and see the value of our token grow through practical applications and strategic partnerships
                            </p>
                            <div className="flat-bt-slider flex style2">
                                <a href={whitepaper} target="_blank" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Whitepaper
                                </span></a>
                                <a target="_blank" href="https://www.dextools.io/app/en/bnb/pair-explorer/0xf9c48ff26c4fed47fc86de4eddcf0b03b31a4884" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Dex Tools
                                </span></a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-12'>
                    <div className="image logo">
                                    {/* <img className="img-bg" src={bgimg} alt="axies" /> */}
                                    <img src={logo} alt="axies" />
                                </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Aboutcompany
