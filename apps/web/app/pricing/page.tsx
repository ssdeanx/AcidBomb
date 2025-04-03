import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Container,
  Box,
  Grid,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircleOutline,
  HelpOutline,
} from '@mui/icons-material';
import { Card } from '@repo/ui/Card';
import { Button } from '@repo/ui/Button';
import { Collapsible } from '@repo/ui/Collapsible';

/**
 * Generate SEO metadata for the pricing page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Pricing Plans | DeanMachines AI',
    description: 'View DeanMachines AI platform pricing options with transparent pricing for individuals and teams building advanced conversational AI solutions.',
  };
}

/**
 * FAQ item interface for pricing questions
 */
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Pricing page component with pricing tiers and FAQ section
 */
export default function PricingPage() {
  // FAQ configuration
  const faqItems: FAQItem[] = [
    {
      question: 'What counts as an "Agent Run"?',
      answer: 'An agent run is counted each time a user message triggers your agent to perform reasoning, use tools, or generate a response. Multiple messages in a single conversation count as separate runs. System initialization and health checks are not counted as runs.',
    },
    {
      question: 'How is vector storage measured?',
      answer: 'Vector storage is calculated based on the total size of your embedded documents and conversation history stored in Pinecone. This includes the vector embeddings themselves plus associated metadata. The typical document chunk with metadata requires approximately 10-20KB of storage.',
    },
    {
      question: 'Can I upgrade or downgrade my plan later?',
      answer: 'Yes, you can upgrade from Free to Pro at any time, and your new limits will be applied immediately. When downgrading from Pro to Free, the change will take effect at the end of your current billing cycle. Your data will be preserved, but access will be limited according to the Free tier restrictions.',
    },
    {
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes, we offer custom enterprise plans for organizations with specific requirements for volume, security, compliance, or integration needs. Enterprise plans include dedicated support, SLAs, and can be customized to your specific use case. Please contact our sales team for more information.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and debit cards for Pro subscriptions. Enterprise customers have the option for invoice-based payments with net-30 terms. All payments are securely processed through Stripe.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      {/* Header Section */}
      <Box textAlign="center" mb={10}>
        <Typography variant="h2" component="h1" gutterBottom>
          Simple, Transparent Pricing
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "md", mx: "auto" }}
        >
          Choose the plan that fits your needs. Start building for free and scale as you grow.
          All plans include access to our core platform features.
        </Typography>
      </Box>

      {/* Pricing Tiers */}
      <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="stretch"
      >
        {/* Free Tier */}
        <Grid item xs={12} md={5}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <CardHeader
              title="Free"
              subheader="For personal projects & exploration"
              sx={{ bgcolor: 'grey.800' }}
              titleTypographyProps={{
                align: 'center',
                variant: 'h4',
                fontWeight: 'medium'
              }}
              subheaderTypographyProps={{
                align: 'center'
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Price */}
              <Box textAlign="center" mb={3}>
                <Typography variant="h3">
                  $0
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /month
                </Typography>
              </Box>

              {/* Features */}
              <List dense>
                {['100 Agent Runs/mo', '10MB Vector Storage (Pinecone)', '1-Day Memory History (Redis)', 'Community Support'].map((feature) => (
                  <ListItem disablePadding key={feature} sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutline sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2.5, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outline"
                fullWidth
                component={Link}
                href="/signup"
              >
                Sign Up Free
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Pro Tier */}
        <Grid item xs={12} md={5}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: 'primary.main',
              borderWidth: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              boxShadow: (theme) => theme.shadows[3],
              borderRadius: 2,
              position: 'relative',
              zIndex: 1
            }}
          >
            <CardHeader
              title="Pro"
              subheader="For developers & small teams"
              sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
              titleTypographyProps={{
                align: 'center',
                variant: 'h4',
                fontWeight: 'medium'
              }}
              subheaderTypographyProps={{
                align: 'center'
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Price */}
              <Box textAlign="center" mb={3}>
                <Typography variant="h3">
                  $19
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /month
                </Typography>
              </Box>

              {/* Features */}
              <List dense>
                {['5,000 Agent Runs/mo', '1GB Vector Storage (Pinecone)', '30-Day Memory History (Redis)', 'Email Support', 'Access to Beta Features'].map((feature) => (
                  <ListItem disablePadding key={feature} sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutline sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2.5, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="primary"
                fullWidth
                component={Link}
                href="/signup"
              >
                Get Started
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box mt={10} maxWidth="md" mx="auto">
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>

        <Stack spacing={2}>
          {faqItems.map((item, index) => (
            <Collapsible
              key={index}
              header={
                <Typography fontWeight="medium">
                  {item.question}
                </Typography>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.answer}
                </Typography>
              </Box>
            </Collapsible>
          ))}
        </Stack>
      </Box>

      {/* Enterprise CTA */}
      <Box textAlign="center" mt={8}>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Need a custom solution for your enterprise?
        </Typography>
        <Button
          variant="outline"
          component={Link}
          href="/contact"
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
}
