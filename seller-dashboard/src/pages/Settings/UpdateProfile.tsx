import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/categories";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { deleteSellerProfile, updateSellerProfile } from "../../api/auth";
import {
  LoginSuccess,
  logoutSuccess as SellerlogoutSuccess,
} from "../../redux/seller/sellerSlice";
import { CreateToast } from "../../utils/Toast";
import { logoutSuccess } from "../../redux/user/userSlice";

const UpdateProfile = () => {
  const { seller } = useSelector((state: RootState) => state.seller);
  const [formData, setFormData] = useState({
    businessEmail: seller?.businessEmail || "",
    businessNumber: seller?.businessNumber || "",
    businessName: seller?.businessName || "",
    businessUsername: seller?.businessUsername || "",
    businessLogo: seller?.businessLogo || "",
    businessRegistrationNumber: seller?.businessRegistrationNumber || "",
    businessType: seller?.businessType || "",
    businessAddress: seller?.businessEmail || "",
    businessWebsite: seller?.businessWebsite || "",
    taxIDNumber: seller?.taxIDNumber || "",
    productCategories: seller?.productCategories || [],
  });
  const dispatch = useDispatch();

  function handleChange(event: any) {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  const handleCategoryChange = (event: any) => {
    const selectedValue = event.target.value;
    if (formData.productCategories.length < 5) {
      if (selectedValue !== "") {
        if (!formData.productCategories.includes(selectedValue)) {
          setFormData({
            ...formData,
            productCategories: [...formData.productCategories, selectedValue],
          });
        }
      }
    }
    event.target.value = "";
  };

  const handleRemoveCategory = (categoryToRemove: any) => {
    const updatedCategories = formData.productCategories.filter(
      (category) => category !== categoryToRemove
    );
    setFormData({
      ...formData,
      productCategories: updatedCategories,
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await updateSellerProfile(formData);
      dispatch(LoginSuccess(result.seller));
      console.log(result);
      CreateToast(
        "Profileupdatedsuccessfully",
        "Profile updated successfully",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  // handle delete profile
  const handleDeleteProfile = async () => {
    try {
      const result = await deleteSellerProfile();
      if (result.status === "success") {
        CreateToast(
          "Profiledeletedsuccessfully",
          "Profile deleted successfully",
          "success"
        );
        dispatch(SellerlogoutSuccess());
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 lg:w-screen mt-10">
      <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>
      <div className="flex flex-wrap -mx-2 flex-col w-full">
        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-lg font-medium mb-4">Profile Information</h2>
          <div className="grid  gap-4 grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessUsername"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="businessUsername"
                onChange={handleChange}
                value={formData.businessUsername}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessRegistrationNumber"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Registration Number
              </label>
              <input
                type="text"
                name="businessRegistrationNumber"
                onChange={handleChange}
                value={formData.businessRegistrationNumber}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessEmail"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Email
              </label>
              <input
                type="text"
                name="businessEmail"
                onChange={handleChange}
                value={formData.businessEmail}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessNumber"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Number
              </label>
              <input
                type="text"
                name="businessNumber"
                onChange={handleChange}
                value={formData.businessNumber}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessName"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                onChange={handleChange}
                value={formData.businessName}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessLogo"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Logo
              </label>
              <input
                type="url"
                name="businessLogo"
                onChange={handleChange}
                required
                value={formData.businessLogo}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="grid grid-cols-1">
              <label
                htmlFor="categories"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Business Type
              </label>
              <select
                id="categories"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                name="businessType"
                defaultValue={formData.businessType}
                onChange={handleChange}
              >
                <option defaultValue="Retail">Retail</option>
                <option defaultValue="Wholesale">Wholesale</option>
                <option defaultValue="Manufacturing">Manufacturing</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessWebsite"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Website
              </label>
              <input
                type="url"
                name="businessWebsite"
                onChange={handleChange}
                required
                value={formData.businessWebsite}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="taxIDNumber"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                GSTIN Number
              </label>
              <input
                type="url"
                name="taxIDNumber"
                onChange={handleChange}
                required
                value={formData.taxIDNumber}
                id="username"
                className="w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="businessAddress"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Business Address
              </label>
              <textarea
                id="businessAddress"
                className="border border-gray-300 rounded-md p-2 w-full h-35 resize-none"
                required
                minLength={10}
                placeholder="Enter Address"
                defaultValue={formData.businessAddress}
                onChange={handleChange}
                name="businessAddress"
              ></textarea>
            </div>
          </div>
          <div className="my-4">
            <label
              htmlFor="categories"
              className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
            >
              Product Categories(max 5)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-full sm:w-auto flex-grow-0">
                <input
                  type="text"
                  id="categories"
                  placeholder="Add a category"
                  onChange={handleCategoryChange}
                  list="category-list"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <datalist id="category-list">
                  {categories.map((category, index) => (
                    <option key={index} value={category.label}>
                      {category.label}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <ul className="flex flex-wrap gap-2">
                  {formData.productCategories.map((category, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1"
                    >
                      <span className="text-gray-700 dark:text-gray-400">
                        {category}
                      </span>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-2 rounded-md bg-red-500 text-white hover:bg-red-600 px-2 py-1 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2 mt-4">
          <h2 className="text-lg font-medium mb-2">Profile Settings</h2>

          <div className="flex">
            <div className="">
              <label
                htmlFor="reset-password"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Update Profile
              </label>
              <span
                onClick={handleSubmit}
                className="cursor-pointer inline-block bg-yellow-500 hover:bg-yellow-400 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-yellow"
              >
                Update Profile
              </span>
            </div>
            <div className="pl-4">
              <label
                htmlFor="reset-password"
                className="cursor-pointer block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Delete Account
              </label>
              <span
                onClick={handleDeleteProfile}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-red"
              >
                Delete Account
              </span>
            </div>
          </div>
          <p className="text-sm text-red-500 mt-4">
            Warning: If you delete this account, all associated data will be
            permanently deleted and cannot be retrieved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
