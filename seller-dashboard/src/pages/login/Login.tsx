import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import { login } from "../../api/auth";
import { CreateToast } from "../../utils/Toast";
import { loginSuccess } from "../../redux/user/userSlice";
import { LoginSuccess as sellerLoginSuccess } from "../../redux/seller/sellerSlice";
import instance from "../../utils/Axios";

const Login = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  function isValidEmail(email: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function checkEmail() {
    if (!isValidEmail(email || "")) {
      CreateToast("InvalidEmail", "Invalid email address", "error");
      navigate("/error");
      return;
    }
    try {
      const response = await instance.get(`/seller/checkloginstatus/${email}`);
      // If status is deny, show message and navigate to error
      if (response.data.status === "deny") {
        const message = response.data.message || "Access denied. Please login through the regular login page first to receive a login code.";
        CreateToast("AccessDenied", message, "error");
        navigate("/error");
        return;
      }
      // If status is allow, continue (don't navigate)
      if (response.data.status === "allow") {
        return;
      }
      // If no status or unexpected response, navigate to error
      CreateToast("UnexpectedResponse", "Unexpected response from server", "error");
      navigate("/error");
    } catch (error: any) {
      console.error("Error checking login status:", error);
      // Handle different error cases
      if (error.response?.data?.status === "deny") {
        const message = error.response.data.message || "Access denied";
        CreateToast("AccessDenied", message, "error");
        navigate("/error");
      } else if (error.response?.status === 412) {
        CreateToast("AccessDenied", "Access denied", "error");
        navigate("/error");
      } else if (error.response?.status === 404) {
        CreateToast("SellerNotFound", "Seller not found with this email address", "error");
        navigate("/error");
      } else {
        // For network errors, show a helpful message
        CreateToast("NetworkError", "Unable to check login status. Please try again.", "error");
        console.error("Unexpected error:", error);
        navigate("/error");
      }
    }
  }

  const [password, setPassword] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const inputs = inputRefs.current;
    const input = inputs[index];

    switch (event.key) {
      case "Backspace": {
        if (input.value === "") {
          if (index !== 0) {
            inputs[index - 1].focus();
          }
        } else {
          input.value = "";
        }
        break;
      }
      case "Tab": {
        if (index === inputs.length - 1 && input.value !== "") {
          return true;
        }
        break;
      }
      default: {
        if (event.key >= "0" && event.key <= "9") {
          input.value = event.key;
          if (index !== inputs.length - 1) {
            inputs[index + 1].focus();
          }
          event.preventDefault();
        } else if (
          (event.key >= "A" && event.key <= "Z") ||
          (event.key >= "a" && event.key <= "z")
        ) {
          return false;
        }
        break;
      }
    }
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = inputRefs.current[index];
    if (!/^[0-9]+$/.test(event.target.value)) {
      input.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = inputRefs.current.map((input) => input.value).join("");
    console.log(code);
    // submit code to server for validation
    const data = {
      code,
      password,
      email,
    };
    try {
      const result = await login(data);
      if (result !== undefined) {
        CreateToast("login", "Login Success", "success");
        console.log(result);
        console.log(result.seller);
        dispatch(loginSuccess({ user: result.user }));
        dispatch(sellerLoginSuccess(result.seller));
        // navigate to dashboard
        navigate("/", { replace: true });
      }
      if (result === undefined) {
        CreateToast("login", "Login Failed", "error");
      }
    } catch {}
  };

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const inputs = inputRefs.current;
    const pastedText = event.clipboardData.getData("text/plain");
    if (pastedText.length !== 4) {
      // Don't paste if the text is not exactly four characters
      return;
    }
    for (let i = 0; i < 4; i++) {
      inputs[i].value = pastedText[i] ?? "";
    }
    event.preventDefault();
    // Move focus to the next input field
    if (index !== inputs.length - 1) inputs[index + 1].focus();
    passwordInputRef.current?.focus();
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < 4; i++) {
      inputs.push(
        <div key={i} className="w-16 h-16 ">
          <input
            ref={(ref) => (inputRefs.current[i] = ref as HTMLInputElement)}
            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border dark:border-gray-700 text-lg bg-white dark:bg-gray-900 dark:text-white focus:bg-gray-50 focus:ring-1 ring-blue-700 dark:ring-blue-500"
            type="text"
            name="twostep"
            id="twostep"
            maxLength={1}
            onKeyDown={(event) => handleKeyDown(i, event)}
            onChange={(event) => handleInputChange(i, event)}
            onPaste={(e) => handlePaste(i, e)}
            required
          />
        </div>
      );
    }
    return inputs;
  };

  useEffect(() => {
    checkEmail();
    inputRefs.current[0].focus();
  }, []);

  if (state.user.isAuthenticated && state.seller.seller) {
    return <Navigate to={"/"} replace />;
  } else {
    return (
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-12">
        <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-10">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl dark:text-white">
                <p>Two factor Authentication</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400 dark:text-gray-300">
                <p>
                  We have sent a code to your email{" "}
                  {`${email?.substring(0, 2)}**@gmail.com`}
                </p>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row justify-center space-x-6">
                  {renderInputs()}
                </div>
                <div className="flex flex-row justify-center space-x-6">
                  <div className="grid w-full max-w-sm items-center gap-1.5 mt-10">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      password
                    </label>
                    <input
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                      type="password"
                      id="email"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      ref={passwordInputRef}
                    />
                    <p className="text-sm text-gray-500">
                      Enter your password.
                    </p>
                  </div>
                </div>
                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full py-3 text-white bg-blue-700 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
                  >
                    Verify
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

export default Login;
