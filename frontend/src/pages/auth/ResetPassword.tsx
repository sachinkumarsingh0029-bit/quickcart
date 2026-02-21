import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import instance from "../../utils/Axios";

import { resetPasswordApi } from "../../api/auth/index";
import { CreateToast } from "../../utils/Toast";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const state = useSelector((state: RootState) => state);
  const navigate = useNavigate();

  async function checkToken() {
    const resetTokenPattern =
      /^resetpassword_[a-zA-Z0-9]+_[a-zA-Z0-9-]+_[a-zA-Z0-9-]+[0-9]/;

    if (!resetTokenPattern.test(resetToken || "")) {
      navigate("/signin");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      newPassword: password,
      resetToken: resetToken,
    };
    try {
      const result = await resetPasswordApi(data);
      if (result.status === "success") {
        CreateToast("resetpasswordcomplete", result.message, "success");
        navigate("/signin");
      }
    } catch (error) {
      navigate("/signin");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (state.user.isAuthenticated) {
    return <Navigate to={"/"} replace />;
  } else {
    return (
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-12">
        <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl dark:text-white">
                <p>Reset Password</p>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row justify-center space-x-6">
                  <div className="grid w-full max-w-sm items-center gap-1.5 mt-10">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      New Password
                    </label>
                    <input
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                      type="password"
                      id="email"
                      placeholder="********"
                      value={password}
                      minLength={6} // Add minLength attribute to enforce a minimum length of 6 characters
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">Enter new password.</p>
                  </div>
                </div>
                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full py-3 text-white bg-gradient-primary rounded-xl hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 font-bold"
                  >
                    Change password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ResetPassword;
