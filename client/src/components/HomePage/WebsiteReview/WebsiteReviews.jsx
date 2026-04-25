import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Assets
// import doubleQuote from "@/assets/homePage/WebsiteReview/doubleQuote.png";
// import closeQuote from "@/assets/homePage/WebsiteReview/closeQuote.png";

// Icons
import { FaStar, FaRegStar } from "react-icons/fa";
import Typography from "../../ui/Typography";

import "./WebsiteReview.css";

/* ---------------- Types ---------------- */
const cardDetails = [
  {
    description:
      "Booking a doctor appointment has never been this easy. HealthTalk helped me find the right doctor and schedule a visit in minutes.",
    name: "Ajay Mehra",
    star: 5,
  },
  {
    description:
      "I like how all doctors are verified before onboarding. It gives confidence while booking appointments for my family.",
    name: "Ritika Sharma",
    star: 5,
  },
  {
    description:
      "The platform is simple, clean, and easy to use. Viewing doctor profiles and ratings made my decision much easier.",
    name: "Karan Verma",
    star: 4,
  },
  {
    description:
      "As a clinic manager, HealthTalk helped us organize appointments and reduce manual calls significantly.",
    name: "Neha Gupta",
    star: 5,
  },
  {
    description:
      "I appreciate the transparency in consultation fees and doctor availability. Everything is clearly mentioned.",
    name: "Rahul Singh",
    star: 4,
  },
  {
    description:
      "HealthTalk saves a lot of time. Instead of calling multiple clinics, I can book appointments in one place.",
    name: "Priya Nair",
    star: 5,
  },
];

/* ---------------- Card ---------------- */
const Card = ({ item, className = "", setPauseAnimation }) => {
  return (
    <div
      className={`review-card ${className}`}
      onMouseEnter={() => {
        setPauseAnimation(true);
      }}
      onMouseLeave={() => {
        setPauseAnimation(false);
      }}
    >
      <div className="card-top">
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) =>
            n <= item.star ? (
              <FaStar key={n} color="var(--secondary-green-color)" size={20} />
            ) : (
              <FaRegStar
                key={n}
                color="var(--secondary-green-color)"
                size={20}
              />
            )
          )}
        </div>
        {/* <Image src={closeQuote} alt="quote" className="quote-icon" /> */}
      </div>

      <p className="description">“{item.description}”</p>

      <div className="footer">
        <p className="name">{item.name}</p>
        <p className="job">{item.job}</p>
      </div>
    </div>
  );
};

/* ---------------- Main ---------------- */
const WebsiteReview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pathRef = useRef(null);
  const [dotPositions, setDotPositions] = useState([]);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 900 : true
  );
  const CARD_HEIGHT = 256;
  const GAP = 32;
  const speed = 3000;

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* auto scroll */
  useEffect(() => {
    if (!isDesktop || pauseAnimation) return;
    const i = setInterval(
      () => setActiveIndex((p) => (p + 1) % cardDetails.length),
      speed
    );
    return () => clearInterval(i);
  }, [pauseAnimation, isDesktop]);

  return (
    <section className="review-section gradient-bg2">
      <div className="review-container">
        {/* Left text */}
        <div className="review-left">
          {/* <Image src={doubleQuote} alt="quote" className="big-quote" /> */}
          <Typography
            variant="heading"
            weight="bold"
            style={{ lineHeight: 1.2 }}
          >
            Trusted by <span className="highlight">Patients</span>
            <br className="text-br" /> and{" "}
            <span className="highlight">Clinics</span>
          </Typography>
          <Typography variant="lgRegular" style={{ lineHeight: 1.2 }}>
            Real experiences from people <br />
            who use HealthTalk every day
          </Typography>
        </div>

        {/* Right carousel */}
        <div className="review-right">
          <motion.div
            className="card-column"
            animate={
              isDesktop
                ? {
                    y: `calc(-${activeIndex} * (${
                      CARD_HEIGHT + GAP
                    }px) + 250px - ${CARD_HEIGHT / 2}px)`,
                  }
                : {}
            }
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {cardDetails.map((item, i) => {
              const offset = i - activeIndex;

              return (
                <motion.div
                  key={i}
                  drag={!isDesktop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(e, info) => {
                    if (isDesktop) return;

                    if (
                      info.offset.x < -60 &&
                      activeIndex < cardDetails.length - 1
                    ) {
                      setActiveIndex((p) => p + 1);
                    }
                    if (info.offset.x > 60 && activeIndex > 0) {
                      setActiveIndex((p) => p - 1);
                    }
                  }}
                  animate={{
                    x: isDesktop
                      ? activeIndex === i
                        ? -50
                        : Math.abs(i - activeIndex) * 100
                      : offset * (350 + 20),

                    scale: activeIndex === i ? 1 : 0.9,
                    opacity: activeIndex === i ? 1 : 0.4,
                    zIndex: 100 - Math.abs(offset),
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={
                    isDesktop
                      ? {}
                      : {
                          position: "absolute",
                          left: "50%",
                          marginLeft: `-${350 / 2}px`,
                        }
                  }
                >
                  <Card item={item} setPauseAnimation={setPauseAnimation} />
                </motion.div>
              );
            })}
          </motion.div>

          {!isDesktop && (
            <div className="review-dots">
              {cardDetails.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WebsiteReview;
