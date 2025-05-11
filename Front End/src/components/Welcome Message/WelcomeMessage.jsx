import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import img_logo from "../../assets/logo-BNCDj_dh.svg";
import Cookies from "js-cookie";

function WelcomeMessage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = Cookies.get("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      Cookies.set("hasSeenWelcome", "true");
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-blue-100 w-80 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white flex items-center">
              <img src={img_logo} alt="Logo" className="h-6 mr-2" />
              <h3 className="font-bold text-lg">Welcome to MedBook!</h3>
              <button
                onClick={() => setShowWelcome(false)}
                className="ml-auto text-white hover:text-blue-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 text-gray-700">
              <p className="mb-3">
                Book doctor appointments easily with our online system.
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Dismiss
                </button>
                <a
                  href="/doctors"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeMessage;
