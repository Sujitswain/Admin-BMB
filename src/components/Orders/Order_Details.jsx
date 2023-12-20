import React, { useState } from 'react';
import { firebase } from '../config';

import './Order_details.css'

const Order_Details = ({ order }) => {
  const [newOrderStatus, setNewOrderStatus] = useState(order.orderStatus);

  const handleUpdateOrderStatus = () => {
    firebase
      .firestore()
      .collection('orders')
      .doc(order.id)
      .update({ orderStatus: newOrderStatus })
      .then(() => {
        console.log('Order status updated successfully.');
        alert("Order status updated successfully.");
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };

  if (!order) {
    return <div>No order details available.</div>;
  }

  return (
    <div className="order-details-main-container">
      <h3>Order Details</h3>
      <div>
        <strong>Order ID:</strong> {order.id}
      </div>
      <div>
        <strong>User ID:</strong> {order.userId}
      </div>
      <div>
        <strong>Order Status:</strong>
        <select
          value={newOrderStatus}
          onChange={(e) => setNewOrderStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div>
        <strong>Total Price:</strong> ${order.totalPrice}
      </div>
      <div>
        <strong>Timestamp:</strong>{' '}
        {order.timestamp ? order.timestamp.toDate().toLocaleString() : 'N/A'}
      </div>
      <div>
        <strong>Address:</strong> {order.address}
      </div>
      <div>
        <strong>Items:</strong>
        <ul>
          {order.items ? (
            order.items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>Item ID:</strong> {item.id}
                </div>
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Price:</strong> ${item.price}
                </div>
                <div>
                  <strong>Quantity:</strong> {item.quantity}
                </div>
              </li>
            ))
          ) : (
            <li>No items available.</li>
          )}
        </ul>
      </div>
      <button onClick={handleUpdateOrderStatus}>Update Order Status</button>
    </div>
  );
};

export default Order_Details;
