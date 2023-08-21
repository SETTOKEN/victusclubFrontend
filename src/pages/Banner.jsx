import React from 'react'
import shape1 from '../assets/images/backgroup-secsion/bg-gradient1.png'
import shape2 from '../assets/images/backgroup-secsion/bg-gradient2.png'
import shape3 from '../assets/images/backgroup-secsion/bg-gradient3.png'
import logo from '../assets/images/logo/Logo3.png'
import whitepaper from '../assets/images/team/Scarlett-Global-Whitepaper.pdf'
import imgbg from '../assets/images/backgroup-secsion/img_bg_page_title.jpg'

const Banner = () => {
    
    return (
        <section className='tf-section' style={{paddingTop:"50px"}}>
            <div className="flat-title-page" style={{ backgroundImage: `url(${imgbg})` }}>

                <img className="bgr-gradient gradient1" src={shape1} alt="Axies" />
                <div className="shape item-w-16"></div>
                <div className="shape item-w-22"></div>
                <div className="shape item-w-32"></div>
                <div className="shape item-w-48"></div>
                <div className="shape style2 item-w-51"></div>
                <div className="shape style2 item-w-51 position2"></div>
                <div className="shape item-w-68"></div>
                <div className="overlay"></div>
                <div className='themesflat-container '>
                    <div className='row justify-content-center align-items-center'>
                        <div className='col-lg-6 col-md-6 col-12'>
                            <h5 className="headings">VICTUS TOKEN – SHOP, PLAY & EARN </h5>
                            <p className='description sub-heading'>Victus Tokens’ unique marketplace incorporates both physical and digital assets in one space. Start-ups, Entrepreneurs,  Influencers, and Creators seamlessly build an online business & start selling products physical or digital today!</p>
                            <div className="flat-bt-slider flex style2">
                                <a href={whitepaper} target="_blank" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Whitepaper
                                </span></a>
                                <a target="_blank" href="https://www.dextools.io/app/en/bnb/pair-explorer/0xf9c48ff26c4fed47fc86de4eddcf0b03b31a4884" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Dex Tools
                                </span></a>
                            </div>
                        </div>
                        <div className='col-lg-6 col-md-6 col-12'>
                            <div className="images mt-3">
                                <img src={logo} alt="axies" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Banner