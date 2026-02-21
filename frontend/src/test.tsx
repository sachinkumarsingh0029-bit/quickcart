import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

function SellerProfile() {
  const { sellerId } = useParams();
  const seller = {
    id: 1,
    businessName: "ABC Inc.",
    businessEmail: "abc@example.com",
    businessNumber: "+1 (555) 555-5555",
    businessAddress: "123 Main St, Anytown, USA",
    profilePicture: "https://example.com/profile_picture.png",
    productListings: [
      {
        _id: 1,
        image: "",
        name: "Product 1",
        description: "This is product 1.",
        price: 9.99,
        imageUrl: "https://example.com/product1.png",
        rating: 4.5,

        numRatings: 10,
        numReviews: 5,
      },
      {
        id: 2,
        name: "Product 2",
        description: "This is product 2.",
        price: 19.99,
        imageUrl: "https://example.com/product2.png",
        rating: 3.5,
        numRatings: 5,
        numReviews: 2,
      },
      {
        id: 3,
        name: "Product 3",
        description: "This is product 3.",
        price: 29.99,
        imageUrl: "https://example.com/product3.png",
        rating: 5,
        numRatings: 20,
        numReviews: 15,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="flex items-center justify-center">
              <img
                src={seller.profilePicture}
                alt={`${seller.businessName}'s profile picture`}
                className="w-48 h-48 rounded-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
              {seller.businessName}
            </h2>
            <div className="flex items-center mt-2">
              <HiOutlineMail className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-2" />
              <a
                href={`mailto:${seller.businessEmail}`}
                className="text-gray-600 dark:text-gray-400"
              >
                {seller.businessEmail}
              </a>
            </div>
            <div className="flex items-center mt-2">
              <FaPhoneAlt className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">
                {seller.businessNumber}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <IoLocationOutline className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">
                {seller.businessAddress}
              </span>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Product Listings
            </h3>
            <ul>
              {seller.productListings.map((listing) => (
                <li
                  key={listing._id}
                  className="border-b border-gray-200 dark:border-gray-600 py-4"
                >
                  <div className="flex items-center">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h4
                        className="text

-lg font-bold text-gray-800 dark:text-white"
                      >
                        {listing.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {listing.description}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {listing.price}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;
