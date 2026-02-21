import React from "react";
import { HiShieldCheck, HiLightningBolt, HiUser, HiCheckCircle } from "react-icons/hi";
import { HiClipboardDocumentList } from "react-icons/hi2";

const RegistrationSteps = ({ openModal }: any) => {
  return (
    <section
      className="text-gray-700 body-font bg-gradient-to-br from-white via-primary-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl dark:text-white py-16"
      id="registrationsteps"
    >
      <div className="container px-5 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get started as a seller in just a few simple steps
          </p>
        </div>
        <div className="flex flex-wrap w-full">
          <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            <div className="flex relative pb-12">
              <div className="h-full w-12 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gradient-to-b from-primary-300 to-secondary-300 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary inline-flex items-center justify-center text-white relative z-10 shadow-lg">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-grow pl-6">
                <h2 className="font-bold title-font text-lg text-gray-900 dark:text-white mb-2 tracking-wider">
                  Step 1 - Apply As Seller
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Click the{" "}
                  <span
                    onClick={openModal}
                    className="text-primary-600 dark:text-primary-400 font-semibold uppercase cursor-pointer hover:text-pink-500 transition-colors"
                  >
                    "Start Now"
                  </span>{" "}
                  button below to begin the registration process and create your
                  account. It only takes a few minutes to get started!
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-12 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gradient-to-b from-secondary-300 to-accent-300 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 inline-flex items-center justify-center text-white relative z-10 shadow-lg">
                <HiClipboardDocumentList className="w-6 h-6" />
              </div>
              <div className="flex-grow pl-6">
                <h2 className="font-bold title-font text-lg text-gray-900 dark:text-white mb-2 tracking-wider">
                  STEP 2 - Fill Form
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  After clicking on "Start Now," a registration form will
                  appear. Please fill in all the required information accurately
                  and completely. This will include your name, contact
                  information, and any other necessary details to create your
                  account.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-12 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gradient-to-b from-accent-300 to-pink-300 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 inline-flex items-center justify-center text-white relative z-10 shadow-lg">
                <HiLightningBolt className="w-6 h-6" />
              </div>
              <div className="flex-grow pl-6">
                <h2 className="font-bold title-font text-lg text-gray-900 dark:text-white mb-2 tracking-wider">
                  STEP 3 - Wait for Admin
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Congratulations! You have successfully submitted your
                  registration request. Please allow our admin team to review
                  your request and confirm your account. You will receive an
                  email notification once your account has been activated.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-12 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gradient-to-b from-pink-300 to-primary-300 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 inline-flex items-center justify-center text-white relative z-10 shadow-lg">
                <HiUser className="w-6 h-6" />
              </div>
              <div className="flex-grow pl-6">
                <h2 className="font-bold title-font text-lg text-gray-900 dark:text-white mb-2 tracking-wider">
                  STEP 4 - Verify
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  After receiving the verification email, log in to your account
                  and enter the verification code provided in the email to
                  confirm your account. Once your account is verified, you can
                  start exploring the marketplace and making sales.
                </p>
              </div>
            </div>
            <div className="flex relative">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary inline-flex items-center justify-center text-white relative z-10 shadow-lg animate-pulse-slow">
                <HiCheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-grow pl-6">
                <h2 className="font-bold title-font text-lg text-gray-900 dark:text-white mb-2 tracking-wider">
                  FINISH - Start Selling
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Congratulations! You're now ready to start buying and selling
                  on QuickCart. We hope you have a great experience and find
                  success on our platform. If you have any questions or
                  concerns, please don't hesitate to reach out to our support
                  team.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-3/5 md:w-1/2 flex items-center justify-center md:mt-0 mt-12">
            <div className="w-full max-w-md p-8 glass-card">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary-100 to-pink-100 dark:from-primary-900/30 dark:to-pink-900/30">
                  <HiShieldCheck className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Secure Platform</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your data is safe with us</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-secondary-100 to-primary-100 dark:from-secondary-900/30 dark:to-primary-900/30">
                  <HiLightningBolt className="w-8 h-8 text-secondary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Fast Approval</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quick verification process</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-accent-100 to-pink-100 dark:from-accent-900/30 dark:to-pink-900/30">
                  <HiCheckCircle className="w-8 h-8 text-accent-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Easy Setup</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get started in minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSteps;
