import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import OrderDetails from './Order_Details';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    firebase
      .firestore()
      .collection('orders')
      .get()
      .then((querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleSearch = () => {
    const filteredOrders = orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setSelectedOrder(filteredOrders.length > 0 ? filteredOrders[0] : null);
  };

  return (
    <div className="order_container">
      <h2>All Orders</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="orders-list">
        {selectedOrder ? (
          <div className="order-details-container">
            <OrderDetails order={selectedOrder} />
          </div>
        ) : (
          <div className="no-order-selected">
            <p>No order selected. Choose an order or search for one.</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="order">
            <div className="order-info">
              <strong>Order ID:</strong> {order.id}
              <br />
              <strong>User ID:</strong> {order.userId}
              <br />
              <strong>Order Status:</strong> {order.orderStatus}
              <br />
              <strong>Total Price:</strong> ${order.totalPrice}
              <br />
              <strong>Timestamp:</strong> {order.timestamp.toDate().toLocaleString()}
            </div>
            <div className="order-buttons">
                <button onClick={() => handleViewDetails(order)}>View Details</button>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;