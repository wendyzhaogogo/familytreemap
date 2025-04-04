import React from 'react'
import { Link } from 'react-router-dom'
import { FaTree, FaUserPlus, FaUserEdit } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800">
      <ul className="flex gap-8 p-0 m-0 list-none">
        <li>
          <Link to="/" className="flex items-center gap-2 text-lg text-white no-underline transition-colors hover:text-blue-400">
            <FaTree /> Family Tree
          </Link>
        </li>
        <li>
          <Link to="/add" className="flex items-center gap-2 text-lg text-white no-underline transition-colors hover:text-blue-400">
            <FaUserPlus /> Add Member
          </Link>
        </li>
        <li>
          <Link to="/edit" className="flex items-center gap-2 text-lg text-white no-underline transition-colors hover:text-blue-400">
            <FaUserEdit /> Edit Members
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar 