export const isLoggedIn = () => {
    const user = sessionStorage.getItem('user');
    return user !== null;
  };
  
  export const loginUser = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };
  
  export const logoutUser = () => {
    sessionStorage.removeItem('user');
  };
  