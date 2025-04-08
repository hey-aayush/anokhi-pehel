import { useState } from "react";
import { close, menu, logo } from "../../assets/Home";
import { navLinks } from "../../constants/Home";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-4 -mb-2 -mt-2 justify-between items-center navbar">
      {/* Logo and Title */}
      <Link to="/">
        <img src={logo} alt="Anokhi पहल" className="w-[50px] h-[50px]" />
      </Link>
      <span className="ml-3 mt-2 text-xl text-black font-extrabold tracking-tight text-slate-900">
        <Link to="/">Anokhi पहल</Link>
      </span>

      {/* Desktop Nav */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`relative font-poppins font-medium cursor-pointer text-[16px] pb-1 mx-4
              ${active === nav.title ? "text-black font-bold" : "text-slate-900"}
              before:content-[''] before:absolute before:bottom-0 before:left-0
              before:h-[3px] before:bg-teal-400 before:rounded-full
              before:w-0 hover:before:w-full
              before:transition-all before:duration-500
              ${active === nav.title ? "before:w-full" : ""}
            `}
            onClick={() => setActive(nav.title)}
          >
            <Link to={`/${nav.id}`}>{nav.title}</Link>
          </li>
        ))}
      </ul>

      {/* Mobile Nav */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-gray-100 absolute top-20 right-0 mx-4 my-2 min-w-[160px] rounded-xl sidebar z-10`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`relative font-poppins font-medium cursor-pointer text-[16px] pb-1 my-2
                  ${active === nav.title ? "text-black font-bold" : "text-gray-600"}
                  before:content-[''] before:absolute before:bottom-0 before:left-0
                  before:h-[3px] before:bg-teal-400 before:rounded-full
                  before:w-0 hover:before:w-full
                  before:transition-all before:duration-500
                  ${active === nav.title ? "before:w-full" : ""}
                `}
                onClick={() => {
                  setActive(nav.title);
                  setToggle(false);
                }}
              >
                <Link to={`/${nav.id}`}>{nav.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
