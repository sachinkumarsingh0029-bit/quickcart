import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { ExchangeRate } from "../../../utils/ExchangeRate";
import Web3 from "web3";
import { CreateToast } from "../../../utils/Toast";
import { placeOrderApi, updateTransaction } from "../../../api/order";
import { clearCart } from "../../../redux/cart/cartSlice";

function MetaMask() {
  const cartItems = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { transactionId } = useParams();
  const { state } = useLocation();

  // web3
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(undefined);

  const initWeb3 = async () => {
    setLoading(true)
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        setLoading(false);
        return web3;
      } else if (window.web3) {
        const web3 = window.web3;
        setWeb3(web3);
        setLoading(false);
        return web3;
      } else {
        setLoading(false);
        setError("No Web3 provider detected.");
      }
    } catch (error) {
      setLoading(false)
      setError("Failed to initialize Web3 provider.");
      console.error(error);
    }
    setLoading(false)
  };

  const loadBlockchainData = async () => {
    try {
      const selectedAccount = window.ethereum.selectedAddress;
      setAccount(selectedAccount);
      const balance = await web3.eth.getBalance(selectedAccount);
      setBalance(web3.utils.fromWei(balance, "ether"));
      setError('')
    } catch (error) {
      setError("Failed to load blockchain data.");
      console.error(error);
    }
  };

  async function convertINRtoETH(amount) {
    const inrToUsdUrl = 'https://api.exchangerate-api.com/v4/latest/INR';
    const ethPriceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

    // Get INR to USD exchange rate
    const inrToUsdResponse = await fetch(inrToUsdUrl);
    const inrToUsdData = await inrToUsdResponse.json();
    const inrToUsdRate = inrToUsdData.rates.USD;

    // Get ETH price in USD
    const ethPriceResponse = await fetch(ethPriceUrl);
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.ethereum.usd;

    // Calculate INR to ETH conversion rate
    const inrToEthRate = inrToUsdRate / ethPrice;

    // Convert INR to ETH
    const ethAmount = cartItems.totalAmount * inrToEthRate;
    return ethAmount;
  }

  const handleSendTransaction = async (e) => {
    e.preventDefault()
    try {
      if (!state.address || !state.number || !state.fullname) {
        navigate('/cart')
        CreateToast('paymenterror', "Something went wrong...", 'error');
      }
      setLoading(true);

      const amountInEth = await convertINRtoETH(200)

      const txHash = await web3.eth.sendTransaction({
        from: account,
        to: "0x7B302F62c57faBC332052B482f673f6716d80A01",
        value: web3.utils.toWei(amountInEth.toString(), "ether"),
      });
      if (txHash) {
        await updateTransaction(transactionId);
        const products = cartItems.items.map((item) => ({
          id: item._id,
          quantity: item.quantity,
        }));

        const { cart_id } = await placeOrderApi({
          shippingAddress: state.address,
          number: state.number,
          fullname: state.fullname,
          products: products,
          transactionId: transactionId,
        });
        navigate(`/orders`, { replace: true })
        dispatch(clearCart())
        CreateToast('payment', 'Payment Successful', 'success');
      }
      setError('')
      setLoading(false);
      console.log(`Transaction sent: ${txHash}`);
    } catch (error) {
      setLoading(false);
      setError("Failed to send transaction.");
      console.error(error);
      CreateToast("metamask", error.message, "error");
    }
  };

  useEffect(() => {
    const init = async () => {
      const web3 = await initWeb3();
      if (web3) {
        await loadBlockchainData();
        window.ethereum.on("accountsChanged", async () => {
          await loadBlockchainData();
        });
      }
    };
    init();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleConnectWallet = async () => {
    const web3 = await initWeb3();
    if (web3) {
      await loadBlockchainData();
    }
  };

  return (
    <>
      <div className="relative mx-auto w-full bg-white">
        <div className="grid min-h-screen grid-cols-10">
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
                Secure Checkout
                <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
              </h1>
              <div className="mt-10 text-center text-sm font-semibold text-gray-500">
                <>
                  {account ? (
                    <>
                      <p className="mb-2">
                        Connected to {account}
                      </p>
                      <button
                        type="button"
                        className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                          } text-white py-2 px-4 rounded`}
                        // onClick={handleSendTransaction}
                        disabled={true}
                      >
                        {loading ? "Sending..." : "Wallet Connected"}
                      </button>
                      {error && (
                        <p className="text-red-500">{error}</p>
                      )}
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      onClick={handleConnectWallet}
                    >
                      Connect Wallet
                    </button>
                  )}
                </>

              </div>
              <form className="flex flex-col space-y-4">
                <p className="mt-10 text-center text-sm font-semibold text-gray-500">
                  By placing this order you agree to the{" "}
                  <Link
                    to="/termsandconditions"
                    target="_blank"
                    className="cursor-pointer whitespace-nowrap text-teal-400 underline hover:text-teal-600"
                  >
                    Terms and Conditions
                  </Link>
                </p>
                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                  onClick={(e) => handleSendTransaction(e)}
                  disabled={loading}
                >
                  {!loading ? "Place Order" : <BeatLoader color="#fff" />}
                </button>
              </form>
            </div>
          </div>
          <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
            <h2 className="sr-only">Order summary</h2>
            <div>
              <img
                src="https://images.unsplash.com/photo-1581318694548-0fb6e47fe59b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-800 to-teal-400 opacity-95"></div>
            </div>
            <div className="relative">
              <ul className="space-y-5">
                {cartItems.items.length !== 0 ? (
                  cartItems.items.map((product) => (
                    <li className="flex justify-between">
                      <div className="inline-flex">
                        <img
                          src={product.thumbnailUrl}
                          alt={product.productName}
                          className="max-h-16"
                        />
                        <div className="ml-3">
                          <p className="text-base font-semibold text-white">
                            {product.productName}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        ₹{product.price}
                      </p>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
              <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-white dark:text-gray-200">
                    Price ({cartItems.totalQuantity} item)
                  </dt>
                  <dd className="text-sm font-medium text-white dark:text-gray-100">
                    ₹{cartItems.totalPrice}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <dt className="flex items-center text-sm text-white dark:text-gray-200">
                    <span>Discount</span>
                  </dt>
                  <dd className="text-sm font-medium text-white dark:text-green-400">
                    - ₹{cartItems.totalDiscount}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-dashed">
                  <dt className="text-base font-medium text-white dark:text-white">
                    Total Amount
                  </dt>
                  <dd className="text-base font-medium text-white dark:text-white">
                    ₹{cartItems.totalAmount}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MetaMask;
