'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  styled,
  alpha,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  FilePresent,
  Image,
  PictureAsPdf,
  Code,
  VideoFile,
  AudioFile,
  Download,
  Delete
} from '@mui/icons-material';
import type { Attachment } from './types';

/**
 * Props for the ChatAttachments component
 *
 * @interface ChatAttachmentsProps
 */
export interface ChatAttachmentsProps {
  /**
   * Array of attachment objects
   */
  attachments: Attachment[];

  /**
   * Handler for removing an attachment
   */
  onRemove?: (attachmentId: string) => void;

  /**
   * Handler for downloading an attachment
   */
  onDownload?: (attachment: Attachment) => void;

  /**
   * If true, the attachments can be removed
   * @default false
   */
  allowRemove?: boolean;

  /**
   * If true, the attachments can be downloaded
   * @default true
   */
  allowDownload?: boolean;

  /**
   * Style variant for displaying attachments
   * @default "grid"
   */
  variant?: 'grid' | 'list' | 'compact';

  /**
   * Maximum number of attachments to display before showing "+X more"
   * @default 5
   */
  maxVisible?: number;

  /**
   * Custom className
   */
  className?: string;
}

// Define interface for styled component props
interface StyledAttachmentItemProps {
  attachmentVariant: 'grid' | 'list' | 'compact';
}

const AttachmentsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'grid' | 'list' | 'compact' }>(({ theme, variant }) => ({
  display: 'flex',
  flexDirection: variant === 'list' ? 'column' : 'row',
  flexWrap: variant === 'compact' ? 'nowrap' : 'wrap',
  gap: theme.spacing(1),
  width: '100%',
  overflowX: variant === 'compact' ? 'auto' : 'visible',
  padding: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const AttachmentItem = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'attachmentVariant', // Prevent custom prop from reaching Paper
})<StyledAttachmentItemProps>(({ theme, attachmentVariant }) => ({
  display: 'flex',
  flexDirection: attachmentVariant === 'grid' ? 'column' : 'row',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  position: 'relative',
  transition: theme.transitions.create(['transform', 'box-shadow']),

  width: attachmentVariant === 'grid'
    ? 'calc(33.33% - 8px)'
    : attachmentVariant === 'compact'
      ? 'auto'
      : '100%',

  maxWidth: attachmentVariant === 'compact' ? '120px' : '100%',
  minWidth: attachmentVariant === 'compact' ? '100px' : 'auto',

  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-2px)',
  },

  [theme.breakpoints.down('sm')]: {
    width: attachmentVariant === 'grid' ? 'calc(50% - 8px)' : '100%',
  },
}));

const AttachmentPreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px',
  maxHeight: '150px',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),

  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const AttachmentInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  flexGrow: 1,
  overflow: 'hidden',
}));

const AttachmentActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

const MoreAttachments = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  width: '120px',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

/**
 * Helper function to get appropriate icon based on file type
 *
 * @param mimeType - MIME type of the file
 * @returns React node with the appropriate icon
 */
const getFileIcon = (mimeType: string): React.ReactNode => {
  if (mimeType.startsWith('image/')) {
    return <Image />;
  } else if (mimeType === 'application/pdf') {
    return <PictureAsPdf />;
  } else if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('javascript')) {
    return <Code />;
  } else if (mimeType.startsWith('video/')) {
    return <VideoFile />;
  } else if (mimeType.startsWith('audio/')) {
    return <AudioFile />;
  } else {
    return <FilePresent />;
  }
};

/**
 * Helper function to format file size in human-readable format
 *
 * @param bytes - Size in bytes
 * @returns Formatted string representation of size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * ChatAttachments component displays file attachments in a chat interface
 * with preview, download and removal options
 *
 * @component
 */
export const ChatAttachments = React.forwardRef<HTMLDivElement, ChatAttachmentsProps>(
  ({
    attachments,
    onRemove,
    onDownload,
    allowRemove = false,
    allowDownload = true,
    variant = 'grid',
    maxVisible = 5,
    className,
  }, ref) => {
    const [expandedView, setExpandedView] = React.useState(false);

    // Skip rendering if no attachments
    if (!attachments || attachments.length === 0) {
      return null;
    }

    // Determine which attachments to display based on maxVisible and expandedView
    const displayedAttachments = expandedView
      ? attachments
      : attachments.slice(0, maxVisible);

    const hasHiddenAttachments = attachments.length > maxVisible && !expandedView;

    /**
     * Handles removing an attachment
     *
     * @param attachmentId - ID of the attachment to remove
     */
    const handleRemove = (attachmentId: string): void => {
      if (onRemove) {
        onRemove(attachmentId);
      }
    };

    /**
     * Handles downloading an attachment
     *
     * @param attachment - Attachment to download
     */
    const handleDownload = (attachment: Attachment): void => {
      if (onDownload) {
        onDownload(attachment);
      }
    };

    return (
      <AttachmentsContainer ref={ref} variant={variant} className={className}>
        {displayedAttachments.map((attachment) => (
          <AttachmentItem key={attachment.id} attachmentVariant={variant}>
            {variant === 'grid' && (
              <AttachmentPreview>
                {attachment.type.startsWith('image/') && attachment.url ? (
                  <img src={attachment.url} alt={attachment.name} />
                ) : (
                  getFileIcon(attachment.type)
                )}
              </AttachmentPreview>
            )}

            <Box sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              gap: 1,
              px: variant !== 'grid' ? 1 : 0
            }}>
              {variant !== 'grid' && (
                <Box sx={{ mr: 1 }}>
                  {getFileIcon(attachment.type)}
                </Box>
              )}

              <AttachmentInfo>
                <Tooltip title={attachment.name}>
                  <Typography noWrap variant="body2" fontWeight="medium">
                    {attachment.name}
                  </Typography>
                </Tooltip>

                {attachment.size !== undefined && variant !== 'compact' && (
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(attachment.size)}
                  </Typography>
                )}

                {attachment.uploadProgress !== undefined && attachment.uploadProgress < 100 && (
                  <LinearProgress
                    variant="determinate"
                    value={attachment.uploadProgress}
                    sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                  />
                )}
              </AttachmentInfo>

              {(allowDownload || allowRemove) && variant !== 'compact' && (
                <AttachmentActions>
                  {allowDownload && attachment.url && (
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(attachment)}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {allowRemove && (
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(attachment.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </AttachmentActions>
              )}
            </Box>
          </AttachmentItem>
        ))}

        {hasHiddenAttachments && (
          <MoreAttachments onClick={() => setExpandedView(true)}>
            <Typography variant="body2" fontWeight="medium">
              +{attachments.length - maxVisible} more
            </Typography>
          </MoreAttachments>
        )}
      </AttachmentsContainer>
    );
  }
);

ChatAttachments.displayName = 'ChatAttachments';

export default ChatAttachments;
