'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  styled,
  alpha,
  Popper,
  ClickAwayListener,
  Fade,
} from '@mui/material';
import {
  Search,
  Close,
  EmojiEmotions,
  Favorite,
  AccessTime,
  SentimentSatisfiedAlt,
  EmojiObjects,
  EmojiNature,
  EmojiEvents,
  EmojiFlags,
  EmojiSymbols,
  EmojiTransportation,
  EmojiFoodBeverage,
} from '@mui/icons-material';

/**
 * Categories available in the emoji picker
 */
export type EmojiCategory =
  | 'recent'
  | 'smileys'
  | 'people'
  | 'animals'
  | 'food'
  | 'travel'
  | 'activities'
  | 'objects'
  | 'symbols'
  | 'flags';

/**
 * Props for EmojiPicker component
 */
export interface EmojiPickerProps {
  /**
   * Callback fired when an emoji is selected
   */
  onEmojiSelect?: (emoji: string) => void;

  /**
   * Anchor element for the popper
   */
  anchorEl: HTMLElement | null;

  /**
   * Whether the picker is open or not
   */
  open: boolean;

  /**
   * Callback when the picker should close
   */
  onClose?: () => void;

  /**
   * Maximum number of recent emojis to store
   * @default 36
   */
  recentEmojisLimit?: number;
}

/**
 * Dummy emoji mapping for the categories
 * In a real implementation, you'd use a proper emoji library like emoji-mart
 */
const EMOJI_CATEGORIES: Record<EmojiCategory, string[]> = {
  recent: [], // This will be populated from localStorage
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
  people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒'],
  objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬'],
};

// Keep track of the recent emojis (normally would be stored in localStorage)
const RECENT_STORAGE_KEY = 'emoji-picker-recent';

// Styled components
const EmojiPickerContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  maxHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const EmojiPickerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const EmojiPickerCategoryTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 36,
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  '& .MuiTab-root': {
    minHeight: 36,
    minWidth: 'auto',
    padding: theme.spacing(0.5),
  },
}));

const EmojiPickerSearchField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  '& .MuiInputBase-root': {
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
  },
}));

const EmojiGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2, 2),
  overflowY: 'auto',
  flex: '1 1 auto',
  '&::-webkit-scrollbar': {
    width: 6,
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.text.primary, 0.2),
    borderRadius: 3,
  },
}));

const EmojiButton = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.7),
  },
  '&:active': {
    backgroundColor: alpha(theme.palette.action.selected, 0.7),
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

/**
 * EmojiPicker component for selecting emojis in chat interfaces
 */
export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  anchorEl,
  open,
  onClose,
  recentEmojisLimit = 36,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<EmojiCategory>('recent');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [recentEmojis, setRecentEmojis] = React.useState<string[]>([]);

  // Load recent emojis from localStorage on mount
  React.useEffect(() => {
    try {
      const storedRecent = localStorage.getItem(RECENT_STORAGE_KEY);
      if (storedRecent) {
        setRecentEmojis(JSON.parse(storedRecent));
      }
    } catch (error) {
      console.error('Failed to load recent emojis:', error);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: EmojiCategory) => {
    setSelectedCategory(newValue);
    setSearchTerm('');
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    if (!emoji) return;

    // Call the callback
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }

    // Update recent emojis
    setRecentEmojis((prev) => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, recentEmojisLimit);
      // Save to localStorage
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(newRecent));
      } catch (error) {
        console.error('Failed to save recent emojis:', error);
      }
      return newRecent;
    });

    // Close the picker
    if (onClose) {
      onClose();
    }
  };

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value.length > 0 && selectedCategory !== 'recent') {
      setSelectedCategory('recent');
    }
  };

  // Filter emojis based on search term
  const filterEmojis = (emojis: string[]) => {
    if (!searchTerm) return emojis;
    return emojis.filter(emoji => emoji.includes(searchTerm));
  };

  // Get emojis for the selected category
  const getEmojisForCategory = () => {
    if (searchTerm) {
      // If searching, show results from all categories
      return Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter(emoji => emoji.includes(searchTerm));
    }

    if (selectedCategory === 'recent') {
      return recentEmojis.length > 0 ? recentEmojis : EMOJI_CATEGORIES.smileys.slice(0, 12);
    }

    return EMOJI_CATEGORIES[selectedCategory];
  };

  // Render category tabs
  const renderCategoryTabs = () => {
    const categoryIcons: Record<EmojiCategory, React.ReactElement> = {
      recent: <AccessTime fontSize="small" />,
      smileys: <SentimentSatisfiedAlt fontSize="small" />,
      people: <EmojiEmotions fontSize="small" />,
      animals: <EmojiNature fontSize="small" />,
      food: <EmojiFoodBeverage fontSize="small" />,
      travel: <EmojiTransportation fontSize="small" />,
      activities: <EmojiEvents fontSize="small" />,
      objects: <EmojiObjects fontSize="small" />,
      symbols: <EmojiSymbols fontSize="small" />,
      flags: <EmojiFlags fontSize="small" />,
    };

    return (
      <EmojiPickerCategoryTabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="emoji categories"
      >
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <Tab
            key={category}
            value={category}
            icon={categoryIcons[category as EmojiCategory]}
            aria-label={`${category} emojis`}
          />
        ))}
      </EmojiPickerCategoryTabs>
    );
  };

  // Render emojis grid
  const renderEmojisGrid = () => {
    const emojis = getEmojisForCategory();

    if (emojis.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <EmojiEmotions color="disabled" fontSize="large" />
          <Typography variant="body2" color="text.secondary">
            No emojis found
          </Typography>
        </Box>
      );
    }

    return (
      <EmojiGrid>
        {emojis.map((emoji, index) => (
          <EmojiButton
            key={`${emoji}-${index}`}
            onClick={() => handleEmojiSelect(emoji)}
            title={`Emoji: ${emoji}`}
          >
            {emoji}
          </EmojiButton>
        ))}
      </EmojiGrid>
    );
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top-start"
      transition
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          <ClickAwayListener onClickAway={() => onClose?.()}>
            <EmojiPickerContainer elevation={3}>
              <EmojiPickerHeader>
                <Typography variant="subtitle2" fontWeight="medium">
                  Emojis
                </Typography>
                <IconButton size="small" onClick={onClose}>
                  <Close fontSize="small" />
                </IconButton>
              </EmojiPickerHeader>

              <EmojiPickerSearchField
                placeholder="Search emojis..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                        edge="end"
                        aria-label="clear search"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              {renderCategoryTabs()}
              {renderEmojisGrid()}
            </EmojiPickerContainer>
          </ClickAwayListener>
        </Fade>
      )}
    </Popper>
  );
};

EmojiPicker.displayName = 'EmojiPicker';
