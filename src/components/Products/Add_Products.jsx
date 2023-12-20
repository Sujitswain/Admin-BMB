import React, { useState } from 'react';
import { firebase } from '../config';
import { useParams, useNavigate } from 'react-router-dom';

import './Add_Products.css';

const Add_Products = () => {
    
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [productImage, setProductImage] = useState(null);

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setProductImage(imageFile);
    };

    const handleAddProduct = async () => {
        try {
            const storageRef = firebase.storage().ref(`images/${productImage.name}`);
            await storageRef.put(productImage);

            const productsRef = firebase.firestore().collection('Products');
            await productsRef.add({
                category: categoryId,
                productName,
                price: parseFloat(price),
                productImage: productImage.name,
            });

            setProductName('');
            setPrice('');
            setProductImage(null);

            console.log('Product added successfully!');
            navigate(`/products/${categoryId}`);
        } catch (error) {
            console.error('Error adding product:', error.message);
        }
    };

    return (
        <div className='Add_Product'>
            <h2>Add Product</h2>
            <form>
                <label>
                    Product Name:
                    <input type="text" value={productName} onChange={handleProductNameChange} />
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" value={price} onChange={handlePriceChange} />
                </label>
                <br />
                <label>
                    Product Image:
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
                <br />
                <button type="button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Add_Products;
