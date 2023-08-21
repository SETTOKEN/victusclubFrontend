import React from 'react';
import { Link } from 'react-router-dom'
import icon1 from '../../assets/images/icon/Wallet.png'
import icon2 from '../../assets/images/icon/Category.png'
import icon3 from '../../assets/images/icon/Image2.png'
import icon4 from '../../assets/images/icon/Bookmark.png'

const Create = () => {
    const data = [
        {
            title: "Connect Your Metamask ",
            description: "Wallet that is functional for NFT purchasing. You may have a metamask account at this point, but very few are actually set up to buy an NFT.",
            icon: icon1,
            colorbg: "icon-color1"
        },
        {
            title: "Create Your Collection",
            description: "Create your NFT collection or sell real-life assets!!! This guide explains how to set up your first collection!",
            icon: icon2,
            colorbg: "icon-color2"
        },
        {
            title: "Add Your NFTs",
            description: "Once you have filled in the details of your NFT, simply select “Create” , After hitting “Create,” your file will upload, and the NFT will be created ",
            icon: icon3,
            colorbg: "icon-color3"
        },
        {
            title: "List Them For Sale",
            description: "Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs!",
            icon: icon4,
            colorbg: "icon-color4"
        },
    ]
    return (
        <section className="tf-box-icon create style1 tf-section">
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="heading-live-auctions mg-bt-22">
                            <h2 className="tf-title ">
                                How it Works</h2>
                        </div>
                        <div class="em_bar_bg"></div>
                    </div>
                    {
                        data.map((item, index) => (
                            <CreateItem key={index} item={item} />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}

const CreateItem = props => (
    <div className='col-lg-3 col-md-6 col-12 mb-5'>
        <div className="sc-box-icon">
            <div className="image">
                <div className={`icon-create icon ${props.item.colorbg}`}>
                    <img src={props.item.icon} alt="" />
                </div>
            </div>
            <h3 className="heading">{props.item.title}</h3>
            <p className="content">{props.item.description}</p>
        </div>
    </div>
)

export default Create;
