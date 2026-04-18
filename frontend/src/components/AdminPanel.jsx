import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Container,
  Button, Card, CardContent, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Fab, Snackbar, Alert,
  Avatar, Tooltip, Breadcrumbs, Link, CircularProgress, CssBaseline,
  Badge, Switch, FormControlLabel, useMediaQuery, Stack, Menu as MuiMenu, MenuItem,
  Chip, LinearProgress, Collapse
} from '@mui/material';
import {
  Menu, ChevronLeft, Dashboard, HomeWork, DynamicFeed, VideoLibrary,
  Star, PhotoCamera, ContactMail, Logout, Add, Edit, Delete,
  Search, Notifications, AccountCircle, MoreVert, HelpOutline,
  Assessment, Share, Visibility, Comment, Inbox, Reply, Send, Close,
  LocalOffer, AutoAwesome, History, MarkEmailRead, MarkEmailUnread,
  CheckCircle, Check, People, FormatColorText, PlayCircleOutline,
  EventNote, ContentCopy, Preview, SmartToy, Inventory, Business, Settings, ExpandMore, ExpandLess, Public, Payments, Rocket
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api, logout, GET_MEDIA_URL } from '../api';
import TelegramCRM from './TelegramCRM';

const drawerWidth = 280;
const miniDrawerWidth = 80;

