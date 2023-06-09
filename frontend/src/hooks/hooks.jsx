import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 *Custom hook to get user data from API
 * @export
 *@return {*} { userData, profilHaveImage, setProfilHaveImage }
 */
export function useUserdata() {
  //States
  const [userData, setUserData] = useState([]);
  let navigate = useNavigate();
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
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, []);
  return { userData };
}
