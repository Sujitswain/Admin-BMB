import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firebase } from '../config';

import './Edit_Categories.css';

export default function Edit_Categories() {

    const naviagte = useNavigate();
    const { categoryId } = useParams();
    
    const [categoryDetails, setCategoryDetails] = useState({});
    const [updatedName, setUpdatedName] = useState('');
    const [updatedImage, setUpdatedImage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const categoryDoc = await firebase.firestore().collection('Categories').doc(categoryId).get();

                if (categoryDoc.exists) {
                    const categoryData = categoryDoc.data();
                    setCategoryDetails(categoryData);
                    setUpdatedName(categoryData.categoryName);
                    setUpdatedImage(categoryData.categoryImage);
                } else {
                    console.log('Category not found');
                }
            } catch (error) {
                console.error('Error fetching Category details:', error);
            }
        };

        fetchCategoryDetails();
    }, [categoryId]);

    const handleUpdateCategory = async () => {
        try {
            if (selectedImage) {
                const storageRef = firebase.storage().ref(`images/${selectedImage.name}`);
                await storageRef.put(selectedImage);

                await firebase.firestore().collection('Categories').doc(categoryId).update({
                    categoryName: updatedName,
                    categoryImage: selectedImage.name,
                });
            } 
            else 
            {
                await firebase.firestore().collection('Categories').doc(categoryId).update({
                    categoryName: updatedName,
                });
            }

            console.log('Category updated successfully');
            naviagte('/categories');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setSelectedImage(imageFile);
    };

    return (
        <div className='edit_category_container'>
            <h2>Edit Category</h2>
            <label htmlFor="CategoryName">Category Name:</label>
            <input
                type="text"
                id="CategoryName"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
            />
            <br />
            <label htmlFor="CategoryImage">Category Image:</label>
            <input
                type="file"
                id="CategoryImage"
                accept="image/*"
                onChange={handleImageChange}
            />
            <br />
            <button onClick={handleUpdateCategory}>Update Category</button>
        </div>
    );
}