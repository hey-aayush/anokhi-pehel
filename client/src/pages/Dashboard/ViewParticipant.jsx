import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import Header from "../../components/Dashboard/Header";
import { useSelector } from "react-redux";
import {
  MdDelete,
  MdEdit,
  MdLocationPin,
  MdClass,
  MdManageSearch,
  MdDownload,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { classes } from "../../constants/Dashboard";
import { useState, useEffect, useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import { BASE_URL } from "../../../src/Service/helper";
import { downloadCSV, downloadPDF } from "../../../src/Service/utilityfunctions";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../components/Spinner.jsx";
import Pagination from "../../components/Dashboard/Pagination.jsx";
import { getAllParticipants, getEvents, getParticipantPage } from "../../Service/listApi";
import { listKeys } from "../../queries/listQueries";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const getAvailableSessions = (items) =>
  [...new Set((Array.isArray(items) ? items : []).map((e) => e.year).filter(Boolean))].sort((a, b) => b - a);

const Participants = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isActionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [isFilterByClassDropdownOpen, setFilterByClassDropdownOpen] =
    useState(false);
  const [isFilterByLocationDropdownOpen, setFilterByLOcationDropdownOpen] =
    useState(false);
  const [isFilterBySessionDropdownOpen, setIsFilterBySessionDropdownOpen] =
    useState(false);
  const [selectedSession, setSelectedSession] = useState([]); // State to hold selected session
  const initialUsers = 40;
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(initialUsers);

  
  //Actions
  const toggleActionsDropdown = () => {
    setActionsDropdownOpen(!isActionsDropdownOpen);
    if (isFilterByClassDropdownOpen)
      setFilterByClassDropdownOpen(!isFilterByClassDropdownOpen);
    if (isFilterByLocationDropdownOpen)
      setFilterByLOcationDropdownOpen(!isFilterByLocationDropdownOpen);
  };

  //filter by class
  const toggleFilterByClassDropdown = () => {
    setFilterByClassDropdownOpen(!isFilterByClassDropdownOpen);
    if (isActionsDropdownOpen) setActionsDropdownOpen(!isActionsDropdownOpen);
    if (isFilterByLocationDropdownOpen)
      setFilterByLOcationDropdownOpen(!isFilterByLocationDropdownOpen);
    if (isFilterBySessionDropdownOpen)
      setIsFilterBySessionDropdownOpen(!isFilterBySessionDropdownOpen);
  };


  const toggleFilterBySessionDropdown = () => {
    setIsFilterBySessionDropdownOpen(!isFilterBySessionDropdownOpen);
    if (isFilterByClassDropdownOpen)
      setFilterByClassDropdownOpen(!isFilterByClassDropdownOpen);
    if (isActionsDropdownOpen) setActionsDropdownOpen(!isActionsDropdownOpen);
  };
  const [filterName, setFilterName] = useState("");
  const [filterSchool, setFilterSchool] = useState(""); 
  const debouncedName = useDebouncedValue(filterName);
  const debouncedSchool = useDebouncedValue(filterSchool);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const toggleDropdown = (studentId) => {
    setOpenDropdownId(openDropdownId === studentId ? null : studentId);
  };

  // State to hold selected classes
  const [selectedClasses, setSelectedClasses] = useState([]);

  // Update selected classes when a checkbox is clicked
  const handleClassCheckboxChange = (e) => {
    setCurrentPage(1);
    const { id } = e.target;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedClasses((prevSelectedClasses) => [...prevSelectedClasses, id]);
    } else {
      setSelectedClasses((prevSelectedClasses) =>
        prevSelectedClasses.filter((cls) => cls !== id)
      );
    }
  };

  const handleSessionBoxChange = (e) => {
    setCurrentPage(1);
    const { value, checked } = e.target;
    const year = Number(value);

    if (checked) {
      setSelectedSession((prev) => [...prev, year]);
    } else {
      setSelectedSession((prev) => prev.filter((y) => y !== year));
    }
  };

  const filters = {
    classes: selectedClasses.slice().sort().join(","),
    years: selectedSession.slice().sort().join(","),
    name: debouncedName.trim(),
    school: debouncedSchool.trim(),
  };
  const pageParams = { ...filters, page: currentPage, limit: usersPerPage };
  const { data, isPending, isError } = useQuery({
    queryKey: listKeys.participantPage(pageParams),
    queryFn: ({ signal }) => getParticipantPage(pageParams, signal),
    placeholderData: keepPreviousData,
  });
  const { data: events = [] } = useQuery({
    queryKey: listKeys.events,
    queryFn: ({ signal }) => getEvents(signal),
  });
  const availableSessions = useMemo(() => getAvailableSessions(events), [events]);
  const currentUsers = data?.items ?? [];
  const totalUsers = data?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const getExportStudents = async () =>
    (await getAllParticipants(filters)).sort((a, b) =>
      b.year - a.year || (a.name || "").localeCompare(b.name || "")
    );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const indexOfFirstUser = (currentPage - 1) * usersPerPage;

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleDownloadTable = async () => {
    const columns = [
      { label: "S.No.", key: "index" },
      { label: "Name", key: "name" },
      { label: "Class", key: "class" },
      { label: "Phone", key: "phone" },
      { label: "School", key: "school" },
      { label: "Year", key: "year" }
    ];

    try {
      const dataWithIndex = (await getExportStudents()).map((student, index) => ({
        ...student,
        index: index + 1
      }));
      downloadPDF(dataWithIndex, columns, "students_table");
    } catch (error) {
      console.error("Unable to export participants:", error);
    }
  };

  const handleDownloadTableCsv = async () => {
    const columns = [
      { label: "S.No.", key: "index" },
      { label: "Name", key: "name" },
      { label: "Class", key: "class" },
      { label: "Phone", key: "phone" },
      { label: "School", key: "school" },
      { label: "Year", key: "year" }
    ];

    try {
      const dataWithIndex = (await getExportStudents()).map((student, index) => ({
        ...student,
        index: index + 1
      }));
      downloadCSV(dataWithIndex, columns, "students_table");
    } catch (error) {
      console.error("Unable to export participants:", error);
    }
  };

  // Download Excel workbook with multiple sheets (one per school)
  const handleDownloadExcelBySchool = async () => {
    try {
    const sortedStudents = await getExportStudents();
    const eventGroups = [...new Set(
      events.map((event) => event.eventGroup).filter(Boolean)
    )].sort();
    const eventsById = new Map(
      events.map((event) => [String(event._id), event])
    );

    // Get unique schools from filtered students
    const uniqueSchools = [...new Set(sortedStudents.map(student => student.school))].sort();
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Track sheet names to handle duplicates
    const usedSheetNames = new Set();
    
    // Create a sheet for each school
    uniqueSchools.forEach((school) => {
      const schoolStudents = sortedStudents.filter(student => student.school === school);
      
      // Prepare data with headers
      const sheetData = [
        ["S.No.", "Name", "Class", "Phone", "School", "Year", ...eventGroups],
        ...schoolStudents.map((student, index) => {
          const eventsByGroup = (Array.isArray(student.events) ? student.events : [])
            .map((eventId) => eventsById.get(String(eventId)))
            .filter(Boolean)
            .reduce((groups, event) => {
              if (!groups[event.eventGroup]) groups[event.eventGroup] = [];
              groups[event.eventGroup].push(event.eventName);
              return groups;
            }, {});

          return [
            index + 1,
            student.name,
            student.class,
            student.phone,
            student.school,
            student.year,
            ...eventGroups.map((group) => (eventsByGroup[group] || []).join(", ")),
          ];
        })
      ];
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      
      // Generate unique sheet name (Excel limits sheet names to 31 chars)
      let sheetName = school.substring(0, 31);
      let counter = 1;
      const originalName = sheetName;
      
      // If sheet name already exists, append a counter
      while (usedSheetNames.has(sheetName)) {
        counter++;
        const suffix = ` (${counter})`;
        sheetName = originalName.substring(0, 31 - suffix.length) + suffix;
      }
      
      usedSheetNames.add(sheetName);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    
    // Download the workbook
    XLSX.writeFile(workbook, `students_by_school.xlsx`);
    } catch (error) {
      console.error("Unable to export participants:", error);
    }
  };
       

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      try {
        // Send request to server to delete student
        const response = await axios.delete(
          `${BASE_URL}/deleteParticipants/${studentId}`
        );
        if (response.status === 200) {
          // Student deleted successfully
          alert("Participants deleted successfully");
          navigate("/viewParticipants");
        //   console.log("Student deleted successfully");
          // You can perform any additional actions after successful deletion, such as updating the UI
        } else {
            alert("Participants not deleted successfully");
          // Handle error response from server
          console.error(
            "Failed to delete student:",
            response.status,
            response.statusText
          );
          // You can show an error message to the user or handle the error in any other way
        }
      } catch (error) {
        // Handle network errors or other exceptions
        alert("Participants not deleted successfully");
        console.error("Error deleting student:", error.message);
        // You can show an error message to the user or handle the error in any other way
      }
    }
  };

  return (
    <DashboardLayout>
      {isPending && <Spinner />}
      {isError && <p role="alert">Unable to load participants. Please try again.</p>}
      <div className="mt-5 p-2 md:p-10 bg-white rounded-3xl">
        <Header category={selectedSession.length === 1 ? `Antyodaya ${selectedSession[0]}` : "Antyodaya"} title="Participants" />
        <div className="mx-auto max-w-screen-xl">
          <div className="bg-white  relative shadow-md sm:rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MdManageSearch />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 p-2"
                      placeholder="Search by name"
                      required=""
                      value={filterName}
                      onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="school-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MdManageSearch />
                    </div>
                    <input
                      type="text"
                      id="school-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 p-2"
                      placeholder="Search by School"
                      value={filterSchool} // Add search by school value
                      onChange={(e) => { setFilterSchool(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  onClick={() => {
                    navigate("/addParticipant");
                  }}
                  type="button"
                  className="flex items-center justify-center text-gray-100 bg-cyan-400 hover:bg-cyan-500 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
                >
                  <FaPlus />
                  <span className="ml-1">Add Participants</span>
                </button>

                {/* Actions */}
                <button
                  onClick={toggleActionsDropdown}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                  type="button"
                >
                  {isActionsDropdownOpen ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                  <span className="mx-1">Download</span>
                </button>
                {/* Dropdown */}
                {isActionsDropdownOpen && (
                  <div className="absolute top-20 mt-20 z-10 w-40 bg-gray-200 rounded-md divide-y divide-gray-300 shadow">
                    <ul className="py-1 text-sm text-gray-700">
                      {/* <li>
                        <a
                          href="#"
                          className="flex py-2 px-4 text-sky-600 hover:bg-sky-200"
                        >
                          <MdEdit className="mt-1" />{" "}
                          <span className="ml-1">Edit</span>
                        </a>
                      </li> */}
                      <li onClick={handleDownloadTable}>
                        <a
                          href="#"
                          className="flex py-2 px-4 text-green-600 hover:bg-green-200"
                        >
                          <MdDownload className="mt-1" />{" "}
                          <span className="ml-1">Download Pdf</span>
                        </a>
                      </li>
                      <li onClick={handleDownloadTableCsv}>
                        <a
                          href="#"
                          className="flex py-2 px-4 text-green-600 hover:bg-green-200"
                        >
                          <MdDownload className="mt-1" />{" "}
                          <span className="ml-1">Download Csv</span>
                        </a>
                      </li>
                      <li onClick={handleDownloadExcelBySchool}>
                        <a
                          href="#"
                          className="flex py-2 px-4 text-green-600 hover:bg-green-200"
                        >
                          <MdDownload className="mt-1" />{" "}
                          <span className="ml-1">Download Excel (By School)</span>
                        </a>
                      </li>
                    </ul>
                   
                  </div>
                )}

                {/* filter */}
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {/* Filter By Class*/}
                  <button
                    onClick={toggleFilterByClassDropdown}
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200      "
                    type="button"
                  >
                    <MdClass />
                    <span className="mx-1">Filter By Class</span>
                    {isFilterByClassDropdownOpen ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                  <div>
                    {isFilterByClassDropdownOpen && (
                      <div className="absolute right-0 mt-7 p-2 z-10 w-44 bg-gray-200 rounded-md shadow ">
                        <ul className="space-y-2 text-sm h-48 p-2 overflow-y-auto">
                          {classes.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <input
                                id={item.id}
                                type="checkbox"
                                value=""
                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500  focus:ring-2"
                                onChange={handleClassCheckboxChange}
                                checked={selectedClasses.includes(item.id)}
                              />
                              <label
                                htmlFor={item.id}
                                className="ml-2 text-sm font-medium text-gray-900"
                              >
                                {item.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleFilterBySessionDropdown}
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200      "
                    type="button"
                  >
                    <MdLocationPin />
                    <span className="mx-1">Filter By Session</span>
                    {isFilterBySessionDropdownOpen ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                  
                  <div>
                    {isFilterBySessionDropdownOpen && (
                      <div className="absolute right-0 mt-7 p-2 z-10 w-44 bg-gray-200 rounded-md shadow">
                        <ul className="space-y-2 text-sm">
                          {availableSessions.map((year) => (
                            <li key={year} className="flex items-center">
                              <input
                                id={year}
                                type="checkbox"
                                name="session"
                                value={year}
                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500  focus:ring-2 outline-none"
                                onChange={handleSessionBoxChange}
                                checked={selectedSession.includes(year)}
                              />
                              <label
                                htmlFor={year}
                                className="ml-2 text-sm font-medium text-gray-900"
                              >
                                {year}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                 
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-x border-t">
                  <tr>
                  <th scope="col" className="px-4 py-3">
                      S.No.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Class
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Phone
                    </th>
                   
                    <th scope="col" className="px-4 py-3">
                      School
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Year
                    </th>
                    <th scope="col" className="px-4 py-3">
                      {/* <span className="sr-only">Actions</span> */}
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="border-b">
                  {currentUsers.map((student,index) => (
                    <tr key={student._id} className="border-x">
                    <td className="px-4 py-3">{indexOfFirstUser+index+1}</td>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {student.name}
                      </th>
                      <td className="px-4 py-3">{student.class}</td>
                      <td className="px-4 py-3">{student.phone}</td>
                     
                     
                      <td className="px-4 py-3">{student.school}</td>
                      <td className="px-4 py-3">{student.year}</td>

                      <td className="px-4 py-3 flex items-center">
                        <div className="relative inline-block text-left pl-3">
                          <button
                            onClick={() => toggleDropdown(student._id)}
                            className="inline-flex items-center p-0.5 text-xl font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                            type="button"
                          >
                            <HiDotsHorizontal />
                          </button>
                          {/* Dropdown */}
                          {openDropdownId === student._id && (
                            <div className="absolute right-0 z-10 w-30 bg-gray-100 rounded-md divide-y divide-gray-200 shadow">
                              <ul
                                className="py-1 text-sm font-medium"
                                aria-labelledby={`dropdown-button-${student._id}`}
                              >
                                <li>
                                  <Link
                                    to={`/ParticipantProfile?student._id=${student._id}`}
                                    className="flex flex-center py-2 px-4 text-green-600 hover:bg-green-200"
                                  >
                                    <FaEye className="mt-1" />{" "}
                                    <span className="ml-1">View</span>
                                  </Link>
                                </li>
                                {user?.isAdmin === true && (
                                  <li>
                                    <Link
                                      to={`/editParticipant?student._id=${student._id}`}
                                      className="flex flex-center py-2 px-4 text-sky-600 hover:bg-sky-200"
                                    >
                                      <MdEdit className="mt-1" />{" "}
                                      <span className="ml-1">Edit</span>
                                    </Link>
                                  </li>
                                )}
                              </ul>
                              {user?.isAdmin === true && (
                                <div className="py-1">
                                  <button
                                    onClick={() => handleDelete(student._id)}
                                    className="flex flex-center py-2 px-4 text-sm text-red-600 hover:bg-red-100"
                                  >
                                    <MdDelete className="mt-1" />{" "}
                                    <span className="ml-1">Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              initialUsers={initialUsers}
              usersPerPage={usersPerPage}
              handleUsersPerPageChange={handleUsersPerPageChange}
              totalUsers={totalUsers}
              maxPageSize={100}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Participants;
