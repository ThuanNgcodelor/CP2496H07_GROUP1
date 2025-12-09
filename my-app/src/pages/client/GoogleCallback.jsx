import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {API_BASE_URL, LOCAL_BASE_URL} from "../../config/config.js";

const GoogleCallback = () => {
  const navigate = useNavigate();

  // Toast configuration
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios
        .post(`${LOCAL_BASE_URL}/v1/auth/login/google`, { code })
        .then((res) => {
          console.log("Google login successful:", res.data);
          Cookies.set("accessToken", res.data.token);

          // Success toast
          Toast.fire({
            icon: "success",
            title: "Google login successful 🎉",
          });

          navigate("/");
        })
        .catch((err) => {
          console.error("Google login error details:", {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
              url: err.config?.url,
              method: err.config?.method,
              data: err.config?.data,
            },
          });

          let errorMessage = "Google login failed!";
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err.message) {
            errorMessage = err.message;
          }

          // Error modal
          Swal.fire({
            title: "Google login failed",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Try again",
          }).then(() => {
            navigate("/login");
          });
        });
    } else {
      console.error("No authorization code found in URL");

      Swal.fire({
        title: "Error",
        text: "No authorization code received from Google",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return <div>Logging in with Google...</div>;
};

export default GoogleCallback;
