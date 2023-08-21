import { getRequest, postRequest, putRequest, deleteRequest, postRequestFormData } from "../coreFIles/helper";

export const LoginAction = (data) => {
   return postRequest('login', data).then(res => { return res.data })
}

export const RegisterAction = (data) => {
   return postRequest('userRegister', data).then(res => { return res.data })
}

export const ForgotPasswordAction = (data) => {
   return postRequest('forgotPassword', data).then(res => { return res.data })
}

export const ResetPasswordAction = (data) => {
   return postRequest('resetPassword', data).then(res => { return res.data })
}

export const UpdateProfileAction = (data) => {
   return postRequestFormData('UpdateUserProfile', data).then(res => { return res.data })
}

export const getCategoryAction = (data) => {
   return getRequest('getCategory', data).then(res => { return res.data })
}

export const getMarketplaceCategoryAction = (data) => {
   return getRequest('getMarketplaceCategory', data).then(res => { return res.data })
}

export const createNftAction = (data) => {
   return postRequest('createUserNFT', data).then(res => { return res.data })
}

export const createMetadataAction = (data) => {
   return postRequest('createMetadata', data).then(res => { return res.data })
}

export const getNFTListByUserAction = (data) => {
   return postRequest('getUsersNFTList', data).then(res => { return res.data })
}

export const getMarketplaceNFTsAction = (data) => {
   return postRequest('getMarketplaceNFTs', data).then(res => { return res.data })
}

export const putOnSaleAction = (data) => {
   return postRequest('putOnSaleAction', data).then(res => { return res.data })
}

export const cancelOrderAction = (data) => {
   return postRequest('cancelOrderAction', data).then(res => { return res.data })
}

export const getNftDetailsAction = (data) => {
   return postRequest('getNftDetailsById', data).then(res => { return res.data })
}

export const updateNftAction = (data) => {
   return postRequest('updateNft', data).then(res => { return res.data })
}
export const nftLikeDislikeAction = (data) => {
   return postRequest('nftLikeDislike', data).then(res => { return res.data })
}

export const getNftHistoryAction = (data) => {
   return postRequest('getNftHistory', data).then(res => { return res.data })
}

export const getHomePageNFTAction = (data) => {
   return postRequest('getHomePageNFT', data).then(res => { return res.data })
}

export const verifyAccountAction = (data) => {
   return postRequest('verifyAccount', data).then(res => { return res.data })
}

export const getProfileAction = (data) => {
   return postRequest('getUserProfile', data).then(res => { return res.data })
}

export const buyItemAction = (data) => {
   return postRequest('nftPurchase', data).then(res => { return res.data })
}

export const bidPlaceAPIAction = (data) => {
   return postRequest('insertBid', data).then(res => { return res.data })
}

export const getUserPurchaseAPIAction = (data) => {
   return postRequest('getUserPurchase', data).then(res => { return res.data })
}

export const getUserSaleDataAPIAction = (data) => {
   return postRequest('getUserSaleListing', data).then(res => { return res.data })
}

export const getUsertransactionsAPIAction = (data) => {
   return postRequest('getUserTransactions', data).then(res => { return res.data })
}

export const termsConditionAction = (data) => {
   return getRequest('getTermsConditionForUserpanel', data).then(res => { return res.data })
}

export const privacyPolicyAction = (data) => {
   return getRequest('getPrivacyPolicyForUserpanel', data).then(res => { return res.data })
}

export const ContactFormAction = (data) => {
   return postRequest('ContactFormRequest', data).then(res => { return res.data })
}

export const addNewsLetterAction = (data) => {
   return postRequest('addNewsLetter', data).then(res => { return res.data })
}

export const getSocialLinksAction = (data) => {
   return getRequest('getSocialLinksForUserpanel', data).then(res => { return res.data })
}

export const faqsAction = (data) => {
   return getRequest('faqsList', data).then(res => { return res.data })
}

export const getBidPlacedHistoryAction = (data) => {
   return postRequest('getUserBids', data).then(res => { return res.data })
}

export const getNftBidReceivedHistoryAPIAction = (data) => {
   return postRequest('myBidItem', data).then(res => { return res.data })
}

export const viewNftBidDetailsAction = (data) => {
   return postRequest('getBidDetail', data).then(res => { return res.data })
}

export const bidAcceptAction = (data) => {
   return postRequest('bidAccept', data).then(res => { return res.data })
}
export const getAboutusAction = (data) => {
   return getRequest('aboutUsList', data).then(res => {
      return res.data
   });
}
export const getNftTypeAction = (data) => {
   return getRequest('getNftType', data).then(res => {
      return res.data
   });
}
export const getCategoryShopPriceAction = (data) => {
   return getRequest('getCategoryShopPrice', data).then(res => { return res.data })
 }
export const PhysicalNftAction = (data) => {
   return postRequest('insertDetailsOfBuyerPhysicalNft', data).then(res => {
      return res.data
   });
}

export const updateStatusAction = (data) => {
   return postRequest('updateItemStatus', data).then(res => { return res.data })
}

export const getUserCategoryAction = (data) => {
   return postRequest('getusercategory', data).then(res => { return res.data })
}

export const InsertCategoryAction = (data) => {
   return postRequest('insertusercategory', data).then(res => { return res.data })
}

export const updateCategoryAction = (data) => {
   return postRequest('updatecategory', data).then(res => { return res.data })
}

export const getcategorybyidAction = (data) => {
   return postRequest('getusercategorybyid', data).then(res => { return res.data })
}


export const getPhysicalRequestAction = (data) => {
   return postRequest('getphysicalrequestlist', data).then(res => { return res.data })
}
export const approvePhysicalRequestAction = (data) => {
   return postRequest('approvephysicalrequest', data).then(res => { return res.data })
}
export const rejectPhysicalRequestAction = (data) => {
   return postRequest('rejectphysicalrequest', data).then(res => { return res.data })
}

export const userPhysicalRejectApproveAction = (data) => {
   return postRequest('userPhysicalRejectApprove', data).then(res => {
      return res.data
   });
}
export const deleteUserCategoryAction = (data) => {
   return postRequest("deleteusercategory", data).then((res) => {
     return res.data;
   });
 };