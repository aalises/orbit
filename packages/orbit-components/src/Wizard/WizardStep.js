// @flow
import * as React from "react";
import { css } from "styled-components";
import convertHexToRgba from "@kiwicom/orbit-design-tokens/lib/convertHexToRgba";

import useMediaQuery from "../hooks/useMediaQuery";
import ButtonLink from "../ButtonLink";
import Stack from "../Stack";
import Text from "../Text";
import CheckCircle from "../icons/CheckCircle";
import useTheme from "../hooks/useTheme";
import { WizardStepContext } from "./WizardContext";
import type { Props } from "./WizardStep";

const WizardStep = ({ dataTest, title, onClick }: Props) => {
  const { isTablet } = useMediaQuery();
  const theme = useTheme();
  const { index, status, nextStepStatus, isActive, onChangeStep } = React.useContext(
    WizardStepContext,
  );
  const handleClick = (event: SyntheticEvent<HTMLElement>) => {
    if (onClick) onClick(event);
    if (onChangeStep) onChangeStep(index);
  };
  const iconWidth = parseFloat(theme.orbit.widthIconSmall) + 3.2;
  const iconHeight = parseFloat(theme.orbit.heightIconSmall) + 3.2;
  // account for additional inner spacing because of visual balance
  const checkboxWidth = iconWidth * (5 / 6);
  const checkboxHeight = iconHeight * (5 / 6);
  const colorDisabled = theme.orbit.paletteCloudNormalHover;

  const activeGlowColor = convertHexToRgba(theme.orbit.paletteProductNormal, 20);

  /**
   * We're explicitly rounding values in layout styles because browsers seem to
   * be rounding them inconsistently horizontally vs vertically.
   */

  const icon = (
    <div
      css={css`
        position: relative;
        opacity: 1;
        &:before {
          content: "";
          display: block;
          width: ${Math.round(checkboxWidth)}px;
          height: ${Math.round(checkboxHeight)}px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${theme.orbit.paletteProductNormal};
          ${status === "completed" &&
          css`
            background: ${theme.orbit.paletteWhite};
          `}
          ${status === "disabled" &&
          css`
            background: ${colorDisabled};
          `}
          border-radius: 50%;
          ${isTablet &&
          isActive &&
          css`
            box-shadow: 0 0 0 4px ${activeGlowColor};
          `}
        }
        svg {
          width: ${iconWidth}px;
          height: ${iconHeight}px;
          position: relative;
          display: block;
        }
      `}
    >
      <div
        css={css`
          position: relative;
        `}
      >
        {status === "completed" ? (
          <CheckCircle
            ariaLabel="completed"
            size="small"
            customColor={theme.orbit.paletteProductNormal}
          />
        ) : (
          <div
            css={css`
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
              width: ${iconWidth}px;
              height: ${iconHeight}px;
              padding: ${Math.round((iconHeight - checkboxHeight) / 2)}px
                ${Math.round((iconWidth - checkboxWidth) / 2)}px;
            `}
          >
            <Text as="div" type={status === "disabled" ? "primary" : "white"} size="small">
              {typeof index === "number" ? index + 1 : null}
            </Text>
          </div>
        )}
      </div>
    </div>
  );

  if (!isTablet) {
    return (
      <li
        data-test={dataTest}
        css={css`
          button {
            border-radius: 0;
          }
          ${isActive &&
          css`
            position: relative;
            &:before {
              content: "";
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              width: 2px;
              background: ${theme.orbit.paletteProductNormal};
              pointer-events: none;
            }
          `}
          ${status === "disabled" &&
          css`
            background: ${theme.orbit.paletteCloudLight};
            button {
              opacity: 1;
            }
          `};
        `}
      >
        <ButtonLink
          disabled={status === "disabled"}
          type="secondary"
          fullWidth
          iconLeft={icon}
          ariaCurrent={isActive ? "step" : "false"}
          onClick={handleClick}
        >
          {status === "disabled" ? (
            <Text as="span" type="secondary">
              {title}
            </Text>
          ) : (
            title
          )}
        </ButtonLink>
      </li>
    );
  }

  return (
    <li data-test={dataTest}>
      <div
        css={css`
          position: relative;
          &:before,
          &:after {
            content: "";
            display: block;
            position: absolute;
            top: ${parseFloat(iconHeight) / 2 - 1}px;
            width: 50%;
            height: 2px;
          }
          &:before {
            left: 0;
            background: ${status === "disabled" ? colorDisabled : theme.orbit.paletteProductNormal};
          }
          &:after {
            right: 0;
            background: ${status === "disabled" || nextStepStatus === "disabled"
              ? colorDisabled
              : theme.orbit.paletteProductNormal};
          }
        `}
      />
      <Stack direction="column" align="center" spacing="condensed">
        {icon}
        {status === "disabled" ? (
          <Text as="div" type="secondary" size="small">
            {title}
          </Text>
        ) : (
          <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              role="button"
              tabIndex={0}
              css={css`
                display: block;
                text-decoration: none;
                ${isActive
                  ? css`
                      span {
                        font-weight: 500;
                      }
                    `
                  : css`
                      cursor: pointer;
                      span {
                        color: ${theme.orbit.colorTextSecondary};
                      }
                      &:hover,
                      &:focus {
                        span {
                          color: ${theme.orbit.colorTextPrimary};
                          text-decoration: underline;
                        }
                      }
                    `};
              `}
              aria-current={isActive ? "step" : "false"}
              onClick={event => {
                event.currentTarget.blur();
                handleClick(event);
              }}
              // keep focus for people who are navigating with the keyboard
              onKeyDown={event => {
                if (event.key === "Enter") {
                  handleClick(event);
                }
              }}
            >
              <Text as="span" size="small">
                {title}
              </Text>
            </a>
          </div>
        )}
      </Stack>
    </li>
  );
};

export default WizardStep;
