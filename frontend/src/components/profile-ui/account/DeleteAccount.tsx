import { useState } from "react";
import { deleteAccountApi } from "../../../api/auth";
import { CreateToast } from "../../../utils/Toast";
import { logoutSuccess } from "../../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function DeleteAccount({ isOpen, closeModal, setLoading }: any) {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // reset password
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const data = {
        password: password,
      };
      const result = await deleteAccountApi(data);
      if (result) {
        CreateToast("deleteaccount", "Account deleted successfully", "success");
        navigate("/");
        dispatch(logoutSuccess());
        closeModal();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 border-gray-800 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 text-black dark:text-white">
              <form onSubmit={handleDeleteAccount}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="Password"
                  >
                    Password
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="password"
                    id="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Enter your Password.</p>
                </div>

                <p className="text-sm text-red-500 mt-4">
                  Warning: If you delete this account, all associated data will
                  be permanently deleted and cannot be retrieved.
                </p>
                <div className="mt-5 sm:flex sm:items-center sm:justify-end">
                  <div className="sm:flex sm:items-center ">
                    <button
                      onClick={closeModal}
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md sm:w-auto sm:mt-0 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="fixed z-[-1] inset-0 bg-slate-400 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;
