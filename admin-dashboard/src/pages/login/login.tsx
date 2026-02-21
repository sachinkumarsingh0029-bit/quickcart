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
      console.log(response);
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
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
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
