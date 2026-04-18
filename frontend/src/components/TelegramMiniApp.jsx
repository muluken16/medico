import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip, 
  CircularProgress,
  IconButton,
  Divider,
  Container,
  Card,
  CardContent,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  CalendarToday, 
  History, 
  Person, 
  MedicalServices, 
  KeyboardArrowRight,
  Payment,
  CheckCircle,
  AccountCircle,
  LocalHospital
} from '@mui/icons-material';
import { api } from '../api';

const TelegramMiniApp = () => {
  const [tgUser, setTgUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setTgUser(tg.initDataUnsafe?.user || {
        id: '5246162942', // Fallback for dev
        first_name: 'Mule',
        username: 'mule_dev'
      });
      
      // Set Theme based on Telegram Colors
      tg.setHeaderColor(tg.themeParams.bg_color || '#ffffff');
    }
  }, []);

  // Use Memo for Telegram Theme
  const tgTheme = useMemo(() => {
    const tg = window.Telegram?.WebApp;
    return createTheme({
      palette: {
        mode: tg?.colorScheme || 'light',
        primary: {
          main: tg?.themeParams?.button_color || '#00b9d8',
        },
        background: {
          default: tg?.themeParams?.bg_color || '#f4f7f9',
          paper: tg?.themeParams?.secondary_bg_color || '#ffffff',
        },
        text: {
          primary: tg?.themeParams?.text_color || '#2d3748',
        }
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: { borderRadius: 12 }
    });
  }, []);

  const fetchPatientData = async () => {
    if (!tgUser?.id) return;
    setLoading(true);
    try {
      // Fetch latest bookings for this specific Telegram user
      const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_BASE = IS_LOCAL ? 'http://localhost:8000/api' : 'https://fullday.medicodigitals.com/api';
      
      const res = await fetch(`${API_BASE}/telegram/appointments/?search=${tgUser.id}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError("Unable to sync clinical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tgUser) fetchPatientData();
  }, [tgUser]);

  const handleClose = () => {
    window.Telegram?.WebApp?.close();
  };

  if (!tgUser) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Initializing Secure Clinical Hub...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={tgTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
        
        {/* --- PATIENT HEADER --- */}
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'white', 
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar 
                src={tgUser.photo_url} 
                sx={{ width: 64, height: 64, border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              >
                {tgUser.first_name?.[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Hello, {tgUser.first_name}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Patient ID: TG-{tgUser.id.toString().slice(-4)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Container sx={{ mt: -2 }}>
          {/* --- QUICK ACTION CARD --- */}
          <Card sx={{ mb: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: '24px !important' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital fontSize="small" color="primary" /> Quick clinical services
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<CalendarToday />}
                    sx={{ height: 50, textTransform: 'none', fontWeight: 600 }}
                  >
                    New Booking
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Person />}
                    sx={{ height: 50, textTransform: 'none', fontWeight: 600 }}
                  >
                    My Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* --- APPOINTMENT LIST --- */}
          <Typography variant="subtitle2" sx={{ mb: 1, ml: 1, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary', fontWeight: 700 }}>
            Recent Appointments
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
          ) : appointments.length > 0 ? (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List disablePadding>
                {appointments.slice(0, 5).map((appt, idx) => (
                  <React.Fragment key={appt.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: appt.status === 'confirmed' ? 'success.light' : 'warning.light' }}>
                          <MedicalServices />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700 }}>{appt.service_name}</Typography>}
                        secondary={new Date(appt.appointment_date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      />
                      <Chip 
                        label={appt.status} 
                        size="small" 
                        color={appt.status === 'confirmed' ? 'success' : 'default'}
                        variant={appt.status === 'confirmed' ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {idx < appointments.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography color="text.secondary">No clinical records found for your account.</Typography>
              <Button variant="contained" sx={{ mt: 2, borderRadius: 10 }}>Book your first visit</Button>
            </Paper>
          )}

          {/* --- FOOTER INFO --- */}
          <Box sx={{ mt: 4, textAlign: 'center', opacity: 0.6 }}>
            <Typography variant="caption" sx={{ display: 'block' }}>Medico Digital Clinical Hub v1.0</Typography>
            <Typography variant="caption">Secured by Medico Encryption</Typography>
            <Box sx={{ mt: 2 }}>
              <Button size="small" onClick={handleClose}>Exit clinical Hub</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TelegramMiniApp;
