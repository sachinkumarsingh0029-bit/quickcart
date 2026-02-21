import React, { useEffect, useState } from "react";
import { createProduct, getProductById } from "../../api/product";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../data/categories";
import FullPageLoading from "../loading/FullPageLoading";
import { CreateToast } from "../../utils/Toast";

const ProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState<any>();
  const [discount, setDiscount] = useState<any>();
  const [category, setCategory] = useState("");
  const [faqs, setFaqs] = useState([
    {
      question: "",
      answer: "",
    },
  ]);
  const navigate = useNavigate();

  // add links
  const [links, setLinks] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<any>("");
  const [error, setError] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");

  function isImgUrl(url: any) {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
  }

  function isModel3dUrl(url: any) {
    return /\.(glb|gltf)$/.test(url);
  }

  const handleAddLink = async (event: any) => {
    event.preventDefault();
    const link = inputValue.trim();

    if (!isImgUrl(link)) {
      setError("Please enter a valid image link");
      return;
    }

    if (links.includes(link)) {
      // Check for duplicate links
      setError("Link already exists");
      return;
    }

    // Add link to list
    setLinks([...links, link]);
    setInputValue("");
    setError("");
  };

  const handleRemoveLink = (link: string) => {
    setLinks(links.filter((l) => l !== link));
    setError("");
  };

  const handleQuestionChange = (event: any, index: any) => {
    const newFaqs = [...faqs];
    newFaqs[index].question = event.target.value;
    setFaqs(newFaqs);
  };

  const handleAnswerChange = (event: any, index: any) => {
    const newFaqs = [...faqs];
    newFaqs[index].answer = event.target.value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    if (faqs.length < 5) {
      setFaqs([...faqs, { question: "", answer: "" }]);
    }
  };

  const handleRemoveFaq = (index: any) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  // tags
  const [tags, setTags] = useState<any>([]);

  const handleKeyDownTags = (event: any) => {
    const value = event.target.value.trim();
    if (event.key === "Enter" && value.length > 0 && tags.length < 5) {
      setTags([...tags, value]);
      event.target.value = "";
      event.target.focus = true;
      event.preventDefault();
    }
  };

  const handleDeleteTags = (index: any) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        imagesUrl: links,
        thumbnailUrl: thumbnailUrl,
        model3dUrl: model3dUrl || undefined,
        productName: productName,
        productDescription: productDescription,
        quantity: quantity,
        price: price,
        discountedPrice: (price - (price * discount) / 100).toFixed(0),
        category: category,
        faqs: faqs,
        tags: tags,
      };
      // api call
      const response = await createProduct(dataToSend);
      if (response.status === "success") {
        setLoading(false);
        CreateToast("created", "Product created successfully", "success");
        navigate(`/product/${response._id}`);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  return !loading ? (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white shadow p-4 rounded-lg">
        <h1 className="text-xl font-bold">Add New Product</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow-lg rounded-lg max-w-xl mt-10 flex flex-col justify-center align-middle"
      >
        {/* product name */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="productname"
          >
            Product Name
          </label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-12 resize-none"
            required
            minLength={10}
            maxLength={150}
            placeholder="Enter Product Name Here (10-150 characters)"
            defaultValue={productName}
            onChange={(event) => setProductName(event.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
        </div>
        {/* product Description */}
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="productname"
          >
            Product Description
          </label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-28 resize-none"
            required
            minLength={10}
            maxLength={1000}
            placeholder="Enter Product Description Here (10-1000 characters)"
            defaultValue={productDescription}
            onChange={(event) => setProductDescription(event.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* inputs */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="number"
              id="quantity"
              required
              placeholder="100"
              onChange={(event) => setQuantity(event.target.value)}
              defaultValue={quantity}
              min={0}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="quantity"
            >
              Price
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="number"
              required
              id="Price"
              placeholder="4999"
              defaultValue={price}
              min={0}
              onChange={(event) => setPrice(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="quantity"
            >
              Discount(%)
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="number"
              id="Price"
              placeholder="10"
              min={0}
              max={60}
              defaultValue={discount}
              onChange={(event) => setDiscount(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid grid-cols-1">
            <label
              htmlFor="categories"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Choose a category
            </label>
            <select
              id="categories"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              defaultValue={category}
              onChange={(event) => setCategory(event.target.value)}
              onKeyDown={handleKeyDown}
            >
              <option defaultValue="" selected>
                Choose a category
              </option>
              {categories.map((category, index) => (
                <option key={index} defaultValue={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* tags */}
        <div className="border border-gray-300 rounded-md p-4 max-w-lg mx-auto mt-10">
          <div className="mb-2 text-gray-600 text-sm">
            Tags can help your content appear higher in search engine results
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: any, index: any) => (
              <div
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-2">{tag}</span>
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => handleDeleteTags(index)}
                >
                  x
                </button>
              </div>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                placeholder="Add tag..."
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={handleKeyDownTags}
              />
            )}
          </div>
        </div>
        {/* thumbnail links */}
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-xl mt-4">
          <label htmlFor="imageLink">Enter product thumbnail link:</label>
          <div className="flex">
            <input
              className="flex-1 h-10 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              type="url"
              id="imageLink"
              placeholder="https://example.com/image.jpg"
              required
              onChange={(event) =>
                setThumbnailUrl(() =>
                  isImgUrl(event.target.value) ? event.target.value : ""
                )
              }
              value={thumbnailUrl}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {thumbnailUrl && (
              <div className="relative">
                <img
                  src={thumbnailUrl}
                  className="h-30 w-50 rounded-md object-cover"
                />
              </div>
            )}
          </div>
          {thumbnailUrl.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              No image links added yet. Enter an image link above by copying and
              pasting it into the field. Only valid image links will be
              accepted.
            </p>
          )}
        </div>
        {/* 3D model link */}
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-xl mt-4">
          <label htmlFor="model3dLink">3D Model URL (.glb or .gltf, optional):</label>
          <div className="flex">
            <input
              className="flex-1 h-10 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              type="url"
              id="model3dLink"
              placeholder="https://example.com/model.glb"
              onChange={(event) =>
                setModel3dUrl(() =>
                  isModel3dUrl(event.target.value) ? event.target.value : ""
                )
              }
              value={model3dUrl}
              onKeyDown={handleKeyDown}
            />
          </div>
          {model3dUrl.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Optional: provide a `.glb` or `.gltf` URL to enable 3D viewing for this product.
            </p>
          )}
        </div>
        {/* product photo links */}
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-xl mt-4">
          <div>
            <label htmlFor="imageLink">Enter product image links:</label>
            <div className="flex">
              <input
                className="flex-1 h-10 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                type="url"
                id="imageLink"
                placeholder="https://example.com/image.jpg"
                required={links.length <= 0}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddLink(e);
                  }
                }}
              />
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                onClick={handleAddLink}
              >
                Add
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {links.map((link, index) => (
              <div key={index} className="relative">
                <img
                  src={link}
                  alt={`Image ${index + 1}`}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link)}
                  className="absolute top-0 right-0 rounded-full bg-red-500 text-white h-5 w-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {links.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              No image links added yet. Enter an image link above to add one.
            </p>
          )}
        </div>
        {/* faqs */}
        <div className="max-w-lg mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions (max. 5)
          </h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor={`question-${index}`}
                  className="font-medium text-gray-800 mb-2"
                >
                  Question
                </label>
                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                id={`question-${index}`}
                defaultValue={faq.question}
                onChange={(event) => handleQuestionChange(event, index)}
                onKeyDown={handleKeyDown}
                className="border border-gray-300 rounded-md p-2 w-full"
                required
                minLength={5}
                maxLength={100}
                placeholder="e.g. What are the benefits of using this product?"
              />
              <div className="mt-2 flex justify-between mb-2">
                <label
                  htmlFor={`answer-${index}`}
                  className="font-medium text-gray-800 mb-2"
                >
                  Answer
                </label>
              </div>
              <textarea
                id={`answer-${index}`}
                defaultValue={faq.answer}
                onChange={(event) => handleAnswerChange(event, index)}
                className="border border-gray-300 rounded-md p-2 w-full h-28 resize-none"
                required
                minLength={10}
                maxLength={500}
                placeholder="e.g. Our product has many benefits, including..."
              ></textarea>
              {index === faqs.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 mt-2"
                >
                  Add FAQ
                </button>
              )}
            </div>
          ))}
        </div>
        {/* buttons */}
        <div className="p-4 flex justify-end">
          <button
            type="submit"
            className="mr-3 rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-green-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  ) : (
    <FullPageLoading />
  );
};

export default ProductDetails;
