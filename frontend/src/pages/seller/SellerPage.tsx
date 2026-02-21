import React, { useEffect, useState } from "react";
import { AiFillMail } from "react-icons/ai";
import { BiPhoneCall, BiWorld } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { getSellerProfileAndProducts } from "../../api/seller";

function SellerPage() {
  const { username } = useParams();
  const [seller, setSeller] = useState<any>();
  const navigate = useNavigate();

  async function getSellerDetails() {
    const response = await getSellerProfileAndProducts({ username });
    console.log(response.data.seller);

    setSeller(response.data.seller);
    return response.data.seller;
  }

  useEffect(() => {
    try {
      getSellerDetails();
    } catch (err) {
      console.log("Not found");
    }
  }, []);

  return seller ? (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-800">
      <div className="flex mb-4 items-center">
        <img
          src={seller?.businessLogo}
          alt={seller.businessName}
          className="w-20 h-20 rounded-full object-cover mr-4 shadow-md"
        />
        <div>
          <h2 className="text-2xl font-medium text-gray-800 dark:text-white">
            {seller?.businessName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {seller?.businessType}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {seller?.businessAddress}
          </p>
          <div className={`flex items-center mt-3`}>
            <p className="text-blue-500 text-lg hover:text-blue-700">
              <BiPhoneCall className="text-xl mr-2" />
            </p>
            <a
              href={`mailto:${seller?.businessEmail}`}
              className="text-blue-500 text-lg hover:text-blue-700 ml-4"
            >
              <AiFillMail className="text-xl mr-2" />
            </a>
            <a
              href={seller?.businessWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-lg hover:text-blue-700 ml-4"
            >
              <BiWorld className="text-xl mr-2" />
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {seller?.productListings?.map((product: any) => (
          <div
            key={product?._id}
            className="border rounded-md p-4 mb-4 dark:border-gray-600"
          >
            <img
              src={product?.thumbnailUrl}
              alt={product?.productName}
              className="mb-4 rounded-md object-cover w-full h-48 shadow-md cursor-pointer"
              onClick={() => navigate(`/product?query=${product._id}`)}
            />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              {product?.productName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {product?.productDescription}
            </p>
            {product.isAvailable ? (
              <div className="flex justify-between items-center mt-4">
                {product?.discountedPrice !== 0 ? (
                  <div className="mt-1 flex items-end">
                    <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                      ₹{product.price}
                    </p>
                    <p className="text-md font-medium text-gray-900 dark:text-white">
                      &nbsp;&nbsp;₹{product.discountedPrice}
                    </p>
                    &nbsp;&nbsp;
                    <p className="text-sm font-medium text-green-500">
                      ₹{product.price - product.discountedPrice}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    ₹{product.price}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {product.category}
                </p>
              </div>
            ) : (
              <p className="text-red-500 font-medium mt-4">Out of stock</p>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>No seller found</div>
  );
}

export default SellerPage;
