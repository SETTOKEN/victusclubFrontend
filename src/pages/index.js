import config from '../config'

import Home from "./Home";
import Marketplace from "./Marketplace";
import Login from "./Login";
import SignUp from "./SignUp";
import VerifyAccount from "./Login";
import ForgetPassword from "./ForgetPassword";
import Resetpassword from "./Resetpassword";
import Profile from "./Profile";
import CreateNFT from "./CreateNFT";
import Portfolio from "./Portfolio";
import EditNft from "./EditNft";
import NFTDetails from "./NFTDetails";
import TransactionList from "./TransactionList";
import BidsHistory from "./BidsHistory";
import TermsCondition from "./TermsCondition";
import PrivacyPolicy from "./PrivacyPolicy";
import ContactUs from "./ContactUs";
import FAQs from "./FAQ";
import Aboutus from './Aboutus';
import CreateCategory from './createCategory';
import Physicalrequest from './Physicalrequest';

const routes = [
  { path: `${config.baseUrl}`, component: <Home />},
  { path: `${config.baseUrl}marketplace`, component: <Marketplace />},
  { path: `${config.baseUrl}login` , component: <Login />},
  { path: `${config.baseUrl}sign-up`, component: <SignUp />},
  { path: `${config.baseUrl}verifyAccount/:token` , component: <VerifyAccount />},
  { path: `${config.baseUrl}forget-password` , component: <ForgetPassword />},
  { path: `${config.baseUrl}resetpassword/:token` , component: <Resetpassword />},
  { path: `${config.baseUrl}profile` , component: <Profile />},
  { path: `${config.baseUrl}create-nft` , component: <CreateNFT />}, 
  { path: `${config.baseUrl}portfolio` , component: <Portfolio />},    
  { path: `${config.baseUrl}edit-nft/:id` , component: <EditNft />},
  { path: `${config.baseUrl}nft-details/:id` , component: <NFTDetails />},
  { path: `${config.baseUrl}transactions-list` , component: <TransactionList />},
  { path: `${config.baseUrl}bids-history` , component: <BidsHistory />},
  { path: `${config.baseUrl}terms-condition` , component: <TermsCondition />},
  { path: `${config.baseUrl}privacy-policy` , component: <PrivacyPolicy />},    
  { path: `${config.baseUrl}contact-us` , component: <ContactUs />},
  { path: `${config.baseUrl}faqs` , component: <FAQs />},
  { path: `${config.baseUrl}aboutus` , component: <Aboutus />},
  { path: `${config.baseUrl}createcategory` , component: <CreateCategory />},
  { path: `${config.baseUrl}Physicalrequest` , component: <Physicalrequest />},
]

export default routes;