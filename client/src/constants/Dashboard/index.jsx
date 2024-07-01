import { AiOutlineUserAdd } from "react-icons/ai";
import { BiHelpCircle, BiSolidSpreadsheet } from "react-icons/bi";
import { PiStudentFill } from "react-icons/pi";
import { SiBytedance } from "react-icons/si";
import { MdSimCardAlert } from "react-icons/md";
import { GiGamepadCross, GiTeacher, GiChart, GiPencil } from "react-icons/gi";
import { FaBook } from "react-icons/fa";

export const links = [
  {
    title: "Academics",
    links: [
      {
        name: "Students",
        icon: <PiStudentFill />,
      },
      {
        name: "Mentors",
        icon: <GiTeacher />,
      },
      {
        name: "Schedule",
        icon: <FaBook />,
      },
      {
        name: "AddTestScore",
        icon: <GiPencil />,
      },
      {
        name: "Performance",
        icon: <GiChart />,
      },
      {
        name: "StudyPlan",
        icon: <BiSolidSpreadsheet />,
      },
      {
        name: "Notice",
        icon: <MdSimCardAlert />,
      },
    ],
  },

  {
    title: "Activity",
    links: [
      {
        name: "Cultural Fest",
        icon: <SiBytedance />,
      },
      {
        name: "Antyodaya",
        icon: <GiGamepadCross />,
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        name: "Issue",
        icon: <BiHelpCircle />,
      },
      {
        name: "Volunteer",
        icon: <AiOutlineUserAdd />,
      },
    ],
  },
];
export const classes = [
  { id: "Nursery", name: "Nursery" },
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
  { id: "Navodaya", name: "Navodaya" },
  { id: "6", name: "6" },
  { id: "7", name: "7" },
  { id: "8", name: "8" },
  { id: "9", name: "9" },
  { id: "10", name: "10" },
  { id: "11", name: "11" },
  { id: "12", name: "12" },
];
export const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export const locations = [
  { id: "Nayagaon", location: "Nayagaon" },
  { id: "Chilla", location: "Chilla" },
  { id: "Shivkuti", location: "Shivkuti" },
  { id: "Swarajnagar", location: "Swarajnagar" },
  { id: "Kashiram", location: "Kashiram" },
  { id: "Phaphamau", location: "Phaphamau" },
  { id: "other", location: "Other" },
];

export const modes = [
  { id: "Self-parent", mode: "Self-parent" },
  { id: "Self-cycle", mode: "Self-cycle" },
  { id: "Line Patel Gate", mode: "Line Patel Gate" },
  { id: "Line Ganga Gate", mode: "Line Ganga Gate" },
  { id: "Line Nayagaon", mode: "Line Nayagaon" },
  { id: "Line Phaphamau", mode: "Line Phaphamau" },
  { id: "Line Shivkuti", mode: "Line Shivkuti" },
];

export const ROLES = {
  FINAL_YEAR_COORDINATOR: "Final Year Coordinator",
  ADMIN: "Admin",
  COORDINATOR: "Coordinator",
  ALUMNI: "Alumni",
};

export const day = [
  { id: "Sunday", day: "Sunday" },
  { id: "Monday", day: "Monday" },
  { id: "Tuesday", day: "Tuesday" },
  { id: "Wednesday", day: "Wednesday" },
  { id: "Thursday", day: "Thursday" },
  { id: "Friday", day: "Friday" },
  { id: "Saturday", day: "Saturday" },
];

export const subjects = [
  { id: "Maths", subject: "Maths" },
  { id: "Hindi", subject: "Hindi" },
  { id: "Science", subject: "Science" },
  { id: "Social Science", subject: "Social Science" },
  { id: "English", subject: "English" },
  { id: "Physics", subject: "Physics" },
  { id: "Chemistry", subject: "Chemistry" },
  { id: "Biology", subject: "Biology" },
  { id: "Aptitude", subject: "Aptitude" },
  { id: "Test", subject: "Test" },
  { id: "GK", subject: "GK" },
  { id: "General", subject: "General" },
  { id: "Others", subject: "Others" },
];

export const BRANCH = {
  CSE: "Computer Science and Engineering",
  ECE: "Electronics and Communication Engineering",
  CE: "Civil Engineering",
  IT: "Information Technology",
  BT: "Biotechnology",
  CHE: "Chemical Engineering",
  EE: "Electrical Engineering",
  PIE: "Production and Industrial Engineering",
  ME: "Mechanical Engineering",
  ECM: "Engineering and Computational Mechanics",
  MSE: "Materials Engineering",
};
