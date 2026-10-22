import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import Button from "../../components/Dashboard/Button";
import { BASE_URL } from "../../Service/helper";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const currentColor = "#03C9D7";
  const { user } = useSelector((state) => state.user); // User data from Redux
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [issueText, setIssueText] = useState(""); // Capture issue input
  const [loading, setLoading] = useState(false); // Loading state for submit
  const [issues, setIssues] = useState([]); // State to store issues

  // Function to toggle form visibility
  const raiseIssue = () => {
    setShowForm(true);
  };


  // Fetch issues from the backend
const fetchIssues = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fetchIssues`);
      console.log("Fetched Issues:", response.data); // Log the fetched issues
      setIssues(response.data); // Set the issues from the backend
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };
  

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  // Function to handle form submission
  const handleSubmit = async () => {
    

    if (!issueText.trim()) {
      alert("Please enter an issue description.");
      return;
    }
    setLoading(true); // Start loading
    try {
      await axios.post(`${BASE_URL}/issues`, {
        userId: user._id, // Sending user ID or other info
        userName: user.name,
        userRegNumber: user.regnumber,
        issue: issueText,
      });
      alert("Issue submitted successfully!");
      setIssueText(""); // Clear the form
      setShowForm(false); // Hide the form after submit
      fetchIssues(); // Refresh issues after submitting a new one
    } catch (error) {
      alert("Error submitting the issue. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/solveIssues/${issueId}`, { status: newStatus });
      // Fetch the updated issues after changing the status
      fetchIssues(); 
    } catch (error) {
      console.error("Error updating the status:", error);
      alert("Failed to update the status. Please try again.");
    }
  };
  
  const handleDelete = async (issueId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${BASE_URL}/deleteIssues/${issueId}`);
      alert("Issue deleted successfully!");
      fetchIssues(); // Refresh the list after deletion
    } catch (error) {
      alert("Error deleting the issue. Please try again later.");
      console.error("Delete issue error:", error);
    }
  };
  

  return (
    <DashboardLayout>
     <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        {user ? (
          <h1 className="font-bold text-center">
            Welcome On Issue Portal, {user.name}!
          </h1>
        ) : (
          <p>No user data available.</p>
        )}
        <p className="text-center ">
          We&apos;re glad to have you here! If you encounter any issues or have
          suggestions for improving the Anokhi Pehel web portal, please feel free
          to raise them here. Your feedback will help our web team gain valuable
          insights to make the portal more efficient and user-friendly. Thank
          you for your support!
        </p>
      </div>

      {/* Raise Issue Button */}
      <div className="flex justify-center items-start h-full sm:flex-row mt-8">
        <div className="bg-blue-200 rounded-lg p-4">
          <Button
            color="black"
            bgColor={currentColor}
            text="Raise Issue"
            borderRadius="8px"
            width="100px"
            height="40px"
            custumFunc={raiseIssue}
          />
        </div>
      </div>

      {/* Conditionally render the form */}
      {showForm && (
        <div className="flex justify-center items-start h-full sm:flex-row mt-8">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Submit Your Issue</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Describe your issue here..."
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                rows="5"
                required
              ></textarea>
              <div className="flex justify-end mt-4">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text={loading ? "Submitting..." : "Submit"}
                  borderRadius="8px"
                  width="100px"
                  height="40px"
                  custumFunc={handleSubmit}
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table to display issues */}
<div className="overflow-x-auto">
  <h2 className="text-xl font-bold mb-4">Submitted Issues</h2>
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <th className="py-3 px-6 text-left">Issue</th>
        <th className="py-3 px-6 text-left">Raised By</th>
        <th className="py-3 px-6 text-left">Reg Number</th>
        <th className="py-3 px-6 text-left">Date Raised</th>
        <th className="py-3 px-6 text-left">Status</th>
        {user?.isAdmin && <th className="py-3 px-6 text-left">Actions</th>} {/* Show Actions column only for admins */}
      </tr>
    </thead>
    <tbody className="text-gray-600 text-sm font-light">
      {Array.isArray(issues) && issues.length > 0 ? (
        issues.map((issue) => (
          <tr key={issue._id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">
              {issue.issue.length > 10 ? (
                <>
                  {issue.issue.substring(0, 10)}...{" "}
                  <button
                    className="text-blue-500 underline"
                    onClick={() => alert(issue.issue)} // Change this to your read more function or link
                  >
                    Read more
                  </button>
                </>
              ) : (
                issue.issue
              )}
            </td>
            <td className="py-3 px-6 text-left">{issue.userName}</td>
            <td className="py-3 px-6 text-left">{issue.userRegNumber}</td>
            <td className="py-3 px-6 text-left">{new Date(issue.createdAt).toLocaleDateString()}</td>
            <td className={`py-3 px-6 text-left ${issue.status === 'unsolved' ? 'text-red-500' : issue.status === 'progress' ? 'text-yellow-500' : 'text-green-500'}`}>
              {user?.isAdmin ? (
                <select
                  value={issue.status}
                  onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                  className="border rounded-md p-1 pl-3 pr-8" // Add padding on the right
                >
                  <option value="unsolved">Unsolved</option>
                  <option value="progress">In Progress</option>
                  <option value="solved">Solved</option>
                </select>
              ) : (
                issue.status // Just display the status if the user is not an admin
              )}
            </td>
            {user?.isAdmin && (
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => handleDelete(issue._id)} // Handle delete action
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="py-3 px-6 text-center text-gray-500">
            No issues have been raised yet.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </DashboardLayout>
  );
};

export default Dashboard;
