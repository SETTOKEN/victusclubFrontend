import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Navigation, Scrollbar, A11y   } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import shape1 from '../../assets/images/backgroup-secsion/bg-gradient1.png'
import shape2 from '../../assets/images/backgroup-secsion/bg-gradient2.png'
import shape3 from '../../assets/images/backgroup-secsion/bg-gradient3.png'
import bgimg from '../../assets/images/backgroup-secsion/new1.png'
import logo from '../../assets/images/team/logo.png'
import imgbg from '../../assets/images/backgroup-secsion/img_bg_page_title.jpg'
import config from '../../config';
import Cookies from 'js-cookie';
import whitepaper from '../../assets/images/team/Scarlett-Global-Whitepaper.pdf'
const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));    

const Slider = props => { 
    const allData = props.data;
    const data = allData[0];
    const nftDetails = allData[1];

    return (
        <div className="mainslider" >
            <Swiper
                modules={[Navigation,  Scrollbar, A11y ]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    scrollbar={{ draggable: true }}
                >
                {
                    data.map((item, index) => (
                        <SwiperSlide key={index} className={item.class}>
                            <SliderItem item={item} nftDetails ={nftDetails} />
                        </SwiperSlide>
                        
                    ))
                }
        </Swiper>
        </div>
    );
}

Slider.propTypes = {
    data: PropTypes.array.isRequired,
    control: PropTypes.bool,
    auto: PropTypes.bool,
    timeOut: PropTypes.number
}
const SliderItem = props => (
    <div className="flat-title-page" style={{backgroundImage: `url(${imgbg})`}}>
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
        <div className="swiper-container mainslider home">
            <div className="swiper-wrapper">
                <div className="swiper-slide">
                    <div className="slider-item">	
                        <div className="themesflat-container ">
                            <div className="wrap-heading flat-slider flex">
                                <div className="content">
                                    <h5 className="headings">{props.item.title_1}</h5>	
                                    {/* <h1 className="headings mb-style"><span className="tf-text s1">{props.item.title_2}</span>                                          
                                    </h1>
                                    <h5 className="headings">{props.item.title_3}</h5> */}
                                    <p className="sub-heading">{props.item.description}
                                    </p>
                                    <div className="flat-bt-slider flex style2">
                                        <a href={whitepaper} target="_blank" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Whitepaper
                                        </span></a>
                                        <a target="_blank" href="https://www.dextools.io/app/en/bnb/pair-explorer/0xf9c48ff26c4fed47fc86de4eddcf0b03b31a4884" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Dex Tools
                                        </span></a>
                                    </div>
                                </div>
                                <div className="image">
                                    {/* <img className="img-bg" src={bgimg} alt="axies" /> */}
                                    <img src={logo} alt="axies" />
                                </div>
                            </div>   
                        </div>					                           
                    </div>
                </div>
            </div>
        </div>        
    </div>
    
)
export default Slider;
