'use client';

import * as React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  styled,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Facebook,
  Instagram,
} from '@mui/icons-material';

export interface FooterProps {
  /**
   * Company or website name
   */
  companyName?: string;

  /**
   * Company logo URL
   */
  logoUrl?: string;

  /**
   * Footer navigation links
   */
  links?: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;

  /**
   * Social media links
   */
  socials?: Array<{
    name: 'github' | 'twitter' | 'linkedin' | 'facebook' | 'instagram';
    href: string;
  }>;

  /**
   * Additional className to be applied
   */
  className?: string;
}

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const SocialIcon = ({ name, ...props }: { name: FooterProps['socials'][0]['name'] }) => {
  const icons = {
    github: <GitHub />,
    twitter: <Twitter />,
    linkedin: <LinkedIn />,
    facebook: <Facebook />,
    instagram: <Instagram />,
  };

  return icons[name] || null;
};

export const footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({
    companyName = 'DeanMachines',
    logoUrl,
    links = defaultLinks,
    socials = defaultSocials,
    className,
    ...props
  }, ref) => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
      <StyledFooter ref={ref} className={className} {...props}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            {/* Company Info */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ mb: 2 }}>
                {logoUrl ? (
                  <img src={logoUrl} alt={companyName} style={{ height: 32 }} />
                ) : (
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {companyName}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Building amazing software solutions with cutting-edge technology.
              </Typography>
            </Grid>

            {/* Navigation Links */}
            {links.map((section) => (
              <Grid item xs={6} sm={2} key={section.title}>
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  {section.title}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {section.items.map((item) => (
                    <Box component="li" key={item.label} sx={{ py: 0.5 }}>
                      <Link
                        href={item.href}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.primary.main },
                        }}
                      >
                        {item.label}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Bottom Bar */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {companyName}. All rights reserved.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socials.map(({ name, href }) => (
                <IconButton
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  <SocialIcon name={name} />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Container>
      </StyledFooter>
    );
  }
);

footer.displayName = 'footer';

// Default values for the footer
const defaultLinks = [
  {
    title: 'Product',
    items: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', href: '/help' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const defaultSocials = [
  { name: 'github', href: 'https://github.com' },
  { name: 'twitter', href: 'https://twitter.com' },
  { name: 'linkedin', href: 'https://linkedin.com' },
];
