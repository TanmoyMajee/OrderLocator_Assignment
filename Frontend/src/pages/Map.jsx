
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.914933000000001,77.67554133302036]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);  //http://127.0.0.1:8000
        // const response = await axios.get('http://127.0.0.1:8000/orders');
        const response = await axios.get('https://orderlocatorbackendassigment.vercel.app/orders');
        console.log(response.data);
        setOrders(response.data);

        // If we have orders with coordinates, center the map on the first one
        if (response.data.length > 0 && response.data[0].latitude && response.data[0].longitude) {
          setMapCenter([response.data[0].latitude, response.data[0].longitude]);
        }

        setIsLoading(false);
        toast.success(`Total Order : ${response.data.length}`)
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ClipLoader size={100} />
      </div>
    );
  }

  return (
    <div className="map-container" style={{ height: '90vh', width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {orders.map((order) => (
          <Marker
            key={order.id}
            position={[order.latitude, order.longitude]}
            eventHandlers={{
              click: () => {
                setSelectedOrder(order);
                toast.info(`Order ID: ${order.id}`, {
                  position: "bottom-right",
                  autoClose: 2000,
                });
              }
            }}
          >
            <Popup onClose={() => setSelectedOrder(null)}>
              <div>
                <h3>{order.name}</h3>
                <p>Ph:{order.phone}</p>
                <p>Delivery: {order.delivery_time}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <ToastContainer />
    </div>
  );
}

export default Map;