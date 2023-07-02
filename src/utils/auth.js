export const getUserInfo = ()=>{
  return JSON.parse(localStorage.getItem('userInfo'))
}

export const setUserInfo = ()=>{
  return localStorage.setItem('userInfo')
}

export const removeUserInfo = ()=>{
  return localStorage.removeItem('userInfo')
}

export const getToken = ()=>{
  return localStorage.getItem('token')
}

export const setToken = (token)=>{
  return localStorage.setItem('token',token)
}

export const removeToken = () =>{
  return localStorage.removeItem('token')
}