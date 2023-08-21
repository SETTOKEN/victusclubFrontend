import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LiveAuction from '../components/layouts/LiveAuction';
import TodayPicks from '../components/layouts/TodayPicks';
import Create from '../components/layouts/Create';
import { getHomePageNFTAction } from '../Action/user.action';
import Ourteam from './Ourteam';
import Settoken from './Settoken';
import Banner from './Banner';
import CookieConsent from "react-cookie-consent";
const Home01 = () => {
    const [NFTList, setNFTDetails] = useState([]);
    useEffect(async () => {
        getNFTListAPI();
    }, []);
    const getNFTListAPI = async () => {
        let res = await getHomePageNFTAction();
        if (res.success) {
            setNFTDetails(res.data);
        }
    }

    return (
        <div className='home-1'>
            {/* <CookieConsent debug={true}>This victus token site uses cookies.</CookieConsent> */}
            <CookieConsent

                buttonText="Accept"
                cookieName="cookieName"
                declineCookieValue={false}
                style={{ background: "linear-gradient(45deg, black, #d9a243)", boxShadow: "0px 0px 4px 0px #ffa11e" }}
                buttonStyle={{ background: "#f5f5f5", color: "black", fontSize: "13px", borderRadius: "10px", padding: "10px 10px " }}
                // declineButtonStyle={{background:"#cfcfcf", color: "black", fontSize: "13px"}}
                expires={150}> This victus token site uses cookies.
            </CookieConsent>
            <Header />
            <Banner />
            <Settoken />
            <LiveAuction data={NFTList} />
            <TodayPicks data={NFTList} />
            <Ourteam />
            <Create />
            <Footer />
        </div>
    );
}

export default Home01;
