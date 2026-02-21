import React, { useRef, useState } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { CreateToast } from "../../utils/Toast";
import { RootState } from "../../redux/rootReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateVerificationStatus } from "../../redux/user/userSlice";
import { ClipLoader } from "react-spinners";
import { sellerVerify } from "../../api/auth";

function Verification() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const { seller } = useSelector((state: RootState) => state.seller);

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
    const data = {
      email: email,
      code: code,
      businessLogo: logoUrl,
    };
    sellerVerify(data)
      .then((res) => {
        CreateToast("Emailverified", "Email verified!", "success");
        setLoading(false);
        navigate(res.login);
      })
      .catch((err) => {});
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
            onPaste={(e) => handlePaste(i, e)}
          />
        </div>
      );
    }
    return inputs;
  };

  // business logo url state
  const [logoUrl, setLogoUrl] = useState("");

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
  };

  // if (!user?.isAuthenticated) {
  //   return <Navigate to="/error" />;
  // } else if (user?.user?.verificationStatus && seller?.verificationStatus) {
  //   return <Navigate to="/" />;
  // } else {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-12">
      <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl dark:text-white">
              <p>Email Verification</p>
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
              <div className="grid w-full items-center gap-1.5 mt-4">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                  type="url"
                  id="logo"
                  placeholder="Business Logo Url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
              <div className="mt-4">
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

          <span
            className="text-red-500 text-sm text-center"
            style={{ marginTop: "5px" }}
          >
            If the code has expired, a new code will be <br />
            automatically sent to your email.
          </span>
        </div>
      </div>
    </div>
  );
  // }
}

export default Verification;
