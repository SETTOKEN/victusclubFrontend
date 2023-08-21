import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import CardModal from './CardModal'
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import config from '../../config';

const LiveAuction = props => {
    const data = props.data;
    const [modalShow, setModalShow] = useState(false);
    return (
        <Fragment>
            <section className="tf-section live-auctions">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions">
                                <h2 className="tf-title pb-20">NFTs</h2>
                                <Link to={`${config.baseUrl}marketplace`} className="exp style2">EXPLORE MORE</Link>
                            </div>
                            <div class="em_bar_bg"></div>
                        </div>
                        <div className="col-md-12">
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
                                spaceBetween={30}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                  }}
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
                                        slidesPerView: 4,
                                    },
                                }}
                                navigation
                                pagination={{ clickable: true }}
                                scrollbar={{ draggable: true }}
                            >
                                {
                                    data.slice(0, 8).map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="swiper-container show-shadow carousel auctions">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide">
                                                        <div className="slider-item">
                                                            <div className="sc-card-product">
                                                                <div className="card-media">
                                                                    {/* {`${config.baseUrl}nft-details/` + item.id} */}
                                                                    <Link to={`${config.baseUrl}nft-details/` + item.id}>
                                                                    {item.file_type == 'image' ?
                                                            <img src={`${config.ipfsUrl + item.image}`} alt="Axies" />
                                                            :
                                                            item.file_type == 'video' ?
                                                                <video muted autoPlay playsInline loop style={{ height: "100%" }}>
                                                                    <source src={`${config.ipfsUrl + item.image}`} type="video/mp4" />
                                                                </video>
                                                                :
                                                                ''
                                                        }
                                                                        </Link>
                                                                </div>
                                                                <div className="card-title">
                                                                    <h5><Link to="#">{item.name}</Link></h5>
                                                                    <div className="tags">BNB</div>
                                                                </div>
                                                                <div className="meta-info">
                                                                    <div className="author">
                                                                        <div className="avatar">
                                                                            {!item.owner_profile || item.owner_profile == null || item.owner_profile == 'null' ?
                                                                                <img src="images/default-user-icon.png" alt="Owner Profile" />
                                                                                :
                                                                                <img src={config.imageUrl + item.owner_profile} alt="Owner Profile" />
                                                                            }
                                                                        </div>
                                                                        <div className="info">
                                                                            <span>Owner</span>
                                                                            <h6> <Link to="#">{item.owner_name}
                                                                            </Link> </h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="price">
                                                                        <span>Price</span>
                                                                        <h5>{item.price}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
            <CardModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Fragment>
    );
}
LiveAuction.propTypes = {
    data: PropTypes.array.isRequired,
}
export default LiveAuction;
