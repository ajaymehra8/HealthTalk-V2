import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Typography from "../ui/Typography";

const HeroSection = () => {
  return (
    <Box
      height={"95vh"}
      width={"100vw"}
      background={`linear-gradient(
  135deg,
  #E6EEF6 0%,
  #D4E2F1 50%,
  #C1D6EB 100%
)`}
      px={"var(--page-padding-x)"}
      overflow={"hidden"}
      pt={"60px"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      maxHeight={"700px"}
    >
      <Box
        position={"relative"}
        className="homePageMain"
        height={"100%"}
        maxWidth={"1440px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box width="50%" className="homeTextBox">
          <Typography
            as="h1"
            variant="heading"
            style={{
              lineHeight: "1.2",
              letterSpacing: "1px",
            }}
            weight="bold"
          >
            Guiding you to better patient outcomes
          </Typography>
          <Typography
            as="p"
            style={{
              marginTop: "10px",
            }}
            weight="semibold"
          >
            Connect with verified doctors, book appoinments,
            <br /> and manage clinics effortlessly.
          </Typography>
          <Box marginTop={"25px"}>
            <Link
              className="mainButton"
              to="doctors"
              smooth={true}
              duration={500}
            >
              Find a Doctor
            </Link>
          </Box>
        </Box>

        <img src="../images/hero.png" alt="" className="homeImg" />
      </Box>
      {/* <div className="homeFoot">
          <h1>
            <span>HealthTalk</span> Find, Connect, and Consult with Top Doctors
          </h1>
        </div> */}
    </Box>
  );
};

export default HeroSection;
