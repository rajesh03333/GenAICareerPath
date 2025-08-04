import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "http://localhost:5000/auth/signup"
      : "http://localhost:5000/auth/login";

    const body = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = response.data.token;
      const user=response.data.user;
      if (token && user) {
        localStorage.setItem("token", token); 
        localStorage.setItem("userId",user._id);
        localStorage.setItem("userName",user.name);
      }
      setIsError(false);
      setResponseMessage(response.data.msg || "Success! You're logged in.");
      setTimeout(() => {
        if (isSignup) {
          if (!localStorage.getItem("userName")) {
            localStorage.setItem("userName", formData.name);
          }
        } 
      }, 1000);
    } catch (error) {
      setIsError(true);
      setResponseMessage(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Log In"} to SmartStudy
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setResponseMessage(null);
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>

        {responseMessage && (
          <div
            className={`mt-6 p-4 text-sm rounded break-words ${
              isError
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <strong>{isError ? "Error" : "Success"}:</strong>{" "}
            <pre className="whitespace-pre-wrap break-all mt-1">
              {responseMessage}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