const AdminPanel = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [openDrawer, setOpenDrawer] = useState(!isMobile);
  const [activeKey, setActiveKey] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [data, setData] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [socialFeed, setSocialFeed] = useState([]);
  const [team, setTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ blog: 0, reels: 0, leads: 0, images: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState(null);

  const adminUser = localStorage.getItem('adminUser') || 'Admin';

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, key: 'dashboard' },
    { label: 'Appointments', icon: <EventNote />, key: 'telegramAppointments' },
    { 
      label: 'GSL', 
      icon: <Business />, 
      key: 'gsl_master',
      isGroup: true,
      subGroups: [
        { 
          label: 'Article', 
          icon: <Inventory />, 
          key: 'article',
          items: [
            { label: 'Items', key: 'gsl_items' },
            { label: 'Products', key: 'products' },
            { label: 'Services', key: 'services' },
            { label: 'Fixed Assets', key: 'fixed_assets' },
            { label: 'HRMS', key: 'hrms' }
          ]
        },
        { 
          label: 'Consignee', 
          icon: <People />, 
          key: 'consignee',
          items: [
            { label: 'Customers', key: 'customers' },
            { label: 'Patients', key: 'patients' },
            { label: 'Suppliers', key: 'suppliers' },
            { label: 'Employees', key: 'employees' },
            { label: 'Banks', key: 'banks' }
          ]
        },
        { 
          label: 'Miscellaneous', 
          icon: <Settings />, 
          key: 'misc',
          items: [
            { label: 'Currencies', key: 'currencies' },
            { label: 'Holidays', key: 'holidays' },
            { label: 'Taxes', key: 'taxes' },
            { label: 'Plans', key: 'plans' },
            { label: 'Schedules', key: 'schedules' },
            { label: 'Spaces', key: 'spaces' },
            { label: 'Periods', key: 'periods' },
            { label: 'Facilities', key: 'facilities' },
            { label: 'Cards', key: 'cards' }
          ]
        }
      ]
    },
    { 
      label: 'Website Manager', 
      icon: <Public />, 
      key: 'website_manager',
      isGroup: true,
      items: [
        { label: 'Services', icon: <HomeWork />, key: 'services' },
        { label: 'Blog Posts', icon: <DynamicFeed />, key: 'posts' },
        { label: 'Video Reels', icon: <VideoLibrary />, key: 'vposts' },
        { label: 'Reviews', icon: <Star />, key: 'reviews' },
        { label: 'Tracking', icon: <Visibility />, key: 'tracking' },
        { label: 'Social Media', icon: <Share />, key: 'social' },
        { label: 'Gallery', icon: <PhotoCamera />, key: 'gallery' },
        { label: 'Our Team', icon: <People />, key: 'team' }
      ]
    },
    { label: 'Inbox Feed', icon: <Inbox />, key: 'messages' },
    { label: 'Subscribers', icon: <MarkEmailRead />, key: 'newsletter' },
    { label: 'Marketing', icon: <ContactMail />, key: 'campaigns' },
    { label: 'Email Templates', icon: <FormatColorText />, key: 'templates' },
    { label: 'Telegram CRM', icon: <SmartToy />, key: 'telegram_crm' }
  ];

  const [openGroups, setOpenGroups] = useState(() => {
    const saved = localStorage.getItem('medico_open_groups');
    return saved ? JSON.parse(saved) : { gsl_master: true, article: false, consignee: false, misc: false, website_manager: false };
  });

  useEffect(() => {
    localStorage.setItem('medico_open_groups', JSON.stringify(openGroups));
  }, [openGroups]);

  const toggleGroup = (key) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    if (['dashboard', 'social', 'tracking', 'telegram_crm'].includes(activeKey)) {
      setData([]); 
      return;
    }
    setData([]);
    setLoading(true);
    try {
      if (api[activeKey]) {
        const resp = await api[activeKey].list();
        setData(resp || []);
        if (activeKey === 'messages') {
          const unread = resp.filter(m => !m.reply_text).length;
          setUnreadCount(unread);
          setSelectedMsg(resp[0] || null);
        }
      }
      
      const [notifs, tmpls, tm, svs, emps] = await Promise.all([
        api.notifications.list(),
        api.templates.list(),
        api.team.list(),
        api.services.list(),
        api.employees.list()
      ]);
      setNotifications(notifs || []);
      setTemplates(tmpls || []);
      setTeam(tm || []);
      setServices(svs || []);
      setEmployees(emps || []);
    } catch (err) {
      if (err.message.includes('401')) { logout(); navigate('/login'); }
      showFeedback('error', err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeKey]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [posts, videos, msgs, gallery, notifs] = await Promise.all([
          api.posts.list(),
          api.vposts.list(),
          api.messages.list(),
          api.gallery.list(),
          api.notifications.list()
        ]);
        setStats({
          blog: posts.length,
          reels: videos.length,
          leads: msgs.length,
          images: gallery.length
        });
        setUnreadCount(msgs.filter(m => !m.reply_text).length);
        setNotifications(notifs || []);
      } catch (err) { }
    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReply = async () => {
    if (!replyText) return;
    setSendingReply(true);
    try {
      await api.messages.reply(selectedMsg.id, replyText);
      showFeedback('success', 'Email reply sent to patient successfully!');
      setReplyText("");
      setOpenReplyDialog(false);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
    setSendingReply(false);
  };

  const showFeedback = (type, message) => setFeedback({ open: true, type, message });

  const renderNotifMenu = () => (
    <MuiMenu
      anchorEl={notifAnchor}
      open={Boolean(notifAnchor)}
      onClose={() => setNotifAnchor(null)}
      PaperProps={{ sx: { width: 320, borderRadius: 4, mt: 1.5, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Notifications</Typography>
        <Button size="small" onClick={async () => {
          await api.notifications.markAllRead();
          fetchData();
        }}>Mark all read</Button>
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">All quiet here!</Typography></Box>
        ) : notifications.map(n => (
          <MenuItem key={n.id} onClick={() => setNotifAnchor(null)} sx={{ py: 1.5, borderBottom: '1px solid #f5f5f5', whiteSpace: 'normal', bgcolor: n.is_read ? 'transparent' : 'rgba(0,185,216,0.05)' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{n.title}</Typography>
              <Typography variant="body2" color="text.secondary">{n.message}</Typography>
              <Typography variant="caption" sx={{ color: '#ccc' }}>{new Date(n.created_at).toLocaleTimeString()}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Box>
    </MuiMenu>
  );

  const renderMessagesTab = () => {
    const filteredMsgs = data.filter(m =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Grid container sx={{
        height: "calc(100vh - 200px)",
        borderRadius: 8, overflow: "hidden",
        boxShadow: "0 15px 50px rgba(0,62,91,0.08)",
        bgcolor: "#fff",
        border: "1px solid rgba(0,185,216,0.1)"
      }}>
        <Grid item xs={12} md={4} lg={3} sx={{
          borderRight: "1px solid rgba(0,0,0,0.08)",
          display: (isMobile && selectedMsg) ? "none" : "flex",
          flexDirection: "column",
          bgcolor: "#fff",
          height: "100%", overflow: "hidden"
        }}>
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1, color: "#003e5b" }}>Inbox</Typography>
              <Badge badgeContent={unreadCount} color="error"><Inbox /></Badge>
            </Box>
            <TextField
              placeholder="Find clinical lead..."
              fullWidth size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "#99aebb" }} fontSize="small" />,
                sx: { borderRadius: 10, bgcolor: "rgba(0,62,91,0.02)", border: "1px solid rgba(0,0,0,0.03)", px: 1 }
              }}
            />
          </Box>
          <List sx={{ flexGrow: 1, overflowY: "auto" }}>
            {filteredMsgs.map((msg) => (
              <ListItemButton key={msg.id} selected={selectedMsg?.id === msg.id} onClick={() => setSelectedMsg(msg)}>
                <Avatar sx={{ mr: 2 }}>{msg.name?.[0] || '?'}</Avatar>
                <ListItemText primary={msg.name} secondary={msg.subject} primaryTypographyProps={{ fontWeight: 800 }} />
              </ListItemButton>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={8} lg={9} sx={{ display: (isMobile && !selectedMsg) ? "none" : "flex", flexDirection: "column", bgcolor: "#fff" }}>
          {selectedMsg ? (
            <>
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton onClick={() => setSelectedMsg(null)} sx={{ display: { md: 'none' } }}><ChevronLeft /></IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedMsg.email}</Typography>
                <Button variant="outlined" size="small" color="primary" onClick={async () => {
                   await api.messages.convertToSubscriber(selectedMsg.id);
                   showFeedback('success', 'Lead converted to Marketing Subscriber');
                }}>Add to Subscribers</Button>
              </Box>
              <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>{selectedMsg.subject}</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>{selectedMsg.message}</Typography>
                {selectedMsg.reply_text && (
                  <Paper sx={{ p: 3, bgcolor: '#f0f9ff', borderRadius: 4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#00b9d8' }}>MEDICO REPLY</Typography>
                    <Typography>{selectedMsg.reply_text}</Typography>
                  </Paper>
                )}
              </Box>
              <Box sx={{ p: 3, borderTop: '1px solid #efefef' }}>
                <TextField fullWidth multiline rows={4} placeholder="Type your professional reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleReply} disabled={sendingReply}>Send Response</Button>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Select an inquiry to read</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    );
  };

  const renderNewsletterTab = () => (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Clinical Subscribers</Typography>
        <Button variant="outlined" onClick={() => window.open(api.newsletter.exportUrl())} startIcon={<History />}>Export List</Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: 'none', border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow><TableCell>Email</TableCell><TableCell>Status</TableCell><TableCell>Joined</TableCell><TableCell align="right">Actions</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {data.map(sub => (
              <TableRow key={sub.id}>
                <TableCell sx={{ fontWeight: 700 }}>{sub.email}</TableCell>
                <TableCell>
                  <Chip size="small" label={sub.is_active ? 'Active' : 'Inactive'} color={sub.is_active ? 'success' : 'default'} variant="outlined" />
                </TableCell>
                <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right"><IconButton onClick={() => handleDelete(sub.id)} color="error"><Delete /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderDashboard = () => (
    <Box sx={{ py: 2 }}>
      {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#003e5b', letterSpacing: '-1px' }}>Dashboard</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Real-time Clinical & Marketing Intelligence</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#00b9d8', display: 'block' }}>SYSTEM STATUS: OPTIMAL</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>Last sync: {new Date().toLocaleTimeString()}</Typography>
        </Box>
      </Box>

      {/* ── KEY PERFORMANCE INDICATORS ─────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Conversion Rate', value: '64%', growth: '+8.2%', color: 'linear-gradient(135deg, #00b9d8 0%, #0076ad 100%)', icon: <AutoAwesome /> },
            { label: 'Patient Retention', value: '78%', growth: '+2.1%', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: <People /> },
            { label: 'Referral Traffic', value: '12.4K', growth: '+15%', color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', icon: <Share /> },
            { label: 'Avg Sale (ETB)', value: '1,850', growth: '+4.5%', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: <Payments /> }
          ].map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
              <Card sx={{ borderRadius: 6, background: stat.color, color: '#fff', boxShadow: '0 10px 30px rgba(0,185,216,0.15)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</Typography>
                    <Box sx={{ p: 0.8, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>{React.cloneElement(stat.icon, { sx: { fontSize: 18 } })}</Box>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, bgcolor: 'rgba(255,255,255,0.15)', px: 1, py: 0.5, borderRadius: 2 }}>{stat.growth} vs prev period</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* ── REVENUE CHANNELS ─────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 6, border: '1px solid #efefef', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Revenue Channels</Typography>
                <Stack spacing={3}>
                  {[
                    { label: 'Direct Booking', val: 55, color: '#00b9d8' },
                    { label: 'Telegram Bot', val: 30, color: '#6366f1' },
                    { label: 'Referrals', val: 15, color: '#10b981' }
                  ].map(chan => (
                    <Box key={chan.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{chan.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: chan.color }}>{chan.val}%</Typography>
                      </Box>
                      <Box sx={{ height: 10, bgcolor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                        <Box sx={{ width: `${chan.val}%`, height: '100%', bgcolor: chan.color, transition: '1s width' }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* ── PERFORMANCE MONITOR ────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 6, border: '1px solid #efefef', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Clinical Service Index</Typography>
                <Grid container spacing={2}>
                  {[
                    { name: 'General Dental', count: '450', load: 85, trend: 'up' },
                    { name: 'Surgical', count: '120', load: 45, trend: 'up' },
                    { name: 'Cosmetic', count: '310', load: 60, trend: 'stable' },
                    { name: 'Pediatric', count: '85', load: 30, trend: 'up' }
                  ].map(item => (
                    <Grid size={{ xs: 6, md: 3 }} key={item.name}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 4, height: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>{item.name}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, my: 1 }}>{item.count}</Typography>
                        <LinearProgress variant="determinate" value={item.load} sx={{ height: 4, borderRadius: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: item.load > 70 ? '#10b981' : '#00b9d8' } }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              {/* Simulated Graph Area */}
              <Box sx={{ mt: 4, p: 3, bgcolor: '#002538', borderRadius: 5, display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 180 }}>
                {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 95, 60].map((h, i) => (
                  <Box key={i} sx={{ flex: 1, height: `${h}%`, bgcolor: '#00b9d8', borderRadius: '4px 4px 0 0', opacity: 0.5 + (h / 200), transition: '1s height' }} />
                ))}
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>MONTHLY PERFORMANCE WAVE</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTemplatesTab = () => (
    <Box sx={{ p: 1 }}>
      <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: 'none', border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow><TableCell>Template Name</TableCell><TableCell>Subject</TableCell><TableCell align="right">Actions</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {data.map(tmpl => (
              <TableRow key={tmpl.id}>
                <TableCell sx={{ fontWeight: 700 }}>{tmpl.name}</TableCell>
                <TableCell>{tmpl.subject}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(tmpl)} color="primary"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(tmpl.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContent = () => {
    switch (activeKey) {
      case 'dashboard': return renderDashboard();
      case 'messages': return renderMessagesTab();
      case 'newsletter': return renderNewsletterTab();
      case 'templates': return renderTemplatesTab();
      case 'campaigns': return renderCampaignsTab();
      case 'telegram_crm': return <TelegramCRM />;
      case 'telegramAppointments': return renderAppointmentsTab();
      default: return renderGenericTable();
    }
  };

  const renderAppointmentsTab = () => {
    let filteredData = data.filter(item => {
      const query = searchQuery.toLowerCase();
      const patientName = item.user_info?.name?.toLowerCase() || '';
      const patientPhone = item.user_info?.phone || '';
      const matchesSearch = patientName.includes(query) || patientPhone.includes(query) || item.service_name?.toLowerCase().includes(query);
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#003e5b' }}>Manage Appointments</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" placeholder="Search patient or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: '#999' }} /> }} />
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Manual Entry</Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 5px 25px rgba(0,0,0,0.02)', border: '1px solid rgba(0,185,216,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fcfdfe' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#003e5b' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#003e5b' }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#003e5b' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#003e5b' }}>Doctor</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#003e5b' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#003e5b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((appt) => (
                <TableRow key={appt.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#00b9d8', fontSize: '0.8rem' }}>{appt.user_info?.name?.[0] || 'P'}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{appt.user_info?.name || 'Anonymous'}</Typography>
                        <Typography variant="caption" color="text.secondary">{appt.user_info?.phone || 'No phone'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{appt.service_name}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>
                    <Typography sx={{ fontWeight: 700, color: '#003e5b' }}>{new Date(appt.appointment_date).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, color: appt.doctor_assigned ? '#003e5b' : '#94a3b8' }}>
                    {appt.doctor_assigned || 'Not Assigned'}
                  </TableCell>
                  <TableCell>
                    <Chip label={(appt.status || '').replace('_', ' ')} size="small" variant="outlined"
                      sx={{ fontSize: '0.65rem', fontWeight: 800, color: appt.status === 'confirmed' ? '#10b981' : appt.status === 'pending_payment' ? '#f59e0b' : '#64748b' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                       <IconButton size="small" onClick={() => handleOpenDialog(appt)} color="info"><Visibility sx={{ fontSize: 18 }} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Schedule">
                       <IconButton size="small" onClick={() => handleOpenDialog(appt)} color="primary"><Edit sx={{ fontSize: 18 }} /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                       <IconButton size="small" onClick={() => handleDelete(appt.id)} color="error"><Delete sx={{ fontSize: 18 }} /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderCampaignsTab = () => {
    return (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#666' }}>Active & Past Campaigns</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 4, px: 4 }}>Create New Campaign</Button>
            </Box>
          </Grid>
          {data.map(camp => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={camp.id}>
            <Card sx={{ borderRadius: 8, border: '1px solid #efefef', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 50px rgba(0,62,91,0.08)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#003e5b' }}>{camp.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventNote fontSize="inherit" /> {new Date(camp.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={camp.status} 
                    size="small" 
                    color={camp.status === 'Sent' ? 'success' : camp.status === 'Scheduled' ? 'primary' : 'default'} 
                    sx={{ fontWeight: 800, borderRadius: 2 }}
                  />
                </Box>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MarkEmailRead fontSize="small" sx={{ color: '#00b9d8' }} /> {camp.subject}
                </Typography>
                
                <Box sx={{ my: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#999' }}>DELIVERY PROGRESS</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#003e5b' }}>{camp.total_recipients} RECIPIENTS</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={camp.status === 'Sent' ? 100 : 0} sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f2f5' }} />
                </Box>

                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Duplicate"><IconButton size="small"><ContentCopy fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Preview"><IconButton size="small"><Preview fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(camp.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    disabled={sendingCampaignId === camp.id || camp.status === 'Sent'}
                    onClick={async () => {
                      setSendingCampaignId(camp.id);
                      await api.campaigns.send(camp.id);
                      setSendingCampaignId(null);
                      fetchData();
                      showFeedback('success', 'Marketing campaign sent!');
                    }}
                    startIcon={sendingCampaignId === camp.id ? <CircularProgress size={16} color="inherit" /> : <Send />}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                  >
                    {camp.status === 'Sent' ? 'Report' : 'Boost Now'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderGenericTable = () => {
    let filteredData = data.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(query));
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchesDate = !filterDate || (item.created_at && item.created_at.startsWith(filterDate));
      return matchesSearch && matchesStatus && matchesDate;
    });

    if (filteredData.length === 0) return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>🔎</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#555' }}>No Matching Results</Typography>
        <Typography variant="body2" color="text.secondary">Try adjusting your filters or search terms.</Typography>
      </Box>
    );
    const keys = Object.keys(filteredData[0]).filter(k => !['id', 'image', 'photo', 'logo', 'video', 'content', 'description', 'image_url', 'photo_url', 'logo_url', 'video_full_url', 'status', 'created_at'].includes(k));
    
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 5px 25px rgba(0,0,0,0.02)', border: '1px solid rgba(0,185,216,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fcfdfe' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#003e5b', fontSize: '0.8rem' }}>Preview</TableCell>
              {keys.map(k => <TableCell key={k} sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>{k}</TableCell>)}
              <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#003e5b', fontSize: '0.8rem' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} hover sx={{ '&:hover': { bgcolor: 'rgba(0,185,216,0.01)' } }}>
                <TableCell>
                  <Avatar variant="rounded" src={GET_MEDIA_URL(item.image_url || item.photo_url || item.logo_url)} sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', fontSize: '0.8rem' }}>{item.title?.[0] || item.name?.[0]}</Avatar>
                </TableCell>
                {keys.map(k => <TableCell key={k} sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#444' }}>{String(item[k])}</TableCell>)}
                <TableCell>
                  <Chip 
                    label={item.status || 'Active'} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.6rem', fontWeight: 700, borderRadius: 2,
                      color: item.status === 'Active' ? '#10b981' : item.status === 'Draft' ? '#64748b' : '#f59e0b',
                      borderColor: 'currentColor', bgcolor: 'transparent'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(item)} sx={{ color: '#00b9d8', bgcolor: 'rgba(0,185,216,0.03)', mr: 0.5 }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: '#ff4d4d', bgcolor: 'rgba(255,77,77,0.03)' }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleOpenDialog = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(item ? { ...item } : { status: 'Draft' });
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const currentKey = activeKey;
    const isFilePost = ['posts', 'reviews', 'vposts', 'clients', 'gallery', 'team'].includes(currentKey);

    // Fields that hold File objects — must ONLY be sent when the user picks a new file.
    // If the value is a string (existing URL from the DB), we skip it to avoid the
    // "The submitted data was not a file" Django error.
    const FILE_FIELDS = ['image', 'photo', 'video', 'thumbnail', 'logo'];

    try {
      let submitData = formData;
      if (isFilePost) {
        submitData = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'id') return;                          // never send id in body
          const val = formData[key];
          if (val instanceof File) {
            submitData.append(key, val);                    // new file chosen → send it
          } else if (FILE_FIELDS.includes(key)) {
            // It's a file field but value is a URL string → skip it (keep DB value)
            return;
          } else if (typeof val !== 'object' && val !== null && val !== undefined) {
            submitData.append(key, val);                    // regular text fields
          }
        });
      }

      if (editingId) await api[currentKey].update(editingId, submitData);
      else await api[currentKey].create(submitData);

      setOpenDialog(false);
      fetchData();
      showFeedback('success', 'Saved successfully!');
    } catch (err) {
      if (err.data && typeof err.data === 'object' && !Array.isArray(err.data)) {
        const [field, msg] = Object.entries(err.data)[0];
        showFeedback('error', `${field.toUpperCase()}: ${msg}`);
      } else {
        showFeedback('error', err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Perform permanent deletion?")) return;
    try {
      await api[activeKey].delete(id);
      showFeedback('success', 'Resource Removed');
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const renderFormContent = () => {
    const key = activeKey;
    const f = formData;
    const set = (field, val) => setFormData({ ...f, [field]: val });
    const setFile = (field, e) => setFormData({ ...f, [field]: e.target.files[0] });

    switch (key) {

      // ── BLOG POSTS ─────────────────────────────────────────────────────────
      case 'posts':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Post Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <TextField fullWidth label="Short Excerpt" value={f.excerpt || ''} onChange={e => set('excerpt', e.target.value)} />
            <TextField fullWidth multiline rows={8} label="Full Post Content" value={f.content || ''} onChange={e => set('content', e.target.value)} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Cover Image</Typography>
              {f.image_url && <img src={f.image_url} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />}
              <input type="file" accept="image/*" onChange={e => setFile('image', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── VIDEO REELS ────────────────────────────────────────────────────────
      case 'vposts':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Video Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <TextField fullWidth label="Video Link (YouTube/TikTok/etc.)" value={f.video_url || ''} onChange={e => set('video_url', e.target.value)} helperText="Leave empty if uploading a file instead" />
            <TextField fullWidth label="Description" multiline rows={3} value={f.description || ''} onChange={e => set('description', e.target.value)} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Upload Video File (MP4, MOV)</Typography>
              {f.video_full_url && (
                <video src={f.video_full_url} style={{ width: '100%', borderRadius: 8, marginBottom: 6 }} controls />
              )}
              <input type="file" accept="video/*" onChange={e => setFile('video', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── REVIEWS ────────────────────────────────────────────────────────────
      case 'reviews':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Patient Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth multiline rows={4} label="Review Message" value={f.message || ''} onChange={e => set('message', e.target.value)} />
            <TextField
              select fullWidth label="Rating" value={f.rating || 5}
              onChange={e => set('rating', e.target.value)} SelectProps={{ native: true }}>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
            </TextField>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Patient Photo</Typography>
              {f.photo_url && <img src={f.photo_url} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, display: 'block' }} />}
              <input type="file" accept="image/*" onChange={e => setFile('photo', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── GALLERY ────────────────────────────────────────────────────────────
      case 'gallery':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Image Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <TextField fullWidth label="Description" multiline rows={2} value={f.description || ''} onChange={e => set('description', e.target.value)} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Gallery Image</Typography>
              {f.image_url && <img src={f.image_url} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />}
              <input type="file" accept="image/*" onChange={e => setFile('image', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── OUR TEAM ───────────────────────────────────────────────────────────
      case 'team':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Member Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth label="Professional Role" value={f.role || ''} onChange={e => set('role', e.target.value)} />
            <TextField fullWidth multiline rows={4} label="Bio / Description" value={f.description || ''} onChange={e => set('description', e.target.value)} />
            <TextField fullWidth label="LinkedIn URL" value={f.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Profile Photo</Typography>
              {f.image_url && <img src={f.image_url} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 6, display: 'block' }} />}
              <input type="file" accept="image/*" onChange={e => setFile('image', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── TELEGRAM APPOINTMENTS ───────────────────────────────────────────────
      case 'telegramAppointments':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f0f9ff', border: '1px solid #00b9d8' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Appointment for: {f.user_info?.name || 'Manual Entry'}</Typography>
              <Typography variant="caption">Telegram User: @{f.user_info?.username || 'N/A'}</Typography>
            </Box>
            
            <TextField select fullWidth label="Service required (from GSL)" value={f.service_name || ''} 
              onChange={e => set('service_name', e.target.value)} SelectProps={{ native: true }}>
              <option value="">-- Select Service --</option>
              {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
            </TextField>

            <TextField fullWidth type="datetime-local" label="Appointment Date & Time" value={f.appointment_date ? f.appointment_date.slice(0, 16) : ''}
              onChange={e => set('appointment_date', e.target.value)} InputLabelProps={{ shrink: true }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField select fullWidth label="Status" value={f.status || 'pending_payment'} onChange={e => set('status', e.target.value)} SelectProps={{ native: true }}>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Payment Status" value={f.payment_status || 'unpaid'} onChange={e => set('payment_status', e.target.value)} SelectProps={{ native: true }}>
                  <option value="unpaid">Unpaid</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </TextField>
              </Grid>
            </Grid>

            <TextField select fullWidth label="Assigned Clinician (Internal GSL)" value={f.doctor_assigned || ''} 
              onChange={e => set('doctor_assigned', e.target.value)} SelectProps={{ native: true }}>
              <option value="">-- Select Employee --</option>
              {employees.map(m => <option key={m.id} value={m.name}>{m.name} ({m.position})</option>)}
            </TextField>
            
            <TextField fullWidth multiline rows={3} label="Internal Clinic Notes" value={f.internal_notes || ''} onChange={e => set('internal_notes', e.target.value)} />
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="outlined" fullWidth startIcon={<CheckCircle />} onClick={async () => {
                await api.telegramAppointments.sendConfirmation(f.id);
                showFeedback('success', 'Confirmation sent directly to patient Telegram!');
              }}>Confirm to Patient</Button>
              <Button variant="outlined" fullWidth startIcon={<Rocket />} onClick={async () => {
                await api.telegramAppointments.sendReminder(f.id);
                showFeedback('success', 'Reminder sent!');
              }}>Send Reminder</Button>
            </Box>
          </Stack>
        );
      // ── EMPLOYEES ─────────────────────────────────────────────────────────
      case 'employees':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}><TextField fullWidth label="Full Name" value={f.name || ''} onChange={e => set('name', e.target.value)} /></Grid>
              <Grid item xs={4}><TextField fullWidth label="Employee/Badge ID" value={f.employee_id || ''} onChange={e => set('employee_id', e.target.value)} /></Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Position / Role" value={f.position || ''} onChange={e => set('position', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Department" value={f.department || ''} onChange={e => set('department', e.target.value)} /></Grid>
            </Grid>
            
            <TextField fullWidth label="Specialization / Expertise" value={f.specialization || ''} onChange={e => set('specialization', e.target.value)} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Phone" value={f.phone || ''} onChange={e => set('phone', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Email" value={f.email || ''} onChange={e => set('email', e.target.value)} /></Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="Joining Date" value={f.joining_date || ''} 
                  onChange={e => set('joining_date', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="number" label="Monthly Salary" value={f.salary || ''} 
                  onChange={e => set('salary', e.target.value)} InputProps={{ startAdornment: <Typography sx={{ mr: 1, opacity: 0.5 }}>$</Typography> }} />
              </Grid>
            </Grid>

            <TextField select fullWidth label="Current Status" value={f.status || 'Active'} onChange={e => set('status', e.target.value)} SelectProps={{ native: true }}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Suspended">Suspended</option>
            </TextField>

            <TextField fullWidth label="Emergency Contact (Name & Phone)" value={f.emergency_contact || ''} onChange={e => set('emergency_contact', e.target.value)} />
            <TextField fullWidth multiline rows={2} label="Home Address" value={f.address || ''} onChange={e => set('address', e.target.value)} />
          </Stack>
        );

      // ── SCHEDULES ──────────────────────────────────────────────────────────
      case 'schedules':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select fullWidth label="Select Internal Staff Member" value={f.employee || ''} 
              onChange={e => set('employee', e.target.value)} SelectProps={{ native: true }}>
              <option value="">-- Choose Employee --</option>
              {employees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </TextField>
            <TextField select fullWidth label="Day of Week" value={f.day_of_week || 'Monday'} onChange={e => set('day_of_week', e.target.value)} SelectProps={{ native: true }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth type="time" label="Start Time" value={f.start_time || '08:00'} onChange={e => set('start_time', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={6}><TextField fullWidth type="time" label="End Time" value={f.end_time || '17:00'} onChange={e => set('end_time', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
            <FormControlLabel control={<Switch checked={f.is_available ?? true} onChange={e => set('is_available', e.target.checked)} />} label="Shift Available" />
            <TextField fullWidth label="Shift Notes (e.g. Lunch 12-1)" value={f.notes || ''} onChange={e => set('notes', e.target.value)} />
          </Stack>
        );


      // ── EMAIL TEMPLATES ────────────────────────────────────────────────────
      case 'templates':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Template Name (e.g. Summer Promo)" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth label="Email Subject Line" value={f.subject || ''} onChange={e => set('subject', e.target.value)} />
            <TextField fullWidth multiline rows={8} label="HTML/Message Body" value={f.body || ''} onChange={e => set('body', e.target.value)} helperText="Use {{name}} for patient name personalization" />
          </Stack>
        );

      // ── CAMPAIGNS ──────────────────────────────────────────────────────────
      case 'campaigns':
        const selectedTemplate = templates.find(t => t.id === Number(f.template));
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Campaign Branding Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <Box sx={{ p: 2, bgcolor: 'rgba(0,185,216,0.03)', borderRadius: 4, border: '1px solid rgba(0,185,216,0.1)' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#00b9d8', mb: 1, display: 'block' }}>SMART IMPORT TOOL</Typography>
              <TextField select fullWidth label="Select Clinical Template" value={f.template || ''}
                onChange={e => {
                  const val = e.target.value;
                  const tmpl = templates.find(t => t.id === Number(val));
                  if (tmpl) {
                    setFormData({ ...f, template: val, title: f.title || `${tmpl.name} Campaign`, subject: tmpl.subject, message: tmpl.body });
                    showFeedback('info', `Imported "${tmpl.name}"`);
                  } else { setFormData({ ...f, template: '' }); }
                }}
                SelectProps={{ native: true }}>
                <option value="">-- Start from Scratch --</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </TextField>
              {selectedTemplate && (
                <Box sx={{ mt: 1, p: 1.5, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fff' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>PREVIEW:</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5, color: '#888', fontStyle: 'italic' }}>{selectedTemplate.body.substring(0, 80)}...</Typography>
                </Box>
              )}
            </Box>
            <TextField fullWidth label="Campaign Email Subject" value={f.subject || ''} onChange={e => set('subject', e.target.value)} />
            <TextField fullWidth multiline rows={6} label="Full Marketing Message" value={f.message || ''} onChange={e => set('message', e.target.value)} />
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#003e5b', mb: 1, display: 'block' }}>SCHEDULING OPTIONS</Typography>
              <TextField fullWidth type="datetime-local" label="Schedule for Future Send"
                value={f.scheduled_for ? f.scheduled_for.slice(0, 16) : ''}
                onChange={e => set('scheduled_for', e.target.value)}
                InputLabelProps={{ shrink: true }} />
            </Box>
          </Stack>
        );
      
      // ── PATIENT REGISTRATION ───────────────────────────────────────────────
      case 'patients':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Full Name" value={f.full_name || ''} onChange={e => set('full_name', e.target.value)} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Phone" value={f.phone || ''} onChange={e => set('phone', e.target.value)} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Age" type="number" value={f.age || ''} onChange={e => set('age', e.target.value)} /></Grid>
            </Grid>
            <TextField select fullWidth label="Gender" value={f.gender || 'Male'} onChange={e => set('gender', e.target.value)} SelectProps={{ native: true }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </TextField>
            <TextField fullWidth label="Email" value={f.email || ''} onChange={e => set('email', e.target.value)} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField select fullWidth label="Blood Type" value={f.blood_type || ''} onChange={e => set('blood_type', e.target.value)} SelectProps={{ native: true }}>
                  <option value="">-- Unknown --</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Emergency Contact (Name/Phone)" value={f.emergency_contact || ''} onChange={e => set('emergency_contact', e.target.value)} /></Grid>
            </Grid>
            <TextField fullWidth multiline rows={2} label="Address" value={f.address || ''} onChange={e => set('address', e.target.value)} />
            <TextField fullWidth multiline rows={4} label="Medical History" value={f.medical_history || ''} onChange={e => set('medical_history', e.target.value)} />
          </Stack>
        );

      // ── PRODUCT REGISTRATION ───────────────────────────────────────────────
      case 'products':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Product Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Category" value={f.category || ''} onChange={e => set('category', e.target.value)} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Price" type="number" value={f.price || ''} onChange={e => set('price', e.target.value)} /></Grid>
            </Grid>
            <TextField fullWidth multiline rows={3} label="Description" value={f.description || ''} onChange={e => set('description', e.target.value)} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>Product Image</Typography>
              {f.image_url && <img src={f.image_url} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 8, marginBottom: 6 }} />}
              <input type="file" accept="image/*" onChange={e => setFile('image', e)} style={{ display: 'block', marginTop: 4 }} />
            </Box>
          </Stack>
        );

      // ── INVENTORY ITEMS ────────────────────────────────────────────────────
      case 'inventory':
      case 'gsl_items':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Item Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth label="SKU / Barcode" value={f.sku || ''} onChange={e => set('sku', e.target.value)} />
            <TextField fullWidth label="Stock Quantity" type="number" value={f.quantity || 0} onChange={e => set('quantity', e.target.value)} />
            <TextField fullWidth label="Storage Location (Bin/Shelf)" value={f.location || ''} onChange={e => set('location', e.target.value)} />
          </Stack>
        );

      // ── SERVICES ──────────────────────────────────────────────────────────
      case 'services':
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Service Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Professional Description" value={f.description || ''} onChange={e => set('description', e.target.value)} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Department" value={f.department || ''} onChange={e => set('department', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Icon Name (FontAwesome/MUI)" value={f.icon || ''} onChange={e => set('icon', e.target.value)} /></Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth type="number" label="Service Price" value={f.price || ''} 
                  onChange={e => set('price', e.target.value)} InputProps={{ startAdornment: <Typography sx={{ mr: 1, opacity: 0.5 }}>$</Typography> }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="number" label="Estimated Duration (Mins)" value={f.duration || ''} 
                  onChange={e => set('duration', e.target.value)} />
              </Grid>
            </Grid>

            <FormControlLabel 
              control={<Switch checked={f.is_active ?? true} onChange={e => set('is_active', e.target.checked)} />} 
              label="Active (Display in Telegram Bot)" 
            />
          </Stack>
        );

      // ── GSL GENERIC MODULES ────────────────────────────────────────────────
      default:
        return (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField fullWidth label="Name / Descriptor" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth label="Reference Code" value={f.code || ''} onChange={e => set('code', e.target.value)} />
            <TextField fullWidth multiline rows={4} label="Full Details" value={f.details || ''} onChange={e => set('details', e.target.value)} />
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fcfdfe' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#fff', color: '#003e5b', boxShadow: 'none', borderBottom: '1px solid #efefef' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} edge="start"><Menu /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #001a2e, #00b9d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MEDICO ANALYTICS</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
              <Badge badgeContent={notifications.filter(n => !n.is_read).length} color="error" overlap="circular"><Notifications /></Badge>
            </IconButton>
            {renderNotifMenu()}
            <Avatar sx={{ bgcolor: '#00b9d8', ml: 1, width: 32, height: 32, fontSize: '0.8rem', fontWeight: 900 }}>{adminUser[0]}</Avatar>
            <IconButton onClick={handleLogout} color="error" size="small" sx={{ ml: 1 }}><Logout fontSize="small" /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: openDrawer ? drawerWidth : miniDrawerWidth,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': { 
            width: openDrawer ? drawerWidth : miniDrawerWidth, 
            boxSizing: 'border-box', 
            borderRight: '1px solid #efefef', 
            bgcolor: '#fff',
            overflowX: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: openDrawer ? 2 : 1.5 }}>
          <List>
            {menuItems.map((item, index) => {
              if (item.isGroup) {
                return (
                  <React.Fragment key={item.key}>
                    <Tooltip title={!openDrawer ? item.label : ""} placement="right">
                      <ListItemButton 
                        onClick={() => {
                          if (!openDrawer) setOpenDrawer(true);
                          toggleGroup(item.key);
                        }}
                        sx={{ borderRadius: 4, mb: 0.5, py: 0.5, px: openDrawer ? 2 : 1, color: '#003e5b', '&:hover': { bgcolor: 'rgba(0,185,216,0.05)' }, justifyContent: openDrawer ? 'initial' : 'center' }}
                      >
                        <ListItemIcon sx={{ minWidth: openDrawer ? 28 : 0, mr: openDrawer ? 1 : 0, color: '#00b9d8', display: 'flex', justifyContent: 'center' }}>{React.cloneElement(item.icon, { sx: { fontSize: 20 } })}</ListItemIcon>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.04em' }} sx={{ display: openDrawer ? 'block' : 'none' }} />
                        {openDrawer && (openGroups[item.key] ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />)}
                      </ListItemButton>
                    </Tooltip>
                    <Collapse in={openDrawer && openGroups[item.key]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ mb: 1 }}>
                        {item.subGroups ? (
                          item.subGroups.map(group => (
                            <React.Fragment key={group.key}>
                              <ListItemButton 
                                onClick={() => toggleGroup(group.key)}
                                sx={{ pl: 4, py: 0.3, borderRadius: 4, color: '#003e5b' }}
                              >
                                <ListItemIcon sx={{ minWidth: 24, color: '#00b9d8' }}>{React.cloneElement(group.icon, { sx: { fontSize: 16 } })}</ListItemIcon>
                                <ListItemText primary={group.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.7rem' }} />
                                {openGroups[group.key] ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
                              </ListItemButton>
                              <Collapse in={openGroups[group.key]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  {group.items.map(subItem => (
                                    <ListItemButton 
                                      key={subItem.key}
                                      selected={activeKey === subItem.key}
                                      onClick={() => setActiveKey(subItem.key)}
                                      sx={{ pl: 8, py: 0.1, borderRadius: 4, '&.Mui-selected': { bgcolor: 'rgba(0,185,216,0.1)', color: '#00b9d8' } }}
                                    >
                                      <ListItemText primary={subItem.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.75rem' }} />
                                    </ListItemButton>
                                  ))}
                                </List>
                              </Collapse>
                            </React.Fragment>
                          ))
                        ) : (
                          item.items.map((sub) => (
                            <ListItemButton 
                              key={sub.key} 
                              selected={activeKey === sub.key}
                              onClick={() => setActiveKey(sub.key)}
                              sx={{ pl: 5, py: 0.2, borderRadius: 4, '&.Mui-selected': { bgcolor: 'rgba(0,185,216,0.1)', color: '#00b9d8' } }}
                            >
                              <ListItemIcon sx={{ minWidth: 24, color: '#00b9d8' }}>{React.cloneElement(sub.icon || <AutoAwesome />, { sx: { fontSize: 14 } })}</ListItemIcon>
                              <ListItemText primary={sub.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.78rem' }} />
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }
              return (
                <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
                  <Tooltip title={!openDrawer ? item.label : ""} placement="right">
                    <ListItemButton 
                      selected={activeKey === item.key} 
                      onClick={() => {
                        if (item.path) navigate(item.path);
                        else setActiveKey(item.key);
                      }}
                      sx={{ borderRadius: 4, py: 0.5, px: openDrawer ? 2 : 1, transition: '0.2s', justifyContent: openDrawer ? 'initial' : 'center', '&.Mui-selected': { bgcolor: 'rgba(0,185,216,0.08)', color: '#00b9d8', '& .MuiListItemIcon-root': { color: '#00b9d8' } } }}
                    >
                      <ListItemIcon sx={{ minWidth: openDrawer ? 28 : 0, mr: openDrawer ? 1 : 0, display: 'flex', justifyContent: 'center' }}>{React.cloneElement(item.icon, { sx: { fontSize: 20 } })}</ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.75rem' }} sx={{ display: openDrawer ? 'block' : 'none' }} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 6 }, mt: 8, transition: 'all 0.3s ease-in-out' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#001a2e', letterSpacing: '-0.02em' }}>
              {activeKey === 'dashboard' ? 'Overview' : 
               menuItems.flatMap(m => m.isGroup ? (m.subGroups || [m]).flatMap(sm => sm.items || [sm]) : [m])
                        .find(i => i.key === activeKey)?.label || 'Clinic Manager'}
            </Typography>
            <Breadcrumbs sx={{ mt: 0.5 }}>
              <Link underline="hover" color="inherit" fontSize="0.75rem">Clinical Hub</Link>
              <Typography color="primary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{activeKey}</Typography>
            </Breadcrumbs>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            {activeKey !== 'dashboard' && (
              <Box sx={{ position: 'relative' }}>
                <Search sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 18 }} />
                <TextField 
                  placeholder="Find anything..." 
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      pl: 4, borderRadius: 10, bgcolor: '#f8fafc', width: { xs: 120, md: 180 }, 
                      fontSize: '0.75rem', border: 'none', '& fieldset': { border: 'none' }
                    } 
                  }} 
                />
              </Box>
            )}
            {activeKey !== 'dashboard' && (
              <Stack direction="row" spacing={1}>
                <TextField
                  select
                  size="small"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 10, bgcolor: '#f8fafc', fontSize: '0.75rem', border: 'none', '& fieldset': { border: 'none' }
                    } 
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archive">Archived</option>
                </TextField>
                <TextField
                  type="date"
                  size="small"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 10, bgcolor: '#f8fafc', fontSize: '0.75rem', border: 'none', '& fieldset': { border: 'none' }
                    } 
                  }}
                />
              </Stack>
            )}
            {!['dashboard', 'campaigns', 'newsletter', 'messages', 'templates', 'telegram_crm'].includes(activeKey) &&
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 10, px: 3, py: 1, textTransform: 'none', fontWeight: 600, bgcolor: '#001a2e', '&:hover': { bgcolor: '#003e5b' }, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>New Entry</Button>
            }
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
            <CircularProgress thickness={5} size={60} />
            <Typography sx={{ mt: 3, fontWeight: 800, color: '#999' }}>SYNCING CLINICAL DATA...</Typography>
          </Box>
        ) : renderContent()}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 8, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 950, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Edit Resource' : 'Create New Entry'}
          <IconButton onClick={() => setOpenDialog(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>{renderFormContent()}</DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 800, color: '#999' }}>Discard</Button>
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 4, px: 6, py: 1.5, fontWeight: 900, background: 'linear-gradient(135deg, #001a2e, #003e5b)' }}>Verify & Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={feedback.open} autoHideDuration={4000} onClose={() => setFeedback({ ...feedback, open: false })}>
        <Alert severity={feedback.type} variant="filled" sx={{ borderRadius: 4, fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>{feedback.message}</Alert>
      </Snackbar>
      
      {activeKey === 'marketing_unlocked' && (
        <Fab color="primary" sx={{ position: 'fixed', bottom: 40, right: 40, boxShadow: '0 15px 35px rgba(0,185,216,0.4)' }} onClick={() => handleOpenDialog()}>
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default AdminPanel;
