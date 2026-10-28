import {
  FaUsers,
  FaCalendarPlus,
  FaClipboardList,
  FaUserTie,
  FaAddressBook,
  FaTrophy,
  FaUserPlus,
  FaCalendarAlt,
  FaSchool,
  FaArrowRight,
} from "react-icons/fa";

export const ANTYODAYA_ACTIONS = [
  {
    title: "Add Participant",
    description: "Register a new participant for events",
    icon: FaUserPlus,
    path: "/addParticipant",
  },
  {
    title: "View Participants",
    description: "Manage registered participants and details",
    icon: FaUsers,
    path: "/viewParticipants",
  },
  {
    title: "Add Event",
    description: "Create and configure new festival events",
    icon: FaCalendarPlus,
    path: "/addEvent",
    adminOnly: true,
  },
  {
    title: "Check Events",
    description: "View scheduled upcoming and past events",
    icon: FaClipboardList,
    path: "/checkEvents",
  },
  {
    title: "Add School POC",
    description: "Register a point of contact for a school",
    icon: FaUserTie,
    path: "/addPoc",
  },
  {
    title: "View School POC",
    description: "View and manage school contact information",
    icon: FaAddressBook,
    path: "/viewPoc",
  },
  {
    title: "Winner List",
    description: "View and export winners across all events",
    icon: FaTrophy,
    path: "/viewWinners",
  },
];

export {
  FaUsers,
  FaCalendarAlt,
  FaSchool,
  FaTrophy,
  FaArrowRight,
};
