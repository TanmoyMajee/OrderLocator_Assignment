import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const navigate = useNavigate()

  const handleSubmit =async (event) => {
    event.preventDefault()
    // Process the order submission using individual state values
    // console.log('Order submitted:', { name, phone, address, deliveryTime })
    try{
      const response =await axios.post('https://orderlocatorbackendassigment.vercel.app/orders', {
        name,
        phone,
        address,
        delivery_time:deliveryTime
      }) 
      console.log(response)
      if(response.status === 200) {
        console.log('Order submitted successfully')
        toast.success('Order submitted successfully')
        navigate('/map')
      }
      else {
        toast.error('Error submitting order')
        console.log('Error submitting order:', response.statusText)
      }
    }catch (error) {
    console.error('Error submitting order:', error)
  }
    // Reset the form fields after submission
    setName('')
    setPhone('')
    setAddress('')
    setDeliveryTime('')

  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Time
          </label>
          <input
            type="text"
            id="deliveryTime"
            value={deliveryTime}
            required
            onChange={(e) => setDeliveryTime(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Order
        </button>
      </form>
    </div>
  )
}

export default Home
