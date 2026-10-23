import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { apiGet, getErrorMessage } from "../../Service/apiClient";
import { qualifyingVoteCount, statusLabels } from "../../constants/mentorApplications";

const MentorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/mentorApplications")
      .then(({ data }) => setApplications(data))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <main className="m-2 mt-24 rounded-2xl bg-white p-5 md:m-10 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor applications</h1>
            <p className="mt-1 text-sm text-gray-600">Open an application to review its progress and approvals.</p>
          </div>
          <Link to="/Mentors" className="text-teal-700 underline">Back to mentors</Link>
        </div>
        {loading && <p className="mt-6">Loading applications...</p>}
        {error && <p role="alert" className="mt-6 text-red-700">{error}</p>}
        {!loading && !error && applications.length === 0 && <p className="mt-6 text-gray-600">No applications yet.</p>}
        {!loading && !error && applications.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-700"><tr>
                <th className="p-3">Application ID</th><th className="p-3">Applicant</th>
                <th className="p-3">Status</th><th className="p-3">Approvals</th><th className="p-3">Submitted</th>
              </tr></thead>
              <tbody>{applications.map((application) => (
                <tr key={application.applicationId} className="border-b">
                  <td className="p-3"><Link className="font-semibold text-teal-700 underline" to={`/mentors/applications/${application.applicationId}`}>{application.applicationId}</Link></td>
                  <td className="p-3">{application.name}<span className="block text-gray-500">{application.email}</span></td>
                  <td className="p-3">{statusLabels[application.status] || application.status}</td>
                  <td className="p-3">{qualifyingVoteCount(application.approvals)}/3{application.approvals?.length > qualifyingVoteCount(application.approvals) && <span className="block text-gray-500">{application.approvals.length - qualifyingVoteCount(application.approvals)} supporting</span>}</td>
                  <td className="p-3">{new Date(application.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default MentorApplications;
