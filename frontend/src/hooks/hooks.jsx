import { useState, useEffect } from "react";
import axios from "axios";

/**
 *Custom hook to get user data from API
 * @export
 *@return {*} { userData, profilHaveImage, setProfilHaveImage }
 */
export function useUserdata() {
  //States
  const [userData, setUserData] = useState([]);

  /**
   *Get user data
   *add data to userData state
   *change profileHaveImage state if image found
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data[0]);
        if (res.data[0].picture_url !== null) {
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return { userData };
}
