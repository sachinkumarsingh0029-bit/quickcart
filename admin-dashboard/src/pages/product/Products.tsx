import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState<any>();
  const navigate = useNavigate();
  const fetchData = async () => {
    const result = await getProducts();
    setProducts(result.products);
    console.log(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <div className="overflow-x-auto">
        <div className="w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Thumbnail
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Views
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    discount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase"
                  >
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products &&
                  products.map((product: any) => (
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        <img
                          src={product.thumbnailUrl}
                          className="w-20 h-auto"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-wrap flex flex-wrap">
                        {product.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.views}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {(
                          ((product.price - product.discountedPrice) /
                            product.price) *
                          100
                        ).toFixed(0)}
                        %
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() =>
                            navigate(`/updateproduct/${product._id}`)
                          }
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
