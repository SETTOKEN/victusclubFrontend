import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import comingSoon from '../assets/images/team/coming.gif';
import { Accordion } from 'react-bootstrap-accordion'
import { getMarketplaceNFTsAction, getMarketplaceCategoryAction, nftLikeDislikeAction } from '../Action/user.action';
import config from '../config';
import Countdown, { zeroPad } from 'react-countdown';

import Cookies from 'js-cookie';
import $ from 'jquery';
import toast, { Toaster } from 'react-hot-toast';
const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));

const Marketplace = () => {
    const [visible, setVisible] = useState(6);
    const [NFTList, setNFTList] = useState([]);
    const [marketplaceNFTList, setmarketplaceNFTList] = useState([]);
    const [Category, setCategory] = useState([]);
    const [CategoryIdsFilters, setCategoryIdsFilters] = useState([]);
    const [PriceFilterData, setPriceFilterData] = useState([]);
    const [NFTTypeData, setNFTTypeData] = useState([]);
    const [searchFilter, setSearchFilter] = useState([]);
    const ref = useRef(null);
    useEffect(async () => {
        getNFTListAPI();
        getCategoryAPI();
    }, []);

    const handleClick = () => {
        window.location.reload();
    };

    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 6);
    }

    const getNFTListAPI = async () => {
        let res = await getMarketplaceNFTsAction({ 'user_id': loginData?.id, 'category_ids': [], 'nft_type': '', 'price_type': '' , 'search_type' : ''});
        if (res.success) {
            setNFTList(res.data);
            setmarketplaceNFTList(res.data);
        }
    }

    const getCategoryAPI = async () => {
        let res = await getMarketplaceCategoryAction();
        if (res.success) {
            setCategory(res.data)
        }
    }

    const nftLike = async (type, item_id) => {
        let res = await nftLikeDislikeAction({ 'type': type, 'item_id': item_id });
        if (res.success) {
            getNFTListAPI();
        }
    }

    const CategoryFilter = async () => {
        let categoryIds = []
        // setNFTList([]);
        $("input[name='category_id[]']:checked").each(function () {
            categoryIds.push(parseInt($(this).val()));
        });

        const catidsArray = categoryIds.filter(function (value) {
            return !Number.isNaN(value);
        });

        setCategoryIdsFilters(catidsArray);
        if (catidsArray.length > 0) {
            let res = await getMarketplaceNFTsAction({ 'user_id': loginData?.id, 'category_ids': catidsArray, 'nft_type': NFTTypeData, 'search_type':searchFilter, 'price_type': PriceFilterData });
            if (res.success) {
                if (res.data.length > 0) {
                    setNFTList(res.data);
                } else {
                    setNFTList([]);
                }
            } else {
                setNFTList([]);
            }
        } else {
            setNFTList(marketplaceNFTList);
        }
    }

    const PriceFilter = async (type) => {
        setPriceFilterData(type);
        let res = await getMarketplaceNFTsAction({ 'user_id': loginData?.id, 'price_type': type, 'nft_type': NFTTypeData, 'category_ids': CategoryIdsFilters });
        if (res.success) {
            if (res.data.length > 0) {
                setNFTList(res.data);
            } else {
                setNFTList([]);
            }
        } else {
            setNFTList([]);
        }
    }

    const NFTTypeFilter = async (type) => {
        setNFTList([]);
        setNFTTypeData(type)
        let res = await getMarketplaceNFTsAction({ 'user_id': loginData?.id, 'nft_type': type, 'price_type': PriceFilterData, 'category_ids': CategoryIdsFilters });
        if (res.success) {
            setNFTList(res.data);
        }
    }

    const searchNFT = async (type) => {
        setSearchFilter(type);
        console.log(type, "search_type")
        let res = await getMarketplaceNFTsAction({ 'user_id': loginData?.id,  'search_type': type , 'category_ids': CategoryIdsFilters });
       console.log("res" , res)
        if (res.success) {
            if (res.data.length > 0) {
                setNFTList(res.data);
            } else {
                setNFTList([]);
            }
        } else {
            setNFTList([]);
        }
    }

    // const searchNFT = (e) => {
    //     const { value } = e.target;
    //     var regex = new RegExp(value.toUpperCase());
    //     const searchData = setNFTList.filter(item => (item.name == null ? '' : item.name.toUpperCase().match(regex)) || item.description.toUpperCase().match(regex));
    //     if (searchData.length > 0) {
    //         setSearchData(searchData)
    //     } else {
    //         setSearchData([])
    //     }
    //     console.log(searchData)
    // }
    return (
        <div>
            <Toaster />
            <Header />
            <section className="flat-title-page inner" >
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Marketplace</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-explore tf-section" style={{ paddingTop: "30px" }}>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-12">
                            <div id="side-bar" className="side-bar style-3">
                                <div className="widget widget-category mgbt-24 boder-bt" key="1">
                                    <div className="content-wg-category">
                                        <Accordion title="Category" show={true}>
                                            <form action="#">
                                                <div key="1">
                                                    {Category.map((categoryList) => (
                                                        <>
                                                            <label>{categoryList.name }
                                                                <input onClick={() => CategoryFilter()} type="checkbox" name='category_id[]' value={categoryList.id} />
                                                                <span className="btn-checkbox"></span>
                                                            </label><br />
                                                        </>
                                                    ))}
                                                </div>
                                            </form>
                                        </Accordion>
                                        <Accordion title="Price" show={true}>
                                            <form action="#">
                                                <div key="2">
                                                    <label>Price: Low to high
                                                        <input onClick={() => PriceFilter('lowtohigh')} type="radio" name='price_type' value="lowtohigh" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                    <label>Price: High to low
                                                        <input onClick={() => PriceFilter('hightolow')} type="radio" name='price_type' value="hightolow" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                    <label>Newest
                                                        <input onClick={() => PriceFilter('newest')} type="radio" name='price_type' value="newest" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                    <label>Oldest
                                                        <input onClick={() => PriceFilter('oldest')} type="radio" name='price_type' value="oldest" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                </div>
                                            </form>
                                        </Accordion>
                                        <Accordion title="NFT Type" show={true}>
                                            <form action="#">
                                                <div key="2">
                                                    <label>Price
                                                        <input onClick={() => NFTTypeFilter('1')} type="radio" name='nft_type' value="1" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                    <label>Auction
                                                        <input onClick={() => NFTTypeFilter('2')} type="radio" name='nft_type' value="2" />
                                                        <span className="btn-checkbox"></span>
                                                    </label><br />
                                                </div>
                                            </form>
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-9 col-lg-9 col-md-12">
                            <div className='row'>
                                <div className='col-lg-3'>
                                    <div className="search-box mb-3">
                                        <input type="search" className='search' onChange={(e) => searchNFT(e.target.value)} name='search_type' placeholder="Search NFT" />
                                    </div>
                                </div>
                                <div className='col-lg-9'>
                                    <div className='text-right mb-5' style={{ marginRight: "20px" }}>
                                        <button onClick={handleClick}>Reset Data</button>
                                    </div>
                                </div>
                            </div>
                            <Fragment>
                                <div className='explore mt-3'>
                                    <div className="box-epxlore">
                                        {/* {NFTList.length == 0 ?
                                            <>
                                                <h4>No data found!!!</h4>
                                            </>
                                            : */}

                                        {NFTList.slice(0, visible).map((item, index) => (
                                            <div className={`sc-card-product explode style2 mg-bt`} >
                                                <div className="card-media">
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
                                                    {loginData?.id ?
                                                        <Link to="#" onClick={() => nftLike(item.isLike ? item.isLike : '0', item.id)} className="wishlist-button">
                                                            <i class="fa fa-heart" style={{ color: item.isLike ? 'red' : '' }} aria-hidden="true"></i> <span className="number-like">{item.itemLike}</span>
                                                        </Link>
                                                        :
                                                        <Link to={`${config.baseUrl}login`} className="wishlist-button heart">
                                                            <span className="number-like">{item.itemLike}</span>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className='countdown-timer'>
                                                    {item.sell_type == 1 ?
                                                        '' :
                                                        <>
                                                            <h5>Sale Start:</h5>
                                                            <div className="timer2">
                                                                {item.start_date}
                                                                {/* {console.log(item.start_date)} */}
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                                <div className='countdown-timer'>
                                                    {item.sell_type == 1 ?
                                                        '' :
                                                        <>
                                                            <h5>Sale End:</h5>
                                                            <div className="timer2">
                                                                {item.expiry_date}
                                                                {/* <Countdown
                                                                    date={getTimeOfStartDate(item.expiry_date)}
                                                                    renderer={CountdownTimer}
                                                                /> */}
                                                                {console.log(item.expiry_date)}
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                                <div className="card-title">
                                                    <h5><Link to={`${config.baseUrl}nft-details/` + item.id}>{item.name}</Link></h5>
                                                </div>
                                                <div className="meta-info">
                                                    <div className="author">
                                                        <div className="avatar">
                                                            {!item.owner_profile || item.owner_profile == 'null' || item.owner_profile == null ?
                                                                <img src="images/default-user-icon.jpg" alt="Owner Profile" />
                                                                :
                                                                <img src={config.imageUrl + item?.owner_profile} alt="Owner Profile" />
                                                            }
                                                        </div>
                                                        <div className="info">
                                                            <span>Owner</span>
                                                            <h6> {item.owner_name} </h6>
                                                        </div>
                                                    </div>
                                                    <div className="tags">BNB</div>
                                                </div>
                                                <div className="card-bottom style-explode">
                                                    <div className="price">
                                                        <span>Price</span>
                                                        <div className="price-details">
                                                            <h5>{item.price} BNB</h5>
                                                        </div>
                                                    </div>
                                                    <div className='view'>
                                                        <Link to={`${config.baseUrl}nft-details/` + item.id} className="view-history reload">View History</Link>
                                                    </div>
                                                </div>

                                            </div>))}
                                        {/* ))} */}
                                    </div>
                                    {
                                        visible < NFTList.length &&
                                        <div className="btn-auction center">
                                            <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></Link>
                                        </div>
                                    }
                                </div>
                            </Fragment>
                        </div>
                    </div>
                </div >
            </div >
            <Footer />
        </div >
    );
}

export default Marketplace;
