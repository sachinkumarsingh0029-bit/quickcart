import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveSeller,
  getAppliedSellerById,
  rejectSeller,
} from "../../api/seller";
import RejectSellerRequest from "./modal/RejectSeller";
import { CreateToast } from "../../utils/Toast";

const NewSellerDeatils = () => {
  const { newSellerId } = useParams();
  const [business, setBusiness] = React.useState<any>({
    _id: "615dddfc107e7dbfcc4068a9",
    businessName: "ABC Company",
    businessUsername: "abc_company",
    businessEmail: "contact@abccompany.com",
    businessNumber: "+1 (555) 555-5555",
    businessRegistrationNumber: "1234567890",
    businessType: "Technology",
    businessAddress: "123 Main Street, Suite 101",
    businessWebsite: "https://abccompany.com",
    taxIDNumber: "0987654321",
    productCategories: ["Software", "Hardware"],
    user: {
      _id: "615ddd93107e7dbfcc4068a8",
      email: "john@abccompany.com",
    },
    createdAt: "2021-10-06T18:14:52.789Z",
    updatedAt: "2021-10-06T18:14:52.789Z",
    __v: 0,
  });

  const fetchData = async () => {
    try {
      const result = await getAppliedSellerById(newSellerId);
      setBusiness(result.seller);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const {
    _id,
    username,
    email,
    verificationStatus,
    role,
    createdAt,
    updatedAt,
    seller,
    address,
    number,
    name,
  } = business.user;

  // seller reject modal
  const [isOpen, setIsOpen] = React.useState(false);
  const navitage = useNavigate();

  const onApprove = async () => {
    try {
      const result = await approveSeller(newSellerId);
      if (result.status === "success") {
        CreateToast("approveseller", result.message, "success");
        navitage("/sellerrequests");
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-xl font-semibold mb-4">Business Information</div>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">
            Business Name: {business.businessName}
          </h2>
          {business.status === "Pending" && (
            <div>
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Reject
              </button>
              <RejectSellerRequest
                isOpen={isOpen}
                closeModal={() => setIsOpen(false)}
                sellerId={newSellerId}
              />
            </div>
          )}
        </div>
        <p>
          <span className="font-bold">Business Email:</span>{" "}
          {business.businessEmail}
        </p>
        <p>
          <span className="font-bold">Business Number:</span>{" "}
          {business.businessNumber}
        </p>
        <p>
          <span className="font-bold">Business Name:</span>{" "}
          {business.businessName}
        </p>
        <p>
          <span className="font-bold">Business Username:</span>{" "}
          {business.businessUsername}
        </p>
        <p>
          <span className="font-bold">Business Registration Number:</span>{" "}
          {business.businessRegistrationNumber}
        </p>
        <p>
          <span className="font-bold">Business Type:</span>{" "}
          {business.businessType}
        </p>
        <p>
          <span className="font-bold">Business Address:</span>{" "}
          {business.businessAddress}
        </p>
        <p>
          <span className="font-bold">Business Website:</span>{" "}
          {business.businessWebsite}
        </p>
        <p>
          <span className="font-bold">Tax ID Number:</span>{" "}
          {business.taxIDNumber}
        </p>
        <p>
          <span className="font-bold">Product Categories:</span>{" "}
          {business.productCategories.join(", ")}
        </p>
        <p>
          <span className="font-bold">Created At:</span>{" "}
          {new Date(business?.createdAt).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            minute: "numeric",
            hour: "numeric",
            second: "numeric",
          })}
        </p>
        <p>
          <span className="font-bold">Updated At:</span>{" "}
          {new Date(business?.updatedAt).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            minute: "numeric",
            hour: "numeric",
            second: "numeric",
          })}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-xl font-semibold mb-4">User Information</div>
        <div className="mb-2">
          <label className="font-semibold">Name:</label>{" "}
          <span className="text-gray-700">{name}</span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Email:</label>{" "}
          <span className="text-gray-700">{email}</span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Phone Number:</label>{" "}
          <span className="text-gray-700">{number}</span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Address:</label>{" "}
          <span className="text-gray-700">{address}</span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Account Created:</label>{" "}
          <span className="text-gray-700">
            {new Date(createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              minute: "numeric",
              hour: "numeric",
              second: "numeric",
            })}
          </span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Last Updated:</label>{" "}
          <span className="text-gray-700">
            {new Date(updatedAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              minute: "numeric",
              hour: "numeric",
              second: "numeric",
            })}
          </span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">User Role:</label>{" "}
          <span className="text-gray-700">{role}</span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Verification Status:</label>{" "}
          <span
            className={`text-gray-700 ${
              verificationStatus ? "text-green-500" : "text-red-500"
            }`}
          >
            {verificationStatus ? "Verified" : "Not Verified"}
          </span>
        </div>
        <div className="mb-2">
          <label className="font-semibold">Username:</label>{" "}
          <span className="text-gray-700">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default NewSellerDeatils;
