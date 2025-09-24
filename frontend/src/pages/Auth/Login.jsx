import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input.jsx";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import axiosinstance from "../../utils/axiosInstance.js";
import UserContext from "../../context/UserContext.jsx";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { updateUser} = useContext(UserContext);


  const handlelogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    setError("");

    try {
      const res = await axiosinstance.post(API_PATHS.AUTH.LOGIN, {
        email: email,
        password: password,
      });
      const { token, user } = res.data;
    

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user) 
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error has occured. Please try again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handlelogin}>
          <Input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button className="btn-primary" type="submit">
            Login
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have a account?{" "}
            <Link to={"/signUp"} className="font-medium text-primary underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
