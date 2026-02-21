import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BanAccount from "./BanAccount";
import DeleteAccount from "./DeleteAccount";
import { getUser, updateProfileApi } from "../../../api/user";
import { CreateToast } from "../../../utils/Toast";
import FullPageLoading from "../../loading/FullPageLoading";
import UpdateRole from "./UpdateRole";

const UpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  // update role modal state
  const [updateRoleModal, setUpdateRoleModal] = useState(false);

  const { userId } = useParams();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    number: "",
    address: "",
    violationName: "",
    violationReason: "",
    role: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const result = await getUser(userId);
      const userData = result.user; // Assuming the user data is returned in the "data" field of the response object
      setFormData({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        number: userData.number,
        address: userData.address,
        violationName: "",
        violationReason: "",
        role: userData.role,
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (
      formData.username.trim() === "" ||
      formData.email.trim() === "" ||
      formData.violationName.trim() === "" ||
      formData.violationReason.trim() === ""
    ) {
      CreateToast("errorfieldempty", "Fill required fields", "error");
      return;
    }
    setLoading(true);
    try {
      const result = await updateProfileApi(userId, formData);
      if (result) {
        CreateToast("profileupdate", "Profile updated successfully", "success");
      }
      setLoading(false);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 lg:w-screen">
      {!loading ? (
        <div className="flex flex-wrap -mx-2 flex-col w-full">
          <div className="w-full md:w-1/2 px-2">
            <h2 className="text-lg font-medium mb-4">
              Profile Information - {userId}
            </h2>

            <div className="grid  gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="username"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Username<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  required
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Email Address<span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="address"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  name="address"
                  required
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                ></textarea>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="role"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  value={formData.number}
                  required
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="role"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Violation Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="violationName"
                  id="violationName"
                  value={formData.violationName}
                  required
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="role"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Violation Reason<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="violationReason"
                  id="violationReason"
                  value={formData.violationReason}
                  required
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-2 mt-10">
            <h2 className="text-lg font-medium mb-4">Security Settings</h2>

            <div className="flex">
              <div className="">
                <label
                  htmlFor="reset-password"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Update Role
                </label>
                <button
                  onClick={() => setUpdateRoleModal(true)}
                  className="inline-block bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-green"
                >
                  Update Role
                </button>
                <UpdateRole
                  isOpen={updateRoleModal}
                  closeModal={() => setUpdateRoleModal(false)}
                  userId={userId}
                  userRole={formData.role}
                />
              </div>
              <div className="pl-4">
                <label
                  htmlFor="reset-password"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Update Profile
                </label>
                <button
                  onClick={handleUpdateProfile}
                  className="inline-block bg-yellow-500 hover:bg-yellow-400 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-yellow"
                >
                  Update Profile
                </button>
              </div>
              <div className="pl-4">
                <label
                  htmlFor="reset-password"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Ban Account
                </label>
                <button
                  onClick={() => setIsOpen(true)}
                  className="inline-block bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                >
                  Ban Account
                </button>
              </div>
              <div className="pl-4">
                <label
                  htmlFor="reset-password"
                  className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                >
                  Delete Account
                </label>
                <button
                  onClick={() => setDeleteAccountModal(true)}
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-red"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          <BanAccount
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
            setLoading={setLoading}
            userId={userId}
          />
          <DeleteAccount
            isOpen={deleteAccountModal}
            closeModal={() => setDeleteAccountModal(false)}
            setLoading={setLoading}
            userId={userId}
          />
        </div>
      ) : (
        <>
          <FullPageLoading />
        </>
      )}
    </div>
  );
};

export default UpdateUser;
