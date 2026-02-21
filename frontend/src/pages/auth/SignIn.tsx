import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas";
import { signInApi } from "../../api/auth";
import { errorClass, noErrorClass } from "../../utils/StyleClasses";
import { CreateToast } from "../../utils/Toast";
import { ClipLoader } from "react-spinners";
import { forgotPasswordApi } from "../../api/auth";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isValid,
    setFieldError,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      try {
        setLoading(true);
        const response = await signInApi(values.email, values.password);
        if (response.data.role === "seller") {
          CreateToast("loginasseller", response.data.message, "info");
          setLoading(false);
        }
        console.log(response);
        delete response.data.user.role;
        dispatch(loginSuccess(response.data));
        if (!response.data.user.verificationStatus) {
          setLoading(false);
          navigate("/verification");
        } else {
          setLoading(false);
          CreateToast("loginsuccessfully", "Logged in successfully", "success");
          navigate("/");
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
  });

  const resetPassword = async () => {
    if (errors.email) {
      setFieldError("email", "Please enter a valid email address");
    } else {
      setLoading(true);
      const data = {
        email: values.email,
      };
      try {
        const result = await forgotPasswordApi(data);
        if (result.status === "success") {
          setLoading(false);
          CreateToast("resetpassword", result.message, "success");
          setLoading(false);
        }
      } catch (err) {
        setLoading(false)
      }
    }
  };

  const emailInputRef = useRef<any>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to={"/shop"} replace />;
  } else {
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-screen relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
              <img
                className="object-cover object-top w-full h-full"
                src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

            <div className="relative">
              <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                <h3 className="text-4xl font-bold text-white">
                  Enhancing User Experience for an E-commerce Website
                </h3>
                <ul className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-gradient-primary rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Intuitive Navigation{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-gradient-primary rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Responsive Design{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-gradient-primary rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Streamlined Checkout{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-gradient-primary rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Personalization Engine{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 sm:py-16 lg:py-24 bg-white dark:bg-gray-900">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 className="text-3xl font-bold leading-tight text-gray dark:text-white sm:text-4xl">
                Sign in
              </h2>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{" "}
                <span
                  title=""
                  className="font-medium text-primary-600 dark:text-primary-400 transition-all duration-200 hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus:text-primary-700 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Create a free account
                </span>
              </p>

              <form className="mt-8" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor=""
                      className="text-base font-medium text-gray-900 dark:text-gray-200"
                    >
                      {" "}
                      Email address{" "}
                      {errors.email && touched.email ? (
                        <span className="text-red-500 text-sm font-sm">
                          ({errors.email})
                        </span>
                      ) : null}
                    </label>
                    <div className="mt-2.5">
                      <input
                        className={`flex h-12 w-full rounded-lg border-2 bg-white dark:bg-gray-800 py-2 px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50 transition-all duration-300 ${
                          (values.email && errors.email) !== "" &&
                          (errors.email ? errorClass : noErrorClass)
                        }`}
                        type="email"
                        placeholder="Email"
                        name="email"
                        ref={emailInputRef}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="flex items-center justify-between w-full text-base font-medium text-gray-900 dark:text-gray-200"
                      >
                        <div className="to-inherit">
                          Password{" "}
                          {errors.password && touched.password ? (
                            <span className="text-red-500 text-sm font-sm">
                              ({errors.password})
                            </span>
                          ) : null}
                        </div>
                        <span
                          onClick={resetPassword}
                          title=""
                          className="cursor-pointer text-xs text-black hover:underline"
                        >
                          {" "}
                          Forgot password?{" "}
                        </span>
                      </label>
                    </div>

                    <div className="relative flex items-center mt-2">
                      <div
                        className={`absolute right-0 rtl:left-0 rtl:right-auto`}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                        >
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path
                            fill-rule="evenodd"
                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-black-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white ${
                          (values.password && errors.password) !== "" &&
                          (errors.password ? errorClass : noErrorClass)
                        }`}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-primary px-3.5 py-2.5 text-base font-bold leading-7 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <ClipLoader color="#fff" />
                      ) : (
                        <>
                          Get started
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default Login;
