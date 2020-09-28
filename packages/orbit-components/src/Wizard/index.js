// @flow
import * as React from "react";
import { css } from "styled-components";

import WizardStep from "./WizardStep";
import { WizardStepContext } from "./WizardContext";
import Button from "../Button";
import ButtonLink from "../ButtonLink";
import Stack from "../Stack";
import ChevronDown from "../icons/ChevronDown";
import Portal from "../Portal";
import Modal from "../Modal";
import { CardSection } from "../Card";
import useMediaQuery from "../hooks/useMediaQuery";
import useTheme from "../hooks/useTheme";

import type { Props } from ".";

const Wizard = ({ dataTest, id, completedSteps, activeStep, children, onChangeStep }: Props) => {
  const { isTablet } = useMediaQuery();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const toggle = React.useRef<React.ElementRef<typeof ButtonLink> | null>(null);

  const childrenArray = React.Children.toArray(children);
  const stepStatuses = childrenArray.map((step, index) => {
    let status;
    if (index < completedSteps) {
      status = "completed";
    } else if (index === completedSteps) {
      status = "available";
    } else {
      status = "disabled";
    }
    return status;
  });
  // $FlowFixMe: not sure why "props" evaluates to "mixed"
  const activeStepTitle = childrenArray.find((step, index) => index === activeStep)?.props.title;
  const stepsCount = React.Children.count(children);

  const steps = React.Children.map(children, (step, index) => (
    <WizardStepContext.Provider
      value={{
        index,
        status: stepStatuses[index],
        nextStepStatus: stepStatuses[index + 1],
        isActive: activeStep === index,
        onChangeStep,
      }}
    >
      {step}
    </WizardStepContext.Provider>
  ));

  if (!isTablet) {
    return (
      <>
        <div
          css={css`
            button {
              /* it's intended to go from edge to edge */
              border-radius: 0;
            }
          `}
        >
          <ButtonLink
            ref={toggle}
            dataTest={dataTest}
            ariaControls={id}
            ariaExpanded={open}
            type="secondary"
            fullWidth
            iconRight={<ChevronDown />}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Stack as="span" inline>
              <b>{`${activeStep + 1} of ${stepsCount}`}</b>{" "}
              <span
                css={css`
                  font-weight: normal;
                `}
              >
                {activeStepTitle}
              </span>
            </Stack>
          </ButtonLink>
        </div>
        <Portal>
          <div id={id}>
            {open && (
              <Modal>
                <nav
                  css={css`
                    /* matching this to ModalBody's border-radius */
                    padding-top: 9px;
                  `}
                >
                  <ul
                    css={css`
                      list-style-type: none;
                      margin: 0;
                      padding: 0;
                      > * + * {
                        border-top: 1px solid ${theme.orbit.paletteCloudDark};
                      }
                    `}
                  >
                    {steps}
                    <li>
                      <CardSection>
                        <Button
                          type="secondary"
                          fullWidth
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          Close
                        </Button>
                      </CardSection>
                    </li>
                  </ul>
                </nav>
              </Modal>
            )}
          </div>
        </Portal>
      </>
    );
  }

  return (
    <nav>
      <ul
        css={css`
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          > * {
            flex: 1 1 0%;
          }
        `}
      >
        {steps}
      </ul>
    </nav>
  );
};

export default Wizard;
export { WizardStep };
