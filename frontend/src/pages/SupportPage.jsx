import { useMemo, useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";
import { PUBLIC_BUTTON_PRIMARY_SX, PUBLIC_SURFACE_SX, PUBLIC_UI } from "../utils/publicUi";
import usePageTitle from "../hooks/usePageTitle";

const faqSections = [
  {
    title: "Rentals",
    items: [
      {
        question: "How long can I rent a book?",
        answer:
          "Most books are available for 3, 7, 14, or 30 day rentals. The exact options appear on each book detail page before checkout.",
      },
      {
        question: "Can I extend my rental duration?",
        answer:
          "Yes. If a title is not reserved by another reader, you can request an extension from your dashboard before the due date.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        question: "When am I charged for a rental?",
        answer:
          "You are charged during checkout. Deposit and rental fee details are shown clearly before you confirm the rental.",
      },
      {
        question: "Do you provide invoices?",
        answer:
          "Yes, invoices are available in your account history after each completed payment.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        question: "How do I update profile details?",
        answer:
          "Open your dashboard, go to Profile, and save your updated name, contact details, and avatar.",
      },
      {
        question: "What if I forgot my password?",
        answer:
          "Use the login page reset flow. If you still cannot access your account, contact support using the form in this page.",
      },
    ],
  },
  {
    title: "Returns",
    items: [
      {
        question: "Where can I see return deadlines?",
        answer:
          "Return deadlines are visible in your active rentals list and each book entry on the dashboard.",
      },
      {
        question: "What happens if I return late?",
        answer:
          "Late returns may include penalties depending on the plan terms. You will always see fee details before final confirmation.",
      },
    ],
  },
];

function normalize(text = "") {
  return text.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SupportPage() {
  usePageTitle("Support Center - BookNest");

  const [activeTab, setActiveTab] = useState("help");
  const [searchQuery, setSearchQuery] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  const filteredFaqSections = useMemo(() => {
    const query = normalize(searchQuery);

    if (!query) {
      return faqSections;
    }

    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          normalize(`${item.question} ${item.answer}`).includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(formValues.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formValues.subject) {
      nextErrors.subject = "Please select a subject.";
    }

    if (!formValues.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitMessage("Your support request has been received. We will contact you soon.");
    setFormValues({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3.2}>
        <Paper
          elevation={0}
          sx={{
            ...PUBLIC_SURFACE_SX,
            p: { xs: 2.4, md: 3.2 },
          }}
        >
          <Stack spacing={1.2}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.12em", fontWeight: 800, color: PUBLIC_UI.primary }}
            >
              Support
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: PUBLIC_UI.text }}>
              Support Center
            </Typography>
            <Typography sx={{ color: PUBLIC_UI.muted, maxWidth: 760 }}>
              Find answers or get in touch.
            </Typography>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ mt: 3, mb: 1 }}
          >
            <Tab value="help" label="Get Help" sx={{ textTransform: "none", fontWeight: 700 }} />
            <Tab
              value="contact"
              label="Contact Us"
              sx={{ textTransform: "none", fontWeight: 700 }}
            />
          </Tabs>
        </Paper>

        {activeTab === "help" ? (
          <Stack spacing={2.5}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for answers..."
            />

            {filteredFaqSections.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                No answers matched your search. Try broader keywords or switch to Contact Us.
              </Alert>
            ) : (
              filteredFaqSections.map((section) => (
                <Accordion
                  key={section.title}
                  disableGutters
                  elevation={0}
                  sx={{
                    ...PUBLIC_SURFACE_SX,
                    borderRadius: 3,
                    "&::before": { display: "none" },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: PUBLIC_UI.primary }} />}>
                    <Typography variant="h6" sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                      {section.title}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0, pb: 0.8 }}>
                    <Stack spacing={1.25}>
                      {section.items.map((item) => (
                        <Box
                          key={item.question}
                          sx={{
                            borderTop: `1px solid ${PUBLIC_UI.border}`,
                            pt: 1.1,
                            pb: 1.2,
                          }}
                        >
                          <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>
                            {item.question}
                          </Typography>
                          <Typography sx={{ color: PUBLIC_UI.muted, mt: 0.6, lineHeight: 1.75 }}>
                            {item.answer}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.6fr) minmax(280px, 1fr)" },
              gap: 2.4,
              alignItems: "start",
            }}
          >
            <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: { xs: 2.2, md: 2.8 } }}>
              <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                  Contact Us
                </Typography>

                {submitMessage ? (
                  <Alert severity="success" sx={{ borderRadius: 2.5 }}>
                    {submitMessage}
                  </Alert>
                ) : null}

                <TextField
                  label="Name"
                  value={formValues.name}
                  onChange={handleFormChange("name")}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={formValues.email}
                  onChange={handleFormChange("email")}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  fullWidth
                />
                <TextField
                  select
                  label="Subject"
                  value={formValues.subject}
                  onChange={handleFormChange("subject")}
                  error={Boolean(formErrors.subject)}
                  helperText={formErrors.subject}
                  fullWidth
                >
                  <MenuItem value="rental">Rental Support</MenuItem>
                  <MenuItem value="payment">Payment Issue</MenuItem>
                  <MenuItem value="account">Account Help</MenuItem>
                  <MenuItem value="returns">Return Guidance</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Message"
                  value={formValues.message}
                  onChange={handleFormChange("message")}
                  error={Boolean(formErrors.message)}
                  helperText={formErrors.message}
                  multiline
                  minRows={5}
                  fullWidth
                />

                <Button type="submit" variant="contained" sx={{ ...PUBLIC_BUTTON_PRIMARY_SX, py: 1.2 }}>
                  Submit
                </Button>
              </Stack>
            </Paper>

            <Stack spacing={2}>
              <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 2.2 }}>
                <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800, mb: 0.7 }}>
                  Email Address
                </Typography>
                <MuiLink href="mailto:support@booknest.app" underline="hover" sx={{ fontWeight: 700 }}>
                  support@booknest.app
                </MuiLink>
              </Paper>

              <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 2.2 }}>
                <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800, mb: 0.7 }}>
                  Response Time
                </Typography>
                <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.7 }}>
                  Typical response window is within 24 hours on weekdays.
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 2.2 }}>
                <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800, mb: 0.7 }}>
                  Community
                </Typography>
                <MuiLink component={RouterLink} to="/community" underline="hover" sx={{ fontWeight: 700 }}>
                  Visit BookNest Community
                </MuiLink>
              </Paper>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}