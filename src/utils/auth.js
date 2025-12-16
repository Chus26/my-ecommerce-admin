//Import from react-router-dom

//Get token duration
export const getTokenDuration = () => {
  //Get expiration time in local storage
  const expiration = new Date(localStorage.getItem("expiration"));
  //Create Current time
  const now = new Date();
  //Calculate duration
  const duration = expiration.getTime() - now.getTime();
  return duration;
};

//Get auth token
export const getAuthToken = () => {
  //Get JWT token from local storage
  const token = localStorage.getItem("token") ?? null;

  //No token
  if (!token) {
    return null;
  }
  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return "TOKEN EXPIRED";
  }
  return token;
};
