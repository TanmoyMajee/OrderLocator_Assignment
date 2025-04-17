import React, { useState } from 'react'
import axios from 'axios'
import { toast , ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';

function Home() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [ postalCode , setPostalCode] = useState('')
  const [ city , setCity] = useState('')
  const [ country , setCoutry] = useState('')
  const [ state , setState] = useState('')
  const [ street, setStreet] = useState('')
  const [ blockNo , setBlockNo] = useState('')
  const [ specificAddress, setSpecificAddress] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit =async (event) => {
    event.preventDefault()
    // Process the order submission using individual state values
    // console.log('Order submitted:', { name, phone, address, deliveryTime })
    setIsSubmitting(true)
    try{
      const response = await axios.post('https://orderlocatorbackendassigment.vercel.app/orders', {
        name,
        phone,
        address,
        postal_code:postalCode,
        country,
        state,
        city,
        block_no:blockNo,
        street,
        delivery_time:deliveryTime
      }) 
      console.log(response)
      if(response.status === 200) {
        console.log('Order submitted successfully')
        toast.success('Order submitted successfully')
        navigate('/map')
      }
      else {
        toast.error('Addres Not Found')
        console.log('Error submitting order:', response.statusText)
      }
    }catch (error) {
      toast.error('Addres Not Found')
    console.error('Error submitting order:', error)
  }
  finally{
      // Reset the form fields after submission
      setName('')
      setPhone('')
      setAddress('')
      setDeliveryTime('')
      setPostalCode('')
      setCity('')
      setCoutry('')
      setState('')
      setState('')
      setBlockNo('')
      setIsSubmitting(false)
  }

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
        {/* Delivary Time */}
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
       {
        specificAddress ? ( 
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address*
          </label>
          <input
            type="text"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <label onClick={()=>setSpecificAddress(!specificAddress)} className="block text-sm font-medium text-gray-700 mb-1 hover:cursor-pointer">
            Enter More Specific Address
            </label>
        </div>) 
        : (
       
           <div>
          <div>
          <label  className="block text-sm font-medium text-gray-700 mb-1">
            Country*
          </label>
          <input
            type="text"
            value={country}
            required
            onChange={(e) => setCoutry(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* State */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State*
          </label>
          <input
            type="text"
            value={state}
            required
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* City */}
          <div>
          <label  className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
                {/* Streeet */}
          <div>
          <label  className="block text-sm font-medium text-gray-700 mb-1">
            street*
          </label>
          <input
            type="text"
            value={street}
            required
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
                {/* postal Code */}
          <div>
          <label  className="block text-sm font-medium text-gray-700 mb-1">
            postalCode
          </label>
          <input
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
                     {/* Enter Home / block No */}
          <div>
          <label  className="block text-sm font-medium text-gray-700 mb-1">
            Home / Block No
          </label>
          <input
            value={blockNo}
            required
            onChange={(e) => setBlockNo(e.target.value)}
            placeholder="Enter preferred delivery time"
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
         <label onClick={()=>setSpecificAddress(!specificAddress)} className="block text-sm font-medium text-gray-700 mb-1 hover:cursor-pointer">
            Enter genneric Address
            </label>
        </div>
        )
       }
       
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={10} color="white" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Order'
          )}
        </button>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Home
