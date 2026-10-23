import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { BASE_URL } from "../../Service/helper";
import { apiGet, apiPost, getErrorMessage } from "../../Service/apiClient";
import { qualifyingVoteCount, statusLabels } from "../../constants/mentorApplications";

const votingRoles = ["Coordinator", "Final Year Coordinator", "Alumni"];

const MentorApplicationDetails = () => {
  const { applicationId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canAdmin = user?.isAdmin === true || ["Coordinator", "Final Year Coordinator", "admin"].includes(user?.role);
  const canApprove = votingRoles.includes(user?.role) &&
    !application?.approvals?.some((approval) => approval.reviewerId === user?._id);
  const qualifyingVotes = qualifyingVoteCount(application?.approvals);

  useEffect(() => {
    apiGet(`/mentorApplications/${applicationId}`)
      .then(({ data }) => setApplication(data))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const perform = async (action) => {
    setError("");
    setSaving(true);
    try {
      const path = `/mentorApplications/${applicationId}`;
      const response = action === "in_review" || action === "interviewed"
        ? await axios.patch(`${BASE_URL}${path}/status`, { status: action })
        : action === "approve"
          ? await apiPost(`${path}/approvals`)
          : await apiPost(`${path}/activate`);
      setApplication(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <main className="m-2 mt-24 rounded-2xl bg-white p-5 md:m-10 md:p-8">
        <Link to="/mentors/applications" className="text-teal-700 underline">← All applications</Link>
        {loading && <p className="mt-6">Loading application...</p>}
        {error && <p role="alert" className="mt-6 rounded bg-red-50 p-3 text-red-700">{error}</p>}
        {application && (
          <>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
              <div><h1 className="text-2xl font-bold">{application.name}</h1><p className="text-gray-600">Application ID: {application.applicationId}</p></div>
              <span className="rounded-full bg-teal-50 px-4 py-2 font-semibold text-teal-800">{statusLabels[application.status]}</span>
            </div>
            <dl className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
              <div><dt className="text-sm text-gray-500">Email</dt><dd>{application.email}</dd></div>
              <div><dt className="text-sm text-gray-500">Phone</dt><dd>{application.phone}</dd></div>
              <div><dt className="text-sm text-gray-500">Registration number</dt><dd>{application.regnumber}</dd></div>
              <div><dt className="text-sm text-gray-500">Branch</dt><dd>{application.branch}</dd></div>
            </dl>
            <section className="mt-7">
              <h2 className="text-lg font-bold">Review progress</h2>
              <p className="mt-1 text-gray-600">Pending → In review → Interviewed → Approved (3 distinct qualifying votes) → Activated</p>
              <p className="mt-1 text-sm text-gray-600">Final Year Coordinator and Alumni votes count toward approval. Coordinator votes are recorded as supporting votes.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {canAdmin && application.status === "pending" && <button disabled={saving} onClick={() => perform("in_review")} className="rounded bg-teal-600 px-4 py-2 text-white disabled:opacity-50">Start review</button>}
                {canAdmin && application.status === "in_review" && <button disabled={saving} onClick={() => perform("interviewed")} className="rounded bg-teal-600 px-4 py-2 text-white disabled:opacity-50">Mark interviewed</button>}
                {application.status === "interviewed" && canApprove && <button disabled={saving} onClick={() => perform("approve")} className="rounded bg-teal-600 px-4 py-2 text-white disabled:opacity-50">{user?.role === "Coordinator" ? "Add supporting vote" : "Approve application"}</button>}
                {canAdmin && application.status === "approved" && <button disabled={saving} onClick={() => perform("activate")} className="rounded bg-teal-600 px-4 py-2 text-white disabled:opacity-50">Activate mentor</button>}
              </div>
              {application.status === "interviewed" && !canApprove && <p className="mt-3 text-sm text-gray-600">You have already voted, or your role cannot vote on this application.</p>}
            </section>
            <section className="mt-7">
              <h2 className="text-lg font-bold">Qualifying approvals ({qualifyingVotes}/3)</h2>
              {application.approvals?.length ? <ul className="mt-3 space-y-2">{application.approvals.map((approval) => (
                <li key={approval.reviewerId} className="rounded border p-3">{approval.reviewerName} · {approval.reviewerRole} · {approval.countsTowardApproval ? "Qualifying approval" : "Supporting vote"} · {new Date(approval.at).toLocaleString()}</li>
              ))}</ul> : <p className="mt-2 text-gray-600">No approvals yet.</p>}
            </section>
            <section className="mt-7"><h2 className="text-lg font-bold">History</h2><ol className="mt-3 space-y-2">{application.history?.map((entry, index) => (
              <li key={`${entry.to}-${index}`} className="border-l-2 border-teal-500 pl-3">{statusLabels[entry.to]} · {new Date(entry.at).toLocaleString()}</li>
            ))}</ol></section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
};

export default MentorApplicationDetails;
