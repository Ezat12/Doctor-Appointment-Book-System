import React from "react";
import img_logo from "../../assets/logo-BNCDj_dh.svg";

function Footer() {
  function getCurrentYear() {
    const now = new Date();
    const year = now.getFullYear();
    return year;
  }

  return (
    <div className="footer container mx-auto mt-32">
      <div className="grid grid-cols-[3fr_1fr_1fr] gap-14 pb-10  border-b">
        <div>
          <img src={img_logo} className="w-52 " />
          <p className="w-full max-w-[550px] mt-5 leading-6 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-5">COMPANY</h3>
          <ul className="flex flex-col gap-2 font-medium">
            <li>Home</li>
            <li>About As</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-5">GET IN TOUCH</h3>
          <ul className="flex flex-col gap-2 font-medium">
            <li>+201021453269</li>
            <li>
              <a href="mailto:ezatelbery187@gmail.com">
                ezatelbery187@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-6 font-medium">
        Copyright {getCurrentYear()} &#64; Greatstack.dev - All Right Reserved.
      </p>
    </div>
  );
}

export default Footer;
