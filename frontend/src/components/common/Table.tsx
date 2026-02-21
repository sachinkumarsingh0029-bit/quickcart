import React from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const people = [
  {
    name: "John Doe",
    title: "Front-end Developer",
    department: "Engineering",
    email: "john@devui.com",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
  },
  {
    name: "Jane Doe",
    title: "Back-end Developer",
    department: "Engineering",
    email: "jane@devui.com",
    role: "CTO",
    image:
      "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
  },
];

export const Table = () => {
  return (
    <section className="container px-4 mx-auto py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Employees
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            This is a list of all employees. You can add new employees, edit or
            delete existing ones.
          </p>
        </div>
        <div>
          <button className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold leading-7 text-white hover:bg-indigo-500">
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <span>Employee</span>
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  <tr>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1160&amp;q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            John Doe
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            john@devui.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Front-end Developer
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        Engineering
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Developer
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-gray-500 dark:text-gray-300 hover:text-indigo-600"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=928&amp;q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Jane Doe
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            jane@devui.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Back-end Developer
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        Engineering
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      CTO
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-gray-500 dark:text-gray-300 hover:text-indigo-600"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <a
          href="#"
          className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
          <span>previous</span>
        </a>
        <div className="items-center hidden md:flex gap-x-3">
          <a
            href="#"
            className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60"
          >
            1
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            2
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            3
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            ...
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            12
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            13
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            14
          </a>
        </div>
        <a
          href="#"
          className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            ></path>
          </svg>
        </a>
      </div>
    </section>
  );
};

Table.displayName = "Table";
