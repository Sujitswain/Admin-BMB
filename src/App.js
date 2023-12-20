import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';

import Categories from './components/Categories/Categories';
import Add_Categories from './components/Categories/Add_Categories';
import Edit_Categories from './components/Categories/Edit_Categories';

import Products from './components/Products/Products';
import Add_Products from './components/Products/Add_Products';
import Edit_Products from './components/Products/Edit_Products';

import Orders from './components/Orders/Orders';
import Dashboard from './components/Dashboard/Dashboard';
import { firebase } from '../src/components/config';

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='main-container'>
       <BrowserRouter>
          <div>
            {isLoggedIn && <Dashboard/>}
          </div>

          <div>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/registration' element={<Registration />} />

              <Route path='/categories' element={<Categories />} />
              <Route path='/addcategory' element={<Add_Categories />}/>
              <Route path='/category/:categoryId' element={<Edit_Categories />} />

              <Route path='/products/:categoryId' element={<Products />}/>
              <Route path='/addproduct/:categoryId' element={<Add_Products />}/>
              <Route path='/editproduct/:categoryId/:productId' element={<Edit_Products />} />

              <Route path='/orders' element={<Orders />} />
            </Routes>
            </div>
       </BrowserRouter>
    </div>
  );
}

export default App;