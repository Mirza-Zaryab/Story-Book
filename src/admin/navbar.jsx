import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = ({ name, show, onClick, goBack, url }) => {
  return (
    <div className="px-8 pt-8 pb-2 border-b-2 flex justify-between">
      <div className="flex items-center">
        {url ? (
          <h2
            className="text-2xl font-extrabold tracking-tight text-gray-900 text-left"
            style={{
              marginRight: "15px",
              marginTop: "4px",
            }}
          >
            {" "}
            <Link to={url}>
              <IoArrowBackOutline />
            </Link>
          </h2>
        ) : null}

        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 text-left">
          {" "}
          {name}{" "}
        </h2>
        {show && (
          <button
            onClick={onClick}
            className="bg-teal-600 ml-4"
            style={styles.saveButton}
          >
            Add New {show}
          </button>
        )}
      </div>

      <div className="flex justify-center items-center">
        <p className="mr-2 font-semibold text-lg">Admin</p>
        <FaUserCircle className="w-10 h-10 color-charcoal" />
      </div>
    </div>
  );
};

const styles = {
  saveButton: {
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "3px",
    cursor: "pointer",
    marginRight: "2px",
  },
};

export default Navbar;
