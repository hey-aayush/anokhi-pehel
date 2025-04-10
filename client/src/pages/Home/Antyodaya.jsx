import styles from "../../style";
import "../../style.css";
import React, { useState, useEffect } from "react";
import HomePageLayout from "../../components/Home/HomePageLayout";
import { Antyodayavid } from "../../assets/Home";
import {
  event,
  event1,
  event2,
  event3,
  event4,
} from "../../assets/Home/AntyodayaSponser/AtyodayaEvent";
import {
  bob,
  alumni,
  ieee,
  umeed,
  radio,
  vinayak,
  mtt,
} from "../../assets/Home/AntyodayaSponser";
import Slider from "react-slick";

const Data = [
  { name: "umeed", img: umeed },
  { name: "alumni", img: alumni },
  { name: "bob", img: bob },
  { name: "vinayak", img: vinayak },
  { name: "ieee", img: ieee },
  { name: "mtt", img: mtt },
  { name: "radio", img: radio },
];

const eventImages = [event, event1, event2, event3, event4];

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 3000,
  cssEase: "linear",
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const Antodaya = () => {
  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, []);

  return (
    <HomePageLayout>
      <div className={`relative ${styles.flexStart}`}>
        {/* Video Background with border */}
        <video
          autoPlay
          loop
          muted
          className="inset-0 w-auto h-auto min-w-full min-h-full max-w-none border-4 border-teal-500"
          style={{ objectFit: "cover" }}
        >
          <source src={Antyodayavid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* About Antyodaya Section */}
      <div className="relative z-10 flex justify-center ">
        <div className="container m-auto md:my-12 p-2 lg:px-40">
          <div className="justify-center items-center text-center md:p-4 p-2 lg:text-4xl font-medium text-3xl">
            <h2
              className="text-[2rem] sm:text-[3rem] tracking-wider text-gray-900 font-bold flex justify-center"
              style={{
                fontWeight: "bolder",
                textAlign: "center",
                textShadow: "0 0 10px white",
              }}
            >
              About Antyodaya
            </h2>
          </div>
          <div className="flex mb-8 md:mb-12 px-3 justify-center">
            <div className="w-16 h-1 rounded-full bg-teal-500 inline-flex"></div>
          </div>
          <div className="text-gray-900 body-font w-full mb-4">
            <div className="w-full p-1 mb-8">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner">
                <p className="leading-relaxed p-4 md:p-4 lg:p-12 font-base md:font-medium text-center hover: sm:text-xl text-base">
                  Antyodaya is the annual festival of Anokhi पहल, celebrated
                  every year on Children's Day at MNNIT since 2018. The festival
                  includes a variety of competitions, such as science
                  exhibitions, debates, quizzes, and a range of cultural
                  activities and performances.
                </p>
                <p className="leading-relaxed font-base md:font-medium text-center hover:t sm:text-xl text-base mb-8">
                  Students from Anokhi पहल, along with many schools across
                  Prayagraj, participate in these events, making Antyodaya a
                  vibrant and inclusive celebration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div>
        <h2
          className="text-[2rem] sm:text-[3rem] tracking-wider text-gray-900 font-bold flex justify-center transition-all duration-300 hover:underline hover:underline-offset-8 hover:decoration-teal-500"
          style={{
            fontWeight: "bolder",
            textAlign: "center",
            textShadow: "0 0 10px white",
          }}
        >
          Our Sponsors
        </h2>
        <div
          className="scroller mt-[5%] mb-12"
          data-direction="left"
          data-speed="slow"
        >
          <div className="scroller__inner">
            {Data.map((item, index) => (
              <div key={index} className="photo-container">
                <img
                  src={item.img}
                  height="20"
                  width="20"
                  className="rounded-full lg:h-300 lg:w-300 sm:h-50 sm:w-50"
                  alt={item.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div>
        <h2
          className="text-[2rem] sm:text-[3rem] tracking-wider text-gray-900 font-bold flex justify-center mb-10 transition-all duration-300 hover:underline hover:underline-offset-8 hover:decoration-teal-500"
          style={{
            fontWeight: "bolder",
            textAlign: "center",
            textShadow: "0 0 10px white",
          }}
        >
          Events in Antyodaya
        </h2>
        <Slider {...settings}>
          {eventImages.map((img, index) => (
            <div key={index} className="flex justify-center mt-10">
              <img
                className="mx-auto w-full h-auto object-cover lg:max-w-[80%] md:max-w-[85%] sm:max-w-[90%]"
                src={img}
                alt={`Event ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </HomePageLayout>
  );
};

export default Antodaya;
