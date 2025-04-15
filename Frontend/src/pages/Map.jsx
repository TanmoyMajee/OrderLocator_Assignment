

import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'  // Add this import
import axios from 'axios'

function Map() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://orderlocatorbackendassigment.vercel.app/orders')
        console.log(response.data)
        setOrders(response.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchOrders()
  }, [])
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      <div className="w-[1500px] h-[600px] m-5">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: 17.80879, lng: 79.39076 }}
          zoom={4}
        >
          {orders.map((order) => (
            <Marker
              key={order.id}
              position={{ 
                lat: parseFloat(order.latitude), 
                lng: parseFloat(order.longitude) 
              }}
              onClick={() => {
                setSelectedOrder(order)
                toast.info(`Order ID: ${order.id}`, {
                  position: "bottom-right",  // Changed format
                  autoClose: 2000,
                })
              }}
            />
          ))}
          
          {selectedOrder && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedOrder.latitude), 
                lng: parseFloat(selectedOrder.longitude) 
              }}
              onCloseClick={() => setSelectedOrder(null)}
            >
              <div>
                <h2>{selectedOrder.name}</h2>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.delivery_time}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  )
}

export default Map