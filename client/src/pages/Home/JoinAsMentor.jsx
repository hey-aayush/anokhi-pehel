import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BRANCH } from "../../constants/Dashboard";
import { apiGet, apiPost, getErrorMessage } from "../../Service/apiClient";
import HomePageLayout from "../../components/Home/HomePageLayout";

const emptyForm = {
  name: "", email: "", phone: "", regnumber: "", branch: "",
  password: "", linkedin: "", instagram: "",
};

const JoinAsMentor = () => {
  const [form, setForm] = useState(emptyForm);
  const [accepting, setAccepting] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    apiGet("/settings")
      .then(({ data }) => setAccepting(data.find((item) => item.key === "isAcceptingResponse")?.value === true))
      .catch(() => setFeedback({ type: "error", text: "Unable to check whether applications are open. Please try again later." }))
      .finally(() => setLoadingSettings(false));
  }, []);

  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const { data } = await apiPost("/mentorApplications", form);
      setFeedback({ type: "success", text: data.message, applicationId: data.applicationId, emailSent: data.emailSent });
      setForm(emptyForm);
    } catch (error) {
      setFeedback({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "name", label: "Name", maxLength: 100 },
    { name: "email", label: "Email", type: "email", maxLength: 254 },
    { name: "phone", label: "Phone", type: "tel", maxLength: 30 },
    { name: "regnumber", label: "Registration number", maxLength: 50 },
  ];

  return (
    <HomePageLayout>
      <main className="mx-auto my-12 max-w-2xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-2xl font-bold text-gray-900">Apply to be a mentor</h1>
        <p className="mt-2 text-gray-600">Your application will be reviewed by an administrator before you can sign in.</p>
        {feedback && <div role="alert" className={`mt-4 rounded p-3 ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          <p>{feedback.text}</p>
          {feedback.applicationId && <p className="mt-2 font-semibold">Application ID: {feedback.applicationId}</p>}
          {feedback.applicationId && <p className="mt-1 text-sm">{feedback.emailSent ? "We also emailed this ID to you." : "Email delivery was unavailable. Please save this ID now."}</p>}
        </div>}
        {loadingSettings ? <p className="mt-6">Checking applications...</p> : accepting ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {fields.map(({ name, label, type = "text", maxLength }) => (
              <label key={name} className="block font-medium text-gray-800" htmlFor={name}>
                {label}
                <input id={name} name={name} type={type} required maxLength={maxLength} value={form[name]} onChange={onChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
              </label>
            ))}
            <label className="block font-medium text-gray-800" htmlFor="branch">Branch
              <select id="branch" name="branch" required value={form.branch} onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2">
                <option value="">Select a branch</option>
                {Object.values(BRANCH).map((branch) => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </label>
            <label className="block font-medium text-gray-800" htmlFor="password">Password
              <input id="password" name="password" type="password" required minLength={8} maxLength={72} value={form.password} onChange={onChange}
                autoComplete="new-password" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
              <span className="mt-1 block text-sm font-normal text-gray-600">At least 8 characters, including uppercase, lowercase, a number, and one of @$!%*?&#.</span>
            </label>
            <label className="block font-medium text-gray-800" htmlFor="linkedin">LinkedIn ID (optional)
              <input id="linkedin" name="linkedin" maxLength={100} value={form.linkedin} onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </label>
            <label className="block font-medium text-gray-800" htmlFor="instagram">Instagram ID (optional)
              <input id="instagram" name="instagram" maxLength={100} value={form.instagram} onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </label>
            <button type="submit" disabled={submitting} className="rounded-md bg-teal-600 px-5 py-2 text-white disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        ) : <p className="mt-6 text-gray-700">Mentor applications are currently closed. You can <Link className="text-teal-700 underline" to="/connectWithUs">contact us</Link> for more information.</p>}
      </main>
    </HomePageLayout>
  );
};

export default JoinAsMentor;
