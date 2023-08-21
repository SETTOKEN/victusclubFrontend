import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { getAboutusAction } from '../Action/user.action';

const Aboutus = () => {
    const [aboutUs, setaboutUs] = useState({});

    useEffect(() => {
        getaboutUsAPI()
    }, []);

    const getaboutUsAPI = async () => {
        let res = await getAboutusAction();
        if (res.success) {
            setaboutUs(res.data);
        }
    }

    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">About us</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-login tf-section">
                <div className="themesflat-container container">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-inner">
                                <div style={{lineHeight : '22px'}}
                                    dangerouslySetInnerHTML={{ __html: aboutUs?.aboutus }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Aboutus;
