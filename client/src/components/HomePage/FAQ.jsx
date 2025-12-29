import React, { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../ui/Typography";

const defaultFaqData = [
  {
    id: 1,
    question: "How does HealthTalk help patients book doctor appointments?",
    answer:
      "HealthTalk allows users to easily browse verified doctors, view their profiles, and book clinic appointments in just a few steps. Patients can choose doctors based on specialty, experience, and ratings, ensuring informed decisions.",
  },
  {
    id: 2,
    question: "How are doctors verified on HealthTalk?",
    answer:
      "All doctors on HealthTalk go through a verification process conducted by our admin team. This includes reviewing their qualifications, clinic details, and professional credentials before onboarding them onto the platform.",
  },
  {
    id: 3,
    question: "Can doctors manage their clinic availability and appointments?",
    answer:
      "Yes. Doctors can manage their clinic timings, appointment slots, and patient bookings through their dashboard, helping them streamline daily operations and reduce manual coordination.",
  },
  {
    id: 4,
    question: "Is HealthTalk suitable for clinics with multiple doctors?",
    answer:
      "Absolutely. HealthTalk supports clinics with multiple doctors by allowing each doctor to maintain individual profiles while enabling centralized appointment management for clinics.",
  },
  {
    id: 5,
    question: "Is patient data secure on HealthTalk?",
    answer:
      "Yes. HealthTalk follows industry-standard security practices to protect patient data. All personal and appointment-related information is handled securely and shared only with authorized doctors and clinics.",
  },
];


const QuestionCard = ({ ques }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
    className="questionCard"
     
      onClick={() => {
        setOpen(!open);
      }}
    >
      {/* question */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="regular"
          weight="medium"
          style={{
            lineHeight: 1.7,
          }}
        >
          {ques.question}
        </Typography>
        <button
          className={`${
            !open
              ? "faqBtn"
              : "activeFaqBtn"
          }`}
          style={{
            cursor:"pointer",
            transition:"all .5s",
            padding:"4px",
            borderRadius:"50%",
            boxShadow:"2px 1px 5px #a09e9eff"
          }}
        >
          <GoChevronDown
            size={22}
            className={`${
              !open ? "faqIcon" : "activeFaqIcon"
            }`}
            style={{
                transtion:"all .5s"
            }}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            overflow:"hidden"
          }}
          >
            <Typography
            variant="small"
            weight="normal"
            style={{
                lineHeight:1.6,
                marginTop:"12px",
                width:"90%"
            }}
            >
              {ques.answer}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = ({faqData=defaultFaqData}) => {
  return (
    <section
      style={{
        width: "100%",
        background: "",
        paddingTop: "var(--page-padding-y)",
        paddingBottom:"20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
      style={{
        paddingInline:"var(--page-padding-x)",
        marginInline:"auto",
        maxWidth:"1280px",

      }}
      >
        {/* Header */}
        <div 
        style={{
            textAlign:"center",
            marginBottom:"48px"
        }}
        >
          <Typography
            variant="heading"
            as="h2"
            weight="medium"
            style={{
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            Frequently Asked Questions (FAQs)
          </Typography>
        </div>

        {/* FAQ Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {faqData.map((ques) => (
            <QuestionCard key={ques.id} ques={ques} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
