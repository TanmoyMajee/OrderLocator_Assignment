import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">

      <div className="text-xl font-bold">
        Quick Order
      </div>

      <div className="flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'bg-white text-blue-600 px-4 py-2 rounded font-semibold'
              : 'bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition'
          }
        >
          Order Form
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive
              ? 'bg-white text-blue-600 px-4 py-2 rounded font-semibold'
              : 'bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition'
          }
        >
          View Map
        </NavLink>
      </div>

    </div>
  )
}

export default Navbar
