import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { termsConditionAction } from '../Action/user.action';

const TermsCondition = () => {
    const [termsCondition, settermsCondition] = useState({});

    useEffect(() => {
        termsConditionAPI()
    }, []);

    const termsConditionAPI = async () => {
        let res = await termsConditionAction();
        if (res.success) {
            settermsCondition(res.data);
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
                                <h1 className="heading text-center">Terms And Condition</h1>
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
                                    dangerouslySetInnerHTML={{ __html: termsCondition?.terms_conditions }}
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

export default TermsCondition;
