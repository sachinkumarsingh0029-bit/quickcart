import { FaShippingFast, FaUser, FaSyncAlt } from "react-icons/fa";

export default function CustomerService() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold">
        We build our business on customer service
      </h2>
      <p className="max-w-2xl mt-4 text-base text-gray-600">
        It’s like a little kid, a little boy, looking at colors, and no one told
        him what colors are good, before somebody tells you you shouldn’t like
        pink because that’s for girls, or you’d instantly become a gay
        two-year-old. Why would anyone pick blue over pink? Pink is obviously a
        better color.
      </p>
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-md shadow-md">
          <FaShippingFast className="text-5xl text-indigo-500 mb-4" />
          <h6 className="text-sm font-medium text-gray-900">Free Shipping</h6>
          <p className="mt-2 text-sm text-gray-500">
            There’s nothing I really wanted to do in life that I wasn’t able to
            get good at. That’s my skill.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-md shadow-md">
          <FaUser className="text-5xl text-indigo-500 mb-4" />
          <h6 className="text-sm font-medium text-gray-900">
            10 Years Warranty
          </h6>
          <p className="mt-2 text-sm text-gray-500">
            I’m not really specifically talented at anything except for the
            ability to learn.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-md shadow-md">
          <FaSyncAlt className="text-5xl text-indigo-500 mb-4" />
          <h6 className="text-sm font-medium text-gray-900">Exchange</h6>
          <p className="mt-2 text-sm text-gray-500">
            Then we lose family over time. What else could rust the heart more
            over time? Blackgold.
          </p>
        </div>
      </div>
    </div>
  );
}
