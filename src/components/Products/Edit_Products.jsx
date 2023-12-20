import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firebase } from '../config';

import './Edit_Products.css'

const Edit_Products = () => {
    const { categoryId, productId } = useParams();
    const navigate = useNavigate();
    
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [productImage, setProductImage] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = () => {
        firebase
            .firestore()
            .collection('Products')
            .doc(productId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const productData = doc.data();
                    setProductName(productData.productName);
                    setPrice(productData.price.toString());
                } else {
                    console.error('Product not found.');
                }
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    };

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

    const handleEditProduct = async () => {
        try {
            const updatedProductData = {
                productName,
                price: parseFloat(price),
            };

            await firebase.firestore().collection('Products').doc(productId).update(updatedProductData);

            if (productImage) {
                const storageRef = firebase.storage().ref(`images/${productImage.name}`);
                await storageRef.put(productImage);

                await firebase.firestore().collection('Products').doc(productId).update({
                    productImage: productImage.name,
                });
            }

            alert('Product updated successfully!');
            navigate(`/products/${categoryId}`); 
        } catch (error) {
            console.error('Error editing product:', error.message);
        }
    };

    return (
        <div className='Edit_Product'>
            <h2>Edit Product</h2>
            <form>
                <label>
                    Product Name:
                    <input type='text' value={productName} onChange={handleProductNameChange} />
                </label>
                <br />
                <label>
                    Price:
                    <input type='number' value={price} onChange={handlePriceChange} />
                </label>
                <br />
                <label>
                    Product Image:
                    <input type='file' accept='image/*' onChange={handleImageChange} />
                </label>
                <br />
                <button type='button' onClick={handleEditProduct}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default Edit_Products;
