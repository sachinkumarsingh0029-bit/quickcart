import instance from "../../utils/Axios";

// get transaction data by user
export const getAdmins = async () => {
  const response = await instance.get(`/superadmin/admin/admins`);
  return response.data;
};

// get super admins
export const getSuperAdmins = async () => {
  const response = await instance.get(`/root/superadmins`);
  return response.data;
};
