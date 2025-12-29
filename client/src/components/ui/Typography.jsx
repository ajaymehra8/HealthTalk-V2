import { Text, Heading } from "@chakra-ui/react";

const Typography = ({
  as = "p",
  children,
  variant = "regular",
  weight = "normal",
  sx = {},
  ...rest
}) => {
  const variants = {
    heading: {
      fontSize: { base: "28px", md: "36px", lg: "48px" },
      lineHeight: { base: "1.2", lg: "1.25" },
      color: "var(--heading-color)",
    },
    subheading: {
      fontSize: { base: "22px", md: "28px", lg: "36px" },
      lineHeight: "1.3",
      color: "var(--subheading-color)",
    },
    lgRegular: {
      fontSize: { base: "18px", md: "20px", lg: "24px" },
      lineHeight: "1.5",
      color: "var(--heading-color)",
    },
    regular: {
      fontSize: { base: "16px", md: "18px", lg: "20px" },
      lineHeight: "1.6",
      color: "var(--regular-color)",
    },
    regularVariant: {
      fontSize: { base: "15px", md: "16px", lg: "18px" },
      lineHeight: "1.6",
      color: "var(--regular-color)",
    },
    small: {
      fontSize: { base: "13px", md: "14px" },
      lineHeight: "1.4",
      color: "var(--regular-color)",
    },
  };

  const weights = {
    bold: 700,
    semibold: 600,
    medium: 500,
    normal: 400,
  };

  const commonProps = {
    as,
    fontWeight: weights[weight],
    ...variants[variant],
    ...sx,
    ...rest,
  };

  if (variant === "heading" || variant === "subheading") {
    return <Heading {...commonProps}>{children}</Heading>;
  }

  return <Text {...commonProps}>{children}</Text>;
};

export default Typography;
