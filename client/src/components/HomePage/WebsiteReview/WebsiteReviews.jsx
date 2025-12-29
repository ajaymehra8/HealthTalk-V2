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
  const CARD_HEIGHT = 256;
  const GAP = 32;
  const speed = 3000;

  /* dots along arc */
  useEffect(() => {
    const el = pathRef.current;
    if (!el ) return;

    const total = el.getTotalLength();
    const margin = 10;
    const step = (total - margin * 2) / (cardDetails.length + 1);

    setDotPositions(
      cardDetails.map((_, i) => el.getPointAtLength(margin + step * (i + 0.5)))
    );
  }, []);

  /* auto scroll */
  useEffect(() => {
    if(pauseAnimation) return;
    const i = setInterval(
      () => setActiveIndex((p) => (p + 1) % cardDetails.length),
      speed
    );
    return () => clearInterval(i);
  }, [pauseAnimation]);

  return (
    <section className="review-section">
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
            <br className="text-br"/> and <span className="highlight">Clinics</span>
          </Typography>
          <Typography variant="lgRegular" style={{ lineHeight: 1.2 }}>
            Real experiences from people <br />
            who use HealthTalk every day
          </Typography>
        </div>

        {/* Right carousel */}
        <div className="review-right">
          {/* <svg
            viewBox="0 0 254 696"
            className="arc"
            fill="none"
          >
            <path
              ref={pathRef}
              d="M252.693 695C115.467 648.388 9.70215 539.643 9.70215 348C9.70215 156.357 138.896 28.1903 252.693 1"
              stroke="url(#grad)"
              strokeWidth="2"
            />

            {dotPositions.map((p, i) => {
              const active = i === cardDetails.length - 1 - activeIndex;
              return (
                <g key={i}>
                  {active && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={13}
                      stroke="#00D9A3"
                      strokeWidth="2"
                      fill="none"
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 9 : 6}
                    fill="#00D9A3"
                    opacity={active ? 1 : 0.5}
                  />
                </g>
              );
            })}

            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#0F1419" />
                <stop offset="0.5" stopColor="#00F9D1" />
                <stop offset="1" stopColor="#0F1419" />
              </linearGradient>
            </defs>
          </svg> */}

          <motion.div
            className="card-column"
            animate={{
              y: `calc(-${activeIndex} * (${CARD_HEIGHT + GAP}px) + 250px - ${
                CARD_HEIGHT / 2
              }px)`,
            }}
            transition={{ duration: speed / 2000 }}
          >
            {cardDetails.map((item, i) => {
              const active = i === activeIndex;
              return (
                <motion.div
                  key={i}
                  animate={{
                    x: active ? -50 : Math.abs(i - activeIndex) * 100,
                    scale: active ? 1 : 0.9,
                    opacity: active ? 1 : 0.5,
                  }}
                >
                  <Card item={item} setPauseAnimation={setPauseAnimation} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteReview;
