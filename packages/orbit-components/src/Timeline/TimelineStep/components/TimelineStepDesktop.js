// @flow
import React from "react";
import styled from "styled-components";

import StyledRelative from "../primitives/StyledRelative";
import StyledIconWrapper from "../primitives/StyledIconWrapper";
import StyledProgressLine from "../primitives/StyledProgressLine";
import StyledText from "../primitives/StyledText";
import Badge from "./CustomBadge";
import Text from "../../../Text";
import Stack from "../../../Stack";
import type { Props as StepProps, Type } from "../index";

const StyledDescription = styled.div`
  max-width: 250px;
  width: 100%;
`;

type Props = {|
  ...StepProps,
  last: boolean,
  typeIcon: React$Node,
  nextType: Type,
|};

const TimelineStepDesktop = ({
  type,
  last,
  nextType,
  children,
  label,
  subLabel,
  typeIcon,
}: Props) => {
  return (
    <Stack inline shrink direction="column" align="center" spaceAfter="large">
      <StyledText>
        <Text size="small">{subLabel}</Text>
      </StyledText>
      <StyledRelative inner>
        <StyledProgressLine data-test="progressLine" desktop isLeft status={type} />
        <StyledIconWrapper>{typeIcon}</StyledIconWrapper>
        <StyledProgressLine data-test="progressLine" desktop status={nextType || (last && type)} />
      </StyledRelative>
      <Stack flex align="center" spacing="condensed" direction="column">
        <Badge type={type}>{label}</Badge>
        <StyledDescription>
          <Text align="center" type={type ? "primary" : "secondary"}>
            {children}
          </Text>
        </StyledDescription>
      </Stack>
    </Stack>
  );
};

export default TimelineStepDesktop;