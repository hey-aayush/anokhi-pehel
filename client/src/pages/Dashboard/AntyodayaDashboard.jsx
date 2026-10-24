import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import ErrorMessageModel from "../../components/Models/ErrorMessageModel";
import { BASE_URL } from "../../Service/helper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaCalendarAlt, FaSchool, FaTrophy, FaArrowRight, FaUserPlus, FaCalendarPlus, FaClipboardList, FaUserTie, FaAddressBook } from "react-icons/fa";
const extractYear = (val) => { const m = String(val || "").match(/\b2[kK](\d{2})\b/) || String(val || "").match(/\b(19\d{2}|20\d{2})\b/); return m ? (m[1].length === 2 ? 2000 + Number(m[1]) : Number(m[1])) : (!isNaN(Number(val)) && Number(val) >= 1990 && Number(val) <= 2100 ? Number(val) : null); };
const Dashboard = () => {
  const [events, setEvents] = useState([]), [participants, setParticipants] = useState([]), [winnerList, setWinnerList] = useState([]), [poc, setPoc] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()), [loading, setLoading] = useState(true), [error, setError] = useState(null), [showErrorModal, setShowErrorModal] = useState(false);
  const addEvent = () => {
    navigate("/addEvent");
  };
  const checkEvents = () => {
    navigate("/checkEvents");
  };
  const addParticipants = () => {
    navigate("/addParticipant");
  };
  const findParticipants = () => {
    navigate("/viewParticipants");
  };

  const addPoc = () => {
    navigate("/addPoc");
  };
  const viewPoc = () => {
    navigate("/viewPoc");
  };
  const winners = () => {
    navigate("/viewWinners");
  };

  const ACTIONS = [
    { title: "Add Participant", description: "Register a new participant for events", icon: FaUserPlus, action: addParticipants },
    { title: "View Participants", description: "Manage registered participants and details", icon: FaUsers, action: findParticipants },
    { title: "Add Event", description: "Create and configure new festival events", icon: FaCalendarPlus, action: addEvent, adminOnly: true },
    { title: "Check Events", description: "View scheduled upcoming and past events", icon: FaClipboardList, action: checkEvents },
    { title: "Add School POC", description: "Register a point of contact for a school", icon: FaUserTie, action: addPoc },
    { title: "View School POC", description: "View and manage school contact information", icon: FaAddressBook, action: viewPoc },
    { title: "Winner List", description: "View and export winners across all events", icon: FaTrophy, action: winners },
  ];

  const allYears = useMemo(() => Array.from(new Set([...events.map((e) => extractYear(e.year || e.festName)), ...poc.map((p) => extractYear(p.year))].filter(Boolean))).sort((a, b) => b - a), [events, poc]);

  useEffect(() => {
    if (allYears.length > 0) setSelectedYear((prev) => (prev === "all" || !allYears.includes(Number(prev)) ? allYears[0] : prev));
    else if (!loading) setSelectedYear("all");
  }, [allYears, loading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true); setError(null);
      const [eventsRes, pocRes, partRes, winRes] = await Promise.all([
        axios.get(`${BASE_URL}/getEvents`), axios.get(`${BASE_URL}/pocList`), axios.get(`${BASE_URL}/participantList`), axios.get(`${BASE_URL}/getEventsWithWinners`),
      ]);
      setEvents(eventsRes.data || []); setPoc(pocRes.data || []); setParticipants(partRes.data || []); setWinnerList(winRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err); setError("Failed to fetch Antyodaya dashboard data. Please try again."); setShowErrorModal(true);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const filtered = useMemo(() => {
    const isAll = selectedYear === "all", yr = Number(selectedYear);
    return {
      participants: isAll ? participants : participants.filter((p) => extractYear(p.year) === yr),
      events: isAll ? events : events.filter((e) => extractYear(e.year || e.festName) === yr),
      poc: isAll ? poc : poc.filter((p) => extractYear(p.year) === yr),
      winners: isAll ? winnerList : winnerList.filter((w) => extractYear(w.year || w.festName) === yr),
    };
  }, [participants, events, poc, winnerList, selectedYear]);

  const stats = [
    { label: "Participants", icon: FaUsers, count: filtered.participants.length, sub: selectedYear === "all" ? "All-time registered" : `Registered for ${selectedYear}` },
    { label: "Events", icon: FaCalendarAlt, count: filtered.events.length, sub: selectedYear === "all" ? "Total active events" : `Competitions in ${selectedYear}` },
    { label: "Schools", icon: FaSchool, count: filtered.poc.length, sub: selectedYear === "all" ? "Partner institutions" : `Connected POCs in ${selectedYear}` },
    { label: "Winners", icon: FaTrophy, count: 0, sub: selectedYear === "all" ? "Across all competitions" : `Awarded in ${selectedYear}` },
  ];

  return (
    <DashboardLayout>
      <ErrorMessageModel isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} onRetry={() => { setShowErrorModal(false); fetchDashboardData(); }} title="Dashboard Error" message={error} />
      <div className="m-3 sm:m-4 md:m-10 mt-20 sm:mt-24 p-4 sm:p-5 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800">
            Welcome Back! {user ? user.name : "Mentor"}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Antyodaya Annual Fest Management — Manage events, student participants, school POCs, and winners
          </p>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-10 pb-10 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-end px-0.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-sm transition-all">
            <FaCalendarAlt className="text-indigo-600 text-xs shrink-0" />
            <span className="text-slate-500 text-[11px] sm:text-xs font-medium">Year:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent font-semibold text-slate-800 border-0 border-none outline-none focus:outline-none focus:ring-0 cursor-pointer text-xs pr-1 shadow-none" aria-label="Filter stats by year">
              <option value="all">All Years</option>
              {allYears.map((yr) => (<option key={yr} value={yr}>{yr}</option>))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                  <div className="h-7 w-7 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="h-7 bg-slate-200 rounded w-14"></div>
                <div className="h-2.5 bg-slate-100 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px] sm:text-xs">{item.label}</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="text-xs sm:text-sm" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight block">{item.count}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block mt-0.5 truncate">{item.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 md:p-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-3.5 mb-3.5 sm:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800">Actions & Management</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Quick shortcuts to manage participants, events, school contacts, and competition results
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {ACTIONS.filter((item) => !item.adminOnly || user?.isAdmin === true).map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.title} onClick={item.action} className="flex items-center gap-3 sm:gap-3.5 rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4 text-left hover:bg-slate-100/80 cursor-pointer">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="text-sm sm:text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-800 truncate">{item.title}</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">{item.description}</p>
                  </div>
                  <FaArrowRight className="text-xs text-indigo-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;