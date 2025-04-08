import { quotes } from "../../assets/Home";

const FeedbackCard = ({ content, name, title, img }) => (
  <div
    className="flex justify-between flex-col px-10 py-12 rounded-[20px] 
    max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card 
    bg-white border-2 border-transparent hover:border-teal-400 
    hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
  >
    <img
      src={quotes}
      alt="double_quotes"
      className="w-[42.6px] h-[27.6px] object-contain"
    />
    <p className="font-medium text-[16px] leading-[32.4px] text-gray-800 my-10 wordspace-normal">
      {content}
    </p>

    <div className="flex flex-row">
      <img src={img} alt={name} className="w-[48px] h-[48px] rounded-full" />
      <div className="flex flex-col ml-4">
        <h4 className="font-poppins font-semibold text-[20px] leading-[32px] text-gray-800">
          {name}
        </h4>
        <p className="font-poppins font-medium text-[16px] leading-[24px] text-gray-600">
          {title}
        </p>
      </div>
    </div>
  </div>
);

export default FeedbackCard;
