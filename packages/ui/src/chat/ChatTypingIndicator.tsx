'use client';

import * as React from 'react';
import { Box, Avatar, keyframes, styled, alpha } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

export interface ChatTypingIndicatorProps {
  /**
   * The name of the entity that is typing
   */
  name?: string;
}

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
`;

const IndicatorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const BubbleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const Dot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '50%',
  opacity: 0.7,
  animation: `${bounce} 1.4s infinite ease-in-out both`,
}));

/**
 * ChatTypingIndicator displays an animated indicator when someone is typing
 */
export const ChatTypingIndicator: React.FC<ChatTypingIndicatorProps> = ({
  name = 'Assistant',
  ...props
}) => {
  return (
    <IndicatorContainer {...props}>
      <Avatar sx={{ bgcolor: 'secondary.main' }}>
        <SmartToy />
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <BubbleContainer>
          <Dot sx={{ animationDelay: '0s' }} />
          <Dot sx={{ animationDelay: '0.2s' }} />
          <Dot sx={{ animationDelay: '0.4s' }} />
        </BubbleContainer>

        <Box
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            mt: 0.5,
            ml: 1,
          }}
        >
          {name} is typing...
        </Box>
      </Box>
    </IndicatorContainer>
  );
};

ChatTypingIndicator.displayName = 'ChatTypingIndicator';
