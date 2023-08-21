import React from 'react'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper';
const Ourteam = () => {
    return (
        <>
            <section className="tf-box-icon create style1 tf-section our-partner">
                <div className="themesflat-container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-12">
                            <div className="heading-live-auctions mg-bt-22">
                                <h2 className="tf-title ">
                                    Our Partners</h2>
                            </div>
                            <div class="em_bar_bg"></div>
                        </div>
                        <div className='col-lg-12'>
                            {/* <div className=''> */}
                            <div className='container'>
                                <div className='row justify-content-center align-items-center'>
                                    <Swiper
                                        duration={400}
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false,
                                          }}
                                        modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
                                        spaceBetween={30}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                            },
                                            767: {
                                                slidesPerView: 2,
                                            },
                                            991: {
                                                slidesPerView: 3,
                                            },
                                            1300: {
                                                slidesPerView: 3,
                                            },
                                        }}
                                        Navigation

                                        pagination={{ clickable: true }}
                                        scrollbar={{ draggable: true }}
                                    >
                                        <SwiperSlide >
                                            <div className="swiper-container show-shadow carousel auctions">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide" >
                                                        <div className="slider-item">
                                                            {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6"> */}
                                                            <div className="partner-inner">
                                                                <div className="partner-img"><img src="images/latoken.jpg" /></div>
                                                                <div className="partner-details">
                                                                    <h4>Token</h4>
                                                                    <h2>LATOKEN</h2>
                                                                </div>
                                                            </div>
                                                            {/* </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <div className="swiper-container show-shadow carousel auctions">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide" >
                                                        <div className="slider-item">
                                                            {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6"> */}
                                                            <div className="partner-inner">
                                                                <div className="partner-img"><img src="images/esp.png" /></div>
                                                                <div className="partner-details">
                                                                    <h4>Website Development</h4>
                                                                    <h2>ESPSOFTTECH</h2>
                                                                </div>
                                                            </div>
                                                            {/* </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <div className="swiper-container show-shadow carousel auctions">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide" >
                                                        <div className="slider-item">
                                                            {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6"> */}
                                                            <div className="partner-inner">
                                                                <div className="partner-img"><img src="images/superem.png" /></div>
                                                                <div className="partner-details">
                                                                    <h4>Creative Artistry</h4>
                                                                    <h2>SUPREME ANIMATION</h2>
                                                                </div>
                                                                {/* </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <div className="swiper-container show-shadow carousel auctions">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide" >
                                                        <div className="slider-item">
                                                            {/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6"> */}
                                                            <div className="partner-inner">
                                                                <div className="partner-img"><img src="images/pirate.webp" /></div>
                                                                <div className="partner-details">
                                                                    <h4>Stratagic Partners</h4>
                                                                    <h2>Pirate Token</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        {/* <SwiperSlide >
                                            // <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                                <div className="partner-inner">
                                                    <div className="partner-img"><img src="images/esp.png" /></div>
                                                    <div className="partner-details">
                                                        <h4>Website Development</h4>
                                                        <h2>ESPSOFTTECH</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            // <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                                <div className="partner-inner">
                                                    <div className="partner-img"><img src="images/superem.png" /></div>
                                                    <div className="partner-details">
                                                        <h4>Creative Artistry</h4>
                                                        <h2>SUPREME ANIMATION</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                                <div className="partner-inner">
                                                    <div className="partner-img"><img src="images/pirate.webp" /></div>
                                                    <div className="partner-details">
                                                        <h4>Stratagic Partners</h4>
                                                        <h2>Pirate Token</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide> */}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </section>

        </>
    )
}

export default Ourteam