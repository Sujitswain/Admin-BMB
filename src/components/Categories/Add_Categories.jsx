import React, { useState } from 'react';
import { firebase } from '../config';
import { useNavigate } from 'react-router-dom';

import './Add_Categories.css';

export default function AddCategories() {

    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setCategoryImage(imageFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (categoryName && categoryImage) 
            {
                const storageRef = firebase.storage().ref(`images/${categoryImage.name}`);
                await storageRef.put(categoryImage);

                await firebase.firestore().collection('Categories').add({
                    categoryName: categoryName,
                    categoryImage: categoryImage.name,
                });
                setCategoryName('');
                setCategoryImage(null);

                console.log('Category added successfully');
                navigate('/categories');
            } else {
                console.log('Please provide both category name and image');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className='Add_categories'>
            <div className='AddCategories'>
                <h2>Add Categories</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <br />
                    <label htmlFor="categoryImage">Category Image:</label>
                    <input
                        type="file"
                        id="categoryImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <br />
                    <button type="submit">Add Category</button>
                </form>
            </div>
        </div>
    );
}
