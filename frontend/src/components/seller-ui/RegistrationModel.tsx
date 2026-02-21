import { useState } from "react";
import { categories } from "../../data/categories";
import { applyForSeller } from "../../api/seller";
import { CreateToast } from "../../utils/Toast";

type ModalProps = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

interface FormData {
  businessNumber: string;
  businessEmail: string;
  businessUsername: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessType: string;
  businessAddress: string;
  businessWebsite: string;
  taxIDNumber: string;
  productCategories: string[];
}

function Modal({ isOpen, openModal, closeModal }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    businessNumber: "",
    businessEmail: "",
    businessUsername: "",
    businessName: "",
    businessRegistrationNumber: "",
    businessType: "Retail",
    businessAddress: "",
    businessWebsite: "",
    taxIDNumber: "",
    productCategories: [],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (event: any) => {
    const selectedValue = event.target.value;
    if (formData.productCategories.length < 5) {
      if (selectedValue !== "") {
        if (!formData.productCategories.includes(selectedValue)) {
          setFormData({
            ...formData,
            productCategories: [...formData.productCategories, selectedValue],
          });
        }
      }
    }
    event.target.value = "";
  };

  const handleRemoveCategory = (categoryToRemove: any) => {
    const updatedCategories = formData.productCategories.filter(
      (category) => category !== categoryToRemove
    );
    setFormData({
      ...formData,
      productCategories: updatedCategories,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const result = await applyForSeller(formData);
      if (result.status) {
        CreateToast(
          "successapplication",
          "Your application has been submitted successfully",
          "success"
        );
        closeModal();
        setFormData({
          businessNumber: "",
          businessEmail: "",
          businessUsername: "",
          businessName: "",
          businessRegistrationNumber: "",
          businessType: "Retail",
          businessAddress: "",
          businessWebsite: "",
          taxIDNumber: "",
          productCategories: [],
        });
      }
    } catch (error) {}
  };

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 border-gray-800 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 text-black dark:text-white">
              <form onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessNumber"
                  >
                    Business Number
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessNumber"
                    name="businessNumber"
                    placeholder="Business Number"
                    required
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessEmail"
                  >
                    Business Email
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    required
                    placeholder="Business Email"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessUsername"
                  >
                    Business Username
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessUsername"
                    required
                    name="businessUsername"
                    placeholder="Business Username"
                    value={formData.businessUsername}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessName"
                  >
                    Business Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessName"
                    required
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessRegistrationNumber"
                  >
                    Business Registration Number
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessRegistrationNumber"
                    required
                    name="businessRegistrationNumber"
                    placeholder="Business Registration Number"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 mt-4">
                  <label
                    htmlFor="businessType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    name="businessType"
                    value={formData.businessType}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        businessType: event.target.value,
                      })
                    }
                  >
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessAddress"
                  >
                    Business Address
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessAddress"
                    required
                    name="businessAddress"
                    placeholder="Business Address"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessWebsite"
                  >
                    Business Webite
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessWebsite"
                    name="businessWebsite"
                    placeholder="Business Website"
                    required
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="taxIDNumber"
                  >
                    Business GSTIN Number
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessWebsite"
                    name="taxIDNumber"
                    required
                    placeholder="Tax ID Number"
                    value={formData.taxIDNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="categories"
                    className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                  >
                    Product Categories(max 5)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-full sm:w-auto flex-grow-0">
                      <input
                        type="text"
                        id="categories"
                        placeholder="Add a category"
                        onChange={handleCategoryChange}
                        list="category-list"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <datalist id="category-list">
                        {categories.map((category: any, index: any) => (
                          <option key={index} value={category.label}>
                            {category.label}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <ul className="flex flex-wrap gap-2">
                        {formData.productCategories.map((category, index) => (
                          <li
                            key={index}
                            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1"
                          >
                            <span className="text-gray-700 dark:text-gray-400">
                              {category}
                            </span>
                            <button
                              onClick={() => handleRemoveCategory(category)}
                              className="ml-2 rounded-md bg-red-500 text-white hover:bg-red-600 px-2 py-1 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:flex sm:items-center sm:justify-end">
                  <div className="sm:flex sm:items-center ">
                    <button
                      onClick={closeModal}
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="fixed z-[-1] inset-0 bg-slate-400 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
