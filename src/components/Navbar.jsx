import React from 'react'
import { Link } from 'react-router-dom'
import { FaTree, FaUserPlus } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex gap-8 list-none m-0 p-0">
        <li>
          <Link to="/" className="text-white no-underline flex items-center gap-2 text-lg hover:text-blue-400 transition-colors">
            <FaTree /> Family Tree
          </Link>
        </li>
        <li>
          <Link to="/add" className="text-white no-underline flex items-center gap-2 text-lg hover:text-blue-400 transition-colors">
            <FaUserPlus /> Add Member
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar 