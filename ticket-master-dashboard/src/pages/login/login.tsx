import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { signInApi } from "../../api/auth";
import { loginSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signInApi(email, password);
      dispatch(loginSuccess(response.data));
    } catch (err) {}
    setLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  } else {
    return (
      <div className="h-screen flex items-center">
        <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-center mx-auto">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-gray-800 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-800 dark:text-gray-200"
                >
                  Password
                </label>
              </div>

              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                value={password}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                {loading ? <BeatLoader color="#fff" /> : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Login;
