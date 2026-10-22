import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/Home/HomePage";
import AdminLogin from "./pages/Home/Login";
import PageNotFound from "./pages/Error404";
import "antd/dist/reset.css";
import Blog from "./pages/Home/Blog";
import Gallery from "./pages/Home/Gallery";
import Team from "./pages/Home/Team";
import ConnectWithUs from "./pages/Home/ConnectWithUs";
import ForgotPassword from "./pages/Home/ForgotPassword";
import BackToSchool from "./pages/Home/BackToSchool";
import Antyodaya from "./pages/Home/Antyodaya";
import JoinAsMentor from "./pages/Home/JoinAsMentor";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Student = lazy(() => import("./pages/Dashboard/Student"));
const Mentor = lazy(() => import("./pages/Dashboard/Mentor"));
const AddStudents = lazy(() => import("./pages/Dashboard/AddStudents"));
const AddMentors = lazy(() => import("./pages/Dashboard/AddMentor"));
const StudentProfile = lazy(() => import("./pages/Dashboard/StudentProfile"));
const MentorProfile = lazy(() => import("./pages/Dashboard/MentorProfile"));
const Schedule = lazy(() => import("./pages/Dashboard/Schedule"));
const AddLineSchedule = lazy(() => import("./pages/Dashboard/AddLineSchedule"));
const AddClassSchedule = lazy(() => import("./pages/Dashboard/AddClassSchedule"));
const ClassSchedule = lazy(() => import("./pages/Dashboard/ViewClassSchedule"));
const LineSchedule = lazy(() => import("./pages/Dashboard/ViewLineSchedule"));
const AddTestScore = lazy(() => import("./pages/Dashboard/AddTestScore"));
const PerformancePage = lazy(() => import("./pages/Performance/PerformancePage"));
const StudentsScoreTabular = lazy(() => import("./pages/Performance/StudentsScoreTabular"));
const TakeAttendance = lazy(() => import("./pages/Dashboard/TakeAttendance"));
const Attendance = lazy(() => import("./pages/Dashboard/Attendance"));
const AttendanceTable = lazy(() => import("./pages/Dashboard/AttendanceTable"));
const AddTopic = lazy(() => import("./pages/Dashboard/AddTopic"));
const FindTopic = lazy(() => import("./pages/Dashboard/FindTopic"));
const ChangePassword = lazy(() => import("./components/Dashboard/ChangePassword"));
const EditProfile = lazy(() => import("./components/Dashboard/EditProfile"));
const ChangeRole = lazy(() => import("./pages/Dashboard/ChangeRole"));
const EditStudent = lazy(() => import("./pages/Dashboard/EditStudent"));
const Alumni = lazy(() => import("./pages/Dashboard/Alumni"));
const Notice = lazy(() => import("./pages/Dashboard/Notice"));
const Admission = lazy(() => import("./pages/Dashboard/Admission"));
const AdmittedStudents = lazy(() => import("./pages/Dashboard/AdmittedStudents"));
const AdmittedStudentProfile = lazy(() => import("./pages/Dashboard/AdmittedStudentProfile"));
const AtyodayaDashboard = lazy(() => import("./pages/Dashboard/AntyodayaDashboard"));
const AddEvent = lazy(() => import("./pages/Dashboard/AddEvent"));
const EventList = lazy(() => import("./pages/Dashboard/EventList"));
const EventDetails = lazy(() => import("./pages/Dashboard/EventDetails"));
const EditEvent = lazy(() => import("./pages/Dashboard/EditEvent"));
const AddPoc = lazy(() => import("./pages/Dashboard/AddPoc"));
const ViewPoc = lazy(() => import("./pages/Dashboard/ViewPoc"));
const AddAtyodayaParticipant = lazy(() => import("./pages/Dashboard/AddAntyodayaParticipant"));
const ViewParticipants = lazy(() => import("./pages/Dashboard/ViewParticipant"));
const ParticipantProfile = lazy(() => import("./pages/Dashboard/ParticipantProfile"));
const Issue = lazy(() => import("./pages/Dashboard/Issue"));
const Winners = lazy(() => import("./pages/Dashboard/Winners"));
const StudentScoresPictorially = lazy(() => import("./pages/Performance/StudentScoresPictorially"));
const PromoteStudents = lazy(() => import("./pages/Dashboard/PromoteStudents"));
const Email_Service = lazy(() => import("./pages/Dashboard/Email_Service"));
const App = () => {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Suspense fallback={<Spinner />}>
            <Routes>
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Scores"
              element={
                <ProtectedRoute>
                  <StudentsScoreTabular />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Scores-Pict"
              element={
                <ProtectedRoute>
                  <StudentScoresPictorially />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editStudent"
              element={
                <ProtectedRoute>
                  <EditStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/changeRole"
              element={
                <ProtectedRoute>
                  <ChangeRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkEvents"
              element={
                <ProtectedRoute>
                  <EventList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editProfile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewWinners"
              element={
                <ProtectedRoute>
                  <Winners />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Issue"
              element={
                <ProtectedRoute>
                  <Issue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ParticipantProfile"
              element={
                <ProtectedRoute>
                  <ParticipantProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewParticipants"
              element={
                <ProtectedRoute>
                  <ViewParticipants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addParticipant"
              element={
                <ProtectedRoute>
                  <AddAtyodayaParticipant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addPoc"
              element={
                <ProtectedRoute>
                  <AddPoc />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewPoc"
              element={
                <ProtectedRoute>
                  <ViewPoc />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Admission"
              element={
                <ProtectedRoute>
                  <AdmittedStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddAdmission"
              element={
                <ProtectedRoute>
                  <Admission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/PromotingStudents"
              element={
                <ProtectedRoute>
                  <PromoteStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editEvent"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkAttendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/changePassword"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Antyodaya-Dashboard"
              element={
                <ProtectedRoute>
                  <AtyodayaDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/totalAttendance"
              element={
                <ProtectedRoute>
                  <AttendanceTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addEvent"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/findTopic"
              element={
                <ProtectedRoute>
                  <FindTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addTopic"
              element={
                <ProtectedRoute>
                  <AddTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/takeAttendance"
              element={
                <ProtectedRoute>
                  <TakeAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admittedStudentProfile"
              element={
                <ProtectedRoute>
                  <AdmittedStudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studentProfile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentorProfile"
              element={
                <ProtectedRoute>
                  <MentorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/eventManagement"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addLineSchedule"
              element={
                <ProtectedRoute>
                  <AddLineSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addClassSchedule"
              element={
                <ProtectedRoute>
                  <AddClassSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classSchedule"
              element={
                <ProtectedRoute>
                  <ClassSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lineSchedule"
              element={
                <ProtectedRoute>
                  <LineSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addTestScore"
              element={
                <ProtectedRoute>
                  <AddTestScore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Students"
              element={
                <ProtectedRoute>
                  <Student />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Mentors"
              element={
                <ProtectedRoute>
                  <Mentor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Alumni"
              element={
                <ProtectedRoute>
                  <Alumni />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddStudents"
              element={
                <ProtectedRoute>
                  <AddStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Notice"
              element={
                <ProtectedRoute>
                  <Notice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Email-Service"
              element={
                <ProtectedRoute>
                  <Email_Service />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddMentors7282vdsghbhdghd"
              element={
                <ProtectedRoute>
                  <AddMentors />
                </ProtectedRoute>
              }
            />
            <Route path="/Join" element={<JoinAsMentor />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/forgotPassword"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/connectWithUs" element={<ConnectWithUs />} />
            <Route path="/backToSchool" element={<BackToSchool />} />
            <Route path="/Antyodaya" element={<Antyodaya />} />
            <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
