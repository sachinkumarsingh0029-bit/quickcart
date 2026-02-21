import React, { useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { CreateToast } from "../../utils/Toast";
import { ResendVerificationMail, verifyApi } from "../../api/auth";
import { RootState } from "../../redux/rootReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateVerificationStatus } from "../../redux/user/userSlice";
import { ClipLoader } from "react-spinners";

function Verification() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const inputs = inputRefs.current;
    const input = inputs[index];

    if (event.key === "Backspace") {
      input.value = "";
      if (index !== 0) inputs[index - 1].focus();
    } else {
      if (
        index === inputs.length - 1 &&
        input.value !== "" &&
        event.key !== "Tab" // allow tabbing to next field if last field is filled
      ) {
        return true;
      } else if (
        event.key >= "0" &&
        event.key <= "9" // numeric keys
      ) {
        input.value = event.key;
        if (index !== inputs.length - 1) inputs[index + 1].focus();
        event.preventDefault();
      } else if (
        (event.key >= "A" && event.key <= "Z") ||
        (event.key >= "a" && event.key <= "z")
      ) {
        input.value = "";
        return false;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const code = inputRefs.current.map((input) => input.value).join("");
    verifyApi(code)
      .then((res) => {
        setLoading(false);
        CreateToast("Emailverified", "Email verified!", "success");
        dispatch(updateVerificationStatus({ verificationStatus: true }));
        navigate("/");
      })
      .catch((err) => {
        CreateToast("verifyInvalidcode", "Invalid code!", "error");
      });
    setLoading(false);
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
            name=""
            id=""
            maxLength={1}
            onKeyDown={(event) => handleKeyDown(i, event)}
            onChange={(event) => handleInputChange(i, event)}
          />
        </div>
      );
    }
    return inputs;
  };

  const handleResendEmail = () => {
    try {
      ResendVerificationMail();
      CreateToast("verifyResend", "Email sent!", "success");
    } catch (error) {}
  };

  if (!user.isAuthenticated) {
    return <Navigate to="/signin" />;
  } else if (user.user.verificationStatus) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-12">
        <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl dark:text-white">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400 dark:text-gray-300">
                <p>
                  We have sent a code to your email{" "}
                  {`${user.user.email?.substring(0, 2)}**@gmail.com`}
                </p>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row justify-center space-x-6">
                  {renderInputs()}
                </div>
                <div className="mt-12">
                  <button
                    className="w-full py-3 text-white bg-blue-700 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
                    onClick={(e) => handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <ClipLoader color="#fff" /> : <>Verify</>}
                  </button>
                </div>
              </form>
            </div>
            <button
              className="text-blue-500 hover:underline"
              style={{ marginTop: "5px" }}
              onClick={() => handleResendEmail()}
            >
              Resend email
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Verification;
