import { useEffect, useState } from "react";
import { createReviewRating, getReviewRating } from "../../../api/order";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  product: any;
};

function RatingModel({ isOpen, closeModal, product }: ModalProps) {
  // review state
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  // already rated
  const [alreadyRated, setAlreadyRated] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getReviewRating(product.product.id);
      setRating(result);
      console.log(result.ratings.length);
      if (result.ratings.length !== 0 || result.ratings.length !== null) {
        setReview(result.ratings[0].review);
        setRating(result.ratings[0].rating);
        setAlreadyRated(true);
      }
    } catch (err) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (value: any) => {
    if (!alreadyRated) setRating(value);
  };

  // handle submit review
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result = await createReviewRating(product.product.id, {
        review,
        rating,
      });
      closeModal();
      setAlreadyRated(true);
    } catch (err) {}
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
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessRegistrationNumber"
                  >
                    Enter Review <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    id="review"
                    required
                    name="review"
                    placeholder="......"
                    value={review}
                    onChange={(e) => !alreadyRated && setReview(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="businessRegistrationNumber"
                  >
                    Ratings <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((star: any, index: any) => {
                        const value = index + 1;
                        return (
                          <svg
                            key={index}
                            aria-hidden="true"
                            className={`w-7 h-7 cursor-pointer ${
                              value <= rating
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => handleClick(value)}
                          >
                            <title>{`${value} star`}</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        );
                      })}
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
                    {!alreadyRated && (
                      <button
                        type="submit"
                        className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                      >
                        Submit
                      </button>
                    )}
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

export default RatingModel;
