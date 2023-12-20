export const updateStoredCredentials = async (email, password) => {
  try {
    if (email && password) 
    {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
    } 
    else 
    {
       localStorage.removeItem('userEmail');
       localStorage.removeItem('userPassword');
    }
  } catch (error) {
    console.error('Error storing or removing credentials:', error);
  }
};
