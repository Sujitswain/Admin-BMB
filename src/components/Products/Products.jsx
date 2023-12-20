import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firebase } from '../config';

import './Products.css';

export default function Products() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const fetchProducts = () => {
        setLoading(true);

        firebase
            .firestore()
            .collection('Products')
            .where('category', '==', firebase.firestore().doc(`Categories/${categoryId}`).id)
            .get()
            .then(async (querySnapshot) => {
                const productsData = [];
                const storage = firebase.storage();

                for (const doc of querySnapshot.docs) {
                    const product = { id: doc.id, ...doc.data() };
                    const imagePath = `images/${product.productImage}`;

                    try {
                        const imageRef = storage.ref(imagePath);
                        const imageUrl = await imageRef.getDownloadURL();

                        product.productImageURL = imageUrl;
                        productsData.push(product);
                    } catch (error) {
                        console.error('Error getting image URL for product:', product.productName, error);
                    }
                }

                setProducts(productsData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products: ', error);
                setLoading(false);
            });
    };

    const handleDeleteProduct = async (productId) => {
        try {
            // Delete product from Firestore
            await firebase.firestore().collection('Products').doc(productId).delete();

            // Delete image from Firebase Storage
            const product = products.find((p) => p.id === productId);
            const imagePath = `images/${product.productImage}`;
            const imageRef = firebase.storage().ref(imagePath);
            await imageRef.delete();

            // Update state to reflect the deletion
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    return (
        <div className='products-container'>
            <div className='Add_Products'>
                <Link className='Add_button' to={`/addproduct/${categoryId}`}>
                    Add Product
                </Link>
            </div>

            {loading ? (
                <div className='loading-container'>
                    <div>Loading...</div>
                </div>
            ) : (
                <div className='product-list'>
                    {products.map((item) => (
                        <div key={item.id} className='product-container'>
                            <img src={item.productImageURL} alt={item.productName} className='product-image' />
                            <div className='product-name'>Name: {item.productName}</div>
                            <div className='product-price'>Price: {item.price}</div>
                            <div className='product-actions'>
                                <Link to={`/editproduct/${categoryId}/${item.id}`}>Edit</Link>
                                <button onClick={() => handleDeleteProduct(item.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
