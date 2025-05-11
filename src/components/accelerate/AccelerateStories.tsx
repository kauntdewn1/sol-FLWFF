import React from "react";
import styles from "./AccelerateStories.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AccelerateStories = ({ urls }) => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1245,
        settings: {
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1.5,
        },
      },
    ],
  };

  return (
    <div className={styles.stories}>
      <Slider {...settings}>
        {urls.map(({ url }, index) => {
          const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
          return (
            <div key={index} className={styles.card}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

const CustomPrevArrow = (props: any) => {
  const { style, onClick } = props;
  return (
    <div className={styles.arrowLeft} style={{ ...style }} onClick={onClick}>
      <ArrowLeft size={28} />
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { style, onClick } = props;
  return (
    <div className={styles.arrowRight} style={{ ...style }} onClick={onClick}>
      <ArrowRight size={28} />
    </div>
  );
};

export default AccelerateStories;
