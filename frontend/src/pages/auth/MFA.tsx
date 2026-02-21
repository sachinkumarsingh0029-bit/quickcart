import React, { useRef } from "react";
import instance from "../../utils/Axios";
import { useNavigate } from "react-router-dom";

function MFA() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
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
    const code = inputRefs.current.map((input) => input.value).join("");
    // submit code to server for validation
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

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-12">
      <div className="relative bg-white dark:bg-gray-800 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl dark:text-white">
              <p>Two factor Authentication</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400 dark:text-gray-300">
              <p>We have sent a code to your email ba**@dipainhouse.com</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div
                className="flex
flex-row justify-center space-x-6"
              >
                {renderInputs()}
              </div>
              <div className="mt-12">
                <button className="w-full py-3 text-white bg-gradient-primary rounded-xl hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 font-bold">
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

export default MFA;
