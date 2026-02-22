import React, { useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { CreateToast } from "../../utils/Toast";
import { ResendVerificationMail, verifyApi } from "../../api/auth";
import { RootState } from "../../redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { updateVerificationStatus } from "../../redux/user/userSlice";
import { ClipLoader } from "react-spinners";

function Verification() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = inputRefs.current.map((input) => input?.value).join("");

    if (code.length !== 4) {
      CreateToast("verifyInvalidcode", "Enter complete OTP!", "error");
      return;
    }

    try {
      setLoading(true);
      await verifyApi(code);

      CreateToast("Emailverified", "Email verified!", "success");
      dispatch(updateVerificationStatus({ verificationStatus: true }));
      navigate("/shop");
    } catch (err) {
      CreateToast("verifyInvalidcode", "Invalid code!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      if (!user?.user?.email) {
        CreateToast("verifyResendError", "Email not found!", "error");
        return;
      }

      setResendLoading(true);

      // ✅ FIXED LINE (IMPORTANT)
      await ResendVerificationMail(user.user.email);

      CreateToast("verifyResend", "Email sent successfully!", "success");
    } catch (error) {
      CreateToast("verifyResendError", "Failed to resend email!", "error");
    } finally {
      setResendLoading(false);
    }
  };

  const renderInputs = () => {
    return [0, 1, 2, 3].map((i) => (
      <div key={i} className="w-16 h-16">
        <input
          ref={(ref) => (inputRefs.current[i] = ref as HTMLInputElement)}
          className="w-full h-full text-center outline-none rounded-xl border dark:border-gray-700 text-lg bg-white dark:bg-gray-900 dark:text-white focus:ring-1 ring-blue-700"
          type="text"
          maxLength={1}
        />
      </div>
    ));
  };

  if (!user.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (user.user.verificationStatus) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gray-50 dark:bg-gray-900 py-12">
      <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold dark:text-white">
              Email Verification
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-300 mt-2">
              Code sent to {user.user.email}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-6">
              {renderInputs()}
            </div>

            <div className="mt-12">
              <button
                type="submit"
                className="w-full py-3 text-white bg-blue-700 rounded-xl hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? <ClipLoader color="#fff" /> : "Verify"}
              </button>
            </div>
          </form>

          <button
            className="text-blue-500 hover:underline"
            onClick={handleResendEmail}
            disabled={resendLoading}
          >
            {resendLoading ? "Sending..." : "Resend email"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verification;