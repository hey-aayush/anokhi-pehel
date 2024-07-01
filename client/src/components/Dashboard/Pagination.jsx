import React, { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  initialUsers,
  usersPerPage,
  handleUsersPerPageChange,
  totalUsers,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  //filter by class
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    handleUsersPerPageChange({ target: { value: option } });
    setDropdownOpen(false);
  };
  //Options to change number of users per page
  const generateOptions = (base) => {
    let options = [];
    let i = 1;
    while (i * base < totalUsers) {
      options.push(base * i);
      i++;
    }
    options.push(totalUsers); // Add option for all users
    return options;
  };
  const options = generateOptions(initialUsers);

  //Generate button as per the number of pages
  const generatePageButtons = () => {
    const pageButtons = [];
    const maxButtonsToShow = 3; // Change this value to control the number of page buttons shown

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-200 mx-1 ${
              currentPage === i
                ? "bg-gray-300"
                : "bg-white hover:bg-gray-100 hover:text-primary-700"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = Math.max(
        currentPage - Math.floor(maxButtonsToShow / 2),
        1
      );
      let endPage = startPage + maxButtonsToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxButtonsToShow + 1;
      }

      if (startPage > 1) {
        pageButtons.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200  mx-1 ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-white hover:bg-gray-100 hover:text-primary-700"
            }`}
          >
            1
          </button>
        );
        if (startPage > 2) {
          pageButtons.push(
            <span key="start-ellipsis" className="mx-1">
              ...
            </span>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200  mx-1 ${
              currentPage === i
                ? "bg-gray-300"
                : "bg-white hover:bg-gray-100 hover:text-primary-700"
            }`}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageButtons.push(
            <span key="end-ellipsis" className="mx-1">
              ...
            </span>
          );
        }
        pageButtons.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200  mx-1 ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-white hover:bg-gray-100 hover:text-primary-700"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-center items-center mt-8 space-y-4 md:space-y-0 md:space-x-4 ${
        isDropdownOpen ? "pb-4 " : "pb-4"
      }`}
    >
      <div className="flex space-x-2">
        <button
          onClick={onPreviousPage}
          className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200  mx-1 ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-white hover:bg-gray-100 hover:text-primary-700"
          }`}
          disabled={currentPage === 1}
        >
          <GoArrowLeft />
        </button>
        {generatePageButtons()}
        <button
          onClick={onNextPage}
          className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none border rounded-lg border-gray-200  mx-1 ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-white hover:bg-gray-100 hover:text-primary-700"
          }`}
          disabled={currentPage === totalPages}
        >
          <GoArrowRight />
        </button>
      </div>
      <div className="flex items-center space-x-2 md:w-auto ">
        <button
          onClick={toggleDropdown}
          className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200      "
          type="button"
        >
          <span className="mx-1">
            {usersPerPage === totalUsers ? "All" : `${usersPerPage} per page`}
          </span>
          {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
        <div>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-auto md:w-auto max-h-40 bg-gray-200 rounded-md shadow overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option}
                  className="pl-3 pr-8 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOptionClick(option)}
                >
                  {option === totalUsers ? "All" : `${option} per page`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
