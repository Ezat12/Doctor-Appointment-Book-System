import React from 'react'
import img_contact from "../../assets/contact_image-IJu_19v_.png"

function Contact() {
  return (
    <div className="contact container mx-auto">
      <div className="flex flex-col items-center justify-center px-6 pt-12 lg:flex-row">
        {/* Left Image Section */}
        <div className="w-full lg:w-1/3">
          <img
            src={img_contact}
            alt="Doctor with patient"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-full mt-12 lg:w-1/2 lg:mt-0 lg:ml-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            CONTACT <span className="text-blue-600">US</span>
          </h2>

          {/* Office Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800">OUR OFFICE</h3>
            <p className="text-gray-600 mt-2">
              00000 Willms Station <br />
              Suite 000, Washington, USA
            </p>
            <p className="text-gray-600 mt-2">
              Tel: (000) 000-0000 <br />
              Email: greatstackdev@gmail.com
            </p>
          </div>

          {/* Careers Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              CAREERS AT PRESCRIPTO
            </h3>
            <p className="text-gray-600 mt-2">
              Learn more about our teams and job openings.
            </p>
            <button className="mt-4 px-6 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact