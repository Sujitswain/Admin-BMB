import React, { useEffect, useState } from "react";
import { firebase } from "../config";
import { Link } from "react-router-dom";

import './Categories.css';

export default function Categories() {
    const [name, setName] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const userSnapshot = await firebase.firestore().collection('admin')
                .doc(firebase.auth().currentUser.uid)
                .get();

            if (userSnapshot.exists)
                setName(userSnapshot.data());
            else
                console.log('User does not exist');

            const categorySnapshot = await firebase.firestore().collection('Categories').get();
            const categoryData = [];

            for (const doc of categorySnapshot.docs) {
                const category = { id: doc.id, ...doc.data() };
                const imagePath = `images/${category.categoryImage}`;

                try {
                    const imageRef = firebase.storage().ref(imagePath);
                    const imageUrl = await imageRef.getDownloadURL();

                    category.imageUrl = imageUrl;
                    categoryData.push(category);
                } catch (error) {
                    console.error('Error getting image URL for category:', category.categoryName, error);
                }
            }

            setData(categoryData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');

        if (confirmDelete) 
        {
            try {
                await firebase.firestore().collection('Categories').doc(categoryId).delete();
                fetchData();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <>
            <div className="categories-container">
                <div className="options">
                    <div><h3>{name.firstName}</h3></div>
                </div>

                <div className="Add_Categories">
                    <Link className="Add_button" to='/addcategory'> Add Category </Link>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div>Loading...</div>
                    </div>
                ) : (
                    <div className="category-list">
                        {data.map((item) => (
                            <div key={item.id} className="category-container">
                                <Link to={`/products/${item.id}`}>
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.categoryName} 
                                    className="category-image" 
                                />
                                </Link>
                                <div className="category-name">Name: {item.categoryName}</div>
                                <div className="category-actions">
                                    <Link to={`/category/${item.id}`}>Edit</Link>
                                    <button onClick={() => handleDeleteCategory(item.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
