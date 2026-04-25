import React from "react";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

const AuthField = ({
  icon: IconComponent,
  actionIcon: ActionIcon,
  actionLabel,
  actionAriaLabel,
  onAction,
  actionWidth = "5.5rem",
  inputRef,
  fieldStyle,
  fieldClassName = "",
  inputClassName = "",
  actionClassName = "",
  leftClassName = "",
  rightClassName = "",
  ...inputProps
}) => {
  const hasAction = Boolean(actionLabel || ActionIcon || onAction);
  const actionWidthValue =
    typeof actionWidth === "number" ? `${actionWidth}px` : actionWidth;
  const isNumberField = inputProps.type === "number";

  return (
    <InputGroup
      w="full"
      position="relative"
      className={fieldClassName}
      style={fieldStyle}
    >
      {IconComponent ? (
        <InputLeftElement
          pointerEvents="none"
          top={0}
          bottom={0}
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight="0"
          pl="0.9rem"
          className={leftClassName}
        >
          <Icon
            as={IconComponent}
            boxSize="18px"
            display="block"
            color="var(--auth-icon-color)"
          />
        </InputLeftElement>
      ) : null}

      <Input
        ref={inputRef}
        className={inputClassName}
        h="48px"
        minH="48px"
        borderRadius="12px"
        borderWidth="1px"
        borderColor="var(--auth-control-border)"
        focusBorderColor="rgba(41, 128, 78, 0.48)"
        bg="var(--auth-control-bg)"
        color="var(--auth-control-text)"
        fontSize="15px"
        boxShadow="var(--shadow-soft-color)"
        transition="transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        _placeholder={{ color: "var(--auth-placeholder-color)" }}
        _focusVisible={{
          borderColor: "rgba(41, 128, 78, 0.48)",
          boxShadow: "0 0 0 4px var(--auth-focus-ring)",
          transform: "translateY(-1px)",
        }}
        _focus={{
          borderColor: "rgba(41, 128, 78, 0.48)",
          boxShadow: "0 0 0 4px var(--auth-focus-ring)",
          transform: "translateY(-1px)",
        }}
        _disabled={{
          opacity: 0.75,
          bg: "var(--auth-disabled-bg)",
          cursor: "not-allowed",
        }}
        pl={IconComponent ? "3.15rem" : undefined}
        pr={hasAction ? `calc(${actionWidthValue} + 0.8rem)` : undefined}
        sx={
          isNumberField
            ? {
                "&::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "&::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "&": {
                  MozAppearance: "textfield",
                },
              }
            : undefined
        }
        {...inputProps}
      />

      {hasAction ? (
        <InputRightElement
          width={actionWidthValue}
          top={0}
          bottom={0}
          h="80%"
          alignSelf={'center'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight="0"
          pr="0.35rem"
          className={rightClassName}
        >
          <Button
            type="button"
            variant="unstyled"
            w="full"
            h="calc(100% - 8px)"
            minH="32px"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            gap="6px"
            px="8px"
            borderRadius="8px"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="var(--auth-soft-accent-border)"
            bg="var(--auth-soft-accent-bg)"
            color="var(--primary-green-color)"
            fontSize="13px"
            fontWeight="700"
            lineHeight="1"
            transition="background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease"
            _hover={{
              bg: "rgba(41, 128, 78, 0.16)",
              color: "var(--secondary-green-color)",
              transform: "translateY(-1px)",
            }}
            _focusVisible={{
              outline: "none",
              boxShadow: "0 0 0 4px var(--auth-focus-ring)",
            }}
            className={actionClassName}
            onClick={onAction}
            aria-label={actionAriaLabel || actionLabel}
          >
            {ActionIcon ? (
              <Icon
                as={ActionIcon}
                boxSize="18px"
                display="block"
                flexShrink={0}
              />
            ) : null}
            {actionLabel ? (
              <span style={{ lineHeight: 1, flexShrink: 0 }}>{actionLabel}</span>
            ) : null}
          </Button>
        </InputRightElement>
      ) : null}
    </InputGroup>
  );
};

export default AuthField;
