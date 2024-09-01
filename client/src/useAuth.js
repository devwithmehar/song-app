import { useState, useEffect } from "react"
import axiosInstance from './axiosConfig';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();


 

  useEffect(() => {
     let isMount = true;

      axiosInstance
      .post("/login/auth", {
        code,
      })
      .then(res => {
          if(isMount && res.status === 200){
            setAccessToken(res.data.access_token)
            setRefreshToken(res.data.refresh_token)
            setExpiresIn(res.data.expires_in);
            window.history.pushState({}, null, "/")
          }
      })
      .catch(() => {
        
        window.location = "/"
      })
     

    
      return(() => {
        isMount = false;
      })
   

  }, [code])

  useEffect(() => {
     if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
        axiosInstance
        .post("/refresh", {
            refresh_token: refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.access_token)
          setExpiresIn(res.data.expires_in)
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}