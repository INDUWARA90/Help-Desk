import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import ImageSign from "../../assets/siginImage.jpg";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isOpen, setIsOpen] = useState(false); //Success Modal
  const [isDuplicateEmailOpen, setIsDuplicateEmailOpen] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setIsRegistering(true);  // Start loading
    setError(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setIsPasswordCorrect(true);
      setIsRegistering(false); // Stop loading if password is invalid
      return;
    }

    const user = {
      firstName,
      lastName,
      email,
      role: [role],
      password,
      gender,
      departmentId: parseInt(department) || 0,
      batchNo: parseInt(year) || 0,
    };

    try {
      const response = await fetch("https://helpdesk-production-c4f9.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.status === 201 || response.ok) {
        clearInputs();
        setIsOpen(true);
      } else if (response.status === 409) {
        setIsDuplicateEmailOpen(true);
      } else if (response.status === 400 && data.message?.toLowerCase().includes("weak")) {
        setIsPasswordCorrect(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network or server error. Please try again later.");
    } finally {
      setIsRegistering(false);  // Always stop loading
    }
  }



  function clearInputs() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setYear("");
    setGender("");
    setRole("");
    setShowPassword(false);
  }


  function handleGoToLogin() {
    setIsOpen(false);
    navigate("/login");
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tr from-pink-100 to-rose-200 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white text-black rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 p-6 sm:p-10 lg:p-12 space-y-6">
            <h2 className="text-3xl font-bold text-rose-600">Create an Account</h2>
            <p className="text-sm text-gray-600">
              Join our Peer Help Desk and start asking, answering, and helping your peers today!
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>Choose Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="" disabled>Choose Year</option>
                <option value="9">9 Batch</option>
                <option value="8">8 Batch</option>
                <option value="7">7 Batch</option>
                <option value="6">6 Batch</option>
                <option value="5">5 Batch</option>
              </select>

              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="" disabled>Choose Department</option>
                <option value="1">ICT</option>
                <option value="2">ET</option>
                <option value="3">BST</option>
              </select>

              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Choose Role</option>
                <option value="student">Student</option>
                <option value="admin" disabled>Admin</option>
              </select>


              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm transition-all placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-rose-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.045.172-2.049.488-3.002M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                
              </div>
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? "Registering..." : "Register"}
              </button>

            </form>
          </div>

          <div className="flex-1 hidden md:flex justify-center items-center bg-cover bg-center">
            <img src={ImageSign} alt="..." className="max-w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black/30">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4 text-center">
          <Dialog.Title className="text-xl font-semibold text-green-600">Account Created Successfully!</Dialog.Title>
          <p className="text-gray-600">You can now log in with your account.</p>
          <button
            onClick={handleGoToLogin}
            className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
          >
            Go to Login
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Duplicate Email Modal */}
      <Dialog open={isDuplicateEmailOpen} onClose={() => setIsDuplicateEmailOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center space-y-5">
          <Dialog.Title className="text-2xl font-bold text-red-600">Email Already Exists</Dialog.Title>
          <p className="text-gray-700">This email is already registered. <br />Please use a different one.</p>
          <button
            onClick={() => setIsDuplicateEmailOpen(false)}
            className="mt-4 px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
          >
            Try Again
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Weak Password Modal */}
      <Dialog open={isPasswordCorrect} onClose={() => setIsPasswordCorrect(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center space-y-5">
          <Dialog.Title className="text-2xl font-bold text-rose-600">Weak Password</Dialog.Title>
          <div className="text-gray-700 leading-relaxed">
            Your password must contain at least:
            <ul className="text-left mt-3 space-y-2 px-4">
              <li>✅ One <strong>uppercase</strong> letter</li>
              <li>✅ One <strong>lowercase</strong> letter</li>
              <li>✅ One <strong>number</strong></li>
              <li>✅ One <strong>special character</strong></li>
              <li>✅ Minimum <strong>6 characters</strong></li>
            </ul>
          </div>
          <button
            onClick={() => setIsPasswordCorrect(false)}
            className="mt-4 px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
          >
            Got it
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={!!error} onClose={() => setError(null)} className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center space-y-5">
          <Dialog.Title className="text-2xl font-bold text-red-600">Error</Dialog.Title>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
          >
            Close
          </button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default Register;
