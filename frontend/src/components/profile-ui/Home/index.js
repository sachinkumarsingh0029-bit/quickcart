import React from 'react'
import RecentOrder from './recentOrders'
import GlimpseWishlist from './GlimpseWishlist'
import Recommendations from './Recommendations'
import SellerBanner from '../../landingPage-ui/SellerBanner'

const index = () => {
    return (
        <div>
            <RecentOrder />
            <GlimpseWishlist />
            <Recommendations />
            <div className='px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto mt-10 mb-10'>
                <SellerBanner />
            </div>
        </div>
    )
}

export default index