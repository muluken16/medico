import React, { useState, useEffect } from 'react';
import {
  Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Collapse, Container, Card, CardContent, Grid, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Avatar, Breadcrumbs, Link,
  Alert, CircularProgress, Tooltip, Stack, Switch, FormControlLabel, Snackbar
} from '@mui/material';
import {
  Menu, ChevronLeft, ExpandLess, ExpandMore, Inventory, Settings, 
  People, Business, Payments, Event, Schedule, Public, ReceiptLong,
  HealthAndSafety, HomeRepairService, Add, Edit, Delete, Search, ExitToApp,
  Visibility, FilterList, Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const drawerWidth = 280;

const GSL = () => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState({ article: true, consignee: true, misc: true });
  const [activeTab, setActiveTab] = useState('Items');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [feedback, setFeedback] = useState({ open: false, msg: '', severity: 'success' });

  // ── Mapping UI names to API keys ──────────────────────────────────────────
  const keyMapping = {
    'Items': 'inventory',
    'Products': 'products',
    'Services': 'services',
    'Patients': 'patients',
    'Employees': 'employees',
    'Schedules': 'schedules',
    'Customers': 'clients', // Assuming clients maps to customers
  };

  const getAPIKey = () => keyMapping[activeTab] || activeTab.toLowerCase();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = getAPIKey();
      if (api[apiKey]) {
        const res = await api[apiKey].list();
        setData(res || []);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const toggleSubMenu = (menu) => {
    setOpenSubMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const showFeedback = (severity, msg) => setFeedback({ open: true, msg, severity });

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const apiKey = getAPIKey();
      const isFormData = ['products', 'team', 'posts'].includes(apiKey);
      
      let finalData = formData;
      if (isFormData) {
        finalData = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (v instanceof File) finalData.append(k, v);
          else if (v !== null && v !== undefined) finalData.append(k, v);
        });
      }

      if (editingId) {
        await api[apiKey].update(editingId, finalData);
        showFeedback('success', `${activeTab} updated successfully`);
      } else {
        await api[apiKey].create(finalData);
        showFeedback('success', `New ${activeTab} registered`);
      }
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const apiKey = getAPIKey();
      await api[apiKey].delete(id);
      showFeedback('success', 'Record removed');
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const menuStructure = {
    article: {
      title: 'Article',
      icon: <Inventory />,
      items: ['Items', 'Products', 'Services', 'Fixed Assets', 'HRMS']
    },
    consignee: {
      title: 'Consignee',
      icon: <People />,
      items: ['Customers', 'Patients', 'Suppliers', 'Employees', 'Banks']
    },
    misc: {
      title: 'Miscellaneous',
      icon: <Settings />,
      items: ['Currencies', 'Holidays', 'Taxes', 'Plans', 'Schedules', 'Spaces', 'Periods', 'Facilities', 'Cards']
    }
  };

  const filteredData = data.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchStr)) ||
      (item.title && item.title.toLowerCase().includes(searchStr)) ||
      (item.full_name && item.full_name.toLowerCase().includes(searchStr)) ||
      (item.sku && item.sku.toLowerCase().includes(searchStr))
    );
  });

  const renderTableHeaders = () => {
    switch(getAPIKey()) {
      case 'inventory': return <>
        <TableCell sx={{ fontWeight: 800 }}>Item Name</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>SKU</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Quantity</TableCell>
      </>;
      case 'services': return <>
        <TableCell sx={{ fontWeight: 800 }}>Service</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Price</TableCell>
      </>;
      case 'patients': return <>
        <TableCell sx={{ fontWeight: 800 }}>Patient Name</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Phone</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Gender</TableCell>
      </>;
      case 'employees': return <>
        <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Badge ID</TableCell>
      </>;
      default: return <>
        <TableCell sx={{ fontWeight: 800 }}>Name / Title</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Ref Code</TableCell>
      </>;
    }
  };

  const renderTableRow = (item) => {
    switch(getAPIKey()) {
      case 'inventory': return <>
        <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
        <TableCell>{item.sku}</TableCell>
        <TableCell>{item.quantity}</TableCell>
      </>;
      case 'services': return <>
        <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
        <TableCell>{item.department}</TableCell>
        <TableCell>${item.price}</TableCell>
      </>;
      case 'patients': return <>
        <TableCell sx={{ fontWeight: 700 }}>{item.full_name}</TableCell>
        <TableCell>{item.phone}</TableCell>
        <TableCell>{item.gender}</TableCell>
      </>;
      case 'employees': return <>
        <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
        <TableCell>{item.position}</TableCell>
        <TableCell>{item.employee_id}</TableCell>
      </>;
      default: return <>
        <TableCell sx={{ fontWeight: 700 }}>{item.name || item.title || 'N/A'}</TableCell>
        <TableCell>{item.category || item.department || 'General'}</TableCell>
        <TableCell>{item.sku || item.code || '-'}</TableCell>
      </>;
    }
  };

  const renderFormContent = () => {
    const f = formData;
    const set = (field, val) => setFormData({ ...f, [field]: val });
    const setFile = (field, e) => setFormData({ ...f, [field]: e.target.files[0] });

    switch (getAPIKey()) {
      case 'inventory':
        return (
          <Stack spacing={2}>
            <TextField fullWidth label="Item Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth label="SKU / Barcode" value={f.sku || ''} onChange={e => set('sku', e.target.value)} />
            <TextField fullWidth type="number" label="Quantity in Stock" value={f.quantity || 0} onChange={e => set('quantity', e.target.value)} />
            <TextField fullWidth label="Storage Location" value={f.location || ''} onChange={e => set('location', e.target.value)} />
          </Stack>
        );
      case 'services':
        return (
          <Stack spacing={2}>
            <TextField fullWidth label="Service Title" value={f.title || ''} onChange={e => set('title', e.target.value)} />
            <TextField fullWidth label="Department" value={f.department || ''} onChange={e => set('department', e.target.value)} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth type="number" label="Price" value={f.price || ''} onChange={e => set('price', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth type="number" label="Duration (Mins)" value={f.duration || ''} onChange={e => set('duration', e.target.value)} /></Grid>
            </Grid>
            <TextField fullWidth multiline rows={3} label="Description" value={f.description || ''} onChange={e => set('description', e.target.value)} />
            <FormControlLabel control={<Switch checked={f.is_active ?? true} onChange={e => set('is_active', e.target.checked)} />} label="Active Status" />
          </Stack>
        );
      case 'employees':
        return (
          <Stack spacing={2}>
            <TextField fullWidth label="Full Name" value={f.name || ''} onChange={e => set('name', e.target.value)} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Badge ID" value={f.employee_id || ''} onChange={e => set('employee_id', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Position" value={f.position || ''} onChange={e => set('position', e.target.value)} /></Grid>
            </Grid>
            <TextField select fullWidth label="Department" value={f.department || ''} onChange={e => set('department', e.target.value)} SelectProps={{ native: true }}>
              <option value="">-- Select --</option>
              <option value="Clinical">Clinical</option>
              <option value="Admin">Admin</option>
              <option value="Marketing">Marketing</option>
            </TextField>
          </Stack>
        );
      case 'schedules':
        return (
          <Stack spacing={2}>
            <TextField select fullWidth label="Employee" value={f.employee || ''} onChange={e => set('employee', e.target.value)} SelectProps={{ native: true }}>
              <option value="">-- Master Generic Schedule (No Employee) --</option>
              {/* Optional: You could fetch and map actual employees here */}
              <option value="1">Dr. Abel Tesfaye</option>
              <option value="2">Dr. Sara Solomon</option>
              <option value="3">Nurse Hanna Bekele</option>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField select fullWidth label="Day of Week" value={f.day_of_week || 'Monday'} onChange={e => set('day_of_week', e.target.value)} SelectProps={{ native: true }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Clinical Category" value={f.category || ''} onChange={e => set('category', e.target.value)} helpText="e.g. Cardiology, Dental" />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth type="time" label="Start Time" value={f.start_time || ''} onChange={e => set('start_time', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={6}><TextField fullWidth type="time" label="End Time" value={f.end_time || ''} onChange={e => set('end_time', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
            <TextField fullWidth label="Internal Notes" value={f.notes || ''} onChange={e => set('notes', e.target.value)} />
            <FormControlLabel control={<Switch checked={f.is_available ?? true} onChange={e => set('is_available', e.target.checked)} />} label="Shift is Active/Available" />
          </Stack>
        );
      case 'patients':
        return (
          <Stack spacing={2}>
            <TextField fullWidth label="Patient Name" value={f.full_name || ''} onChange={e => set('full_name', e.target.value)} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Phone" value={f.phone || ''} onChange={e => set('phone', e.target.value)} /></Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Gender" value={f.gender || ''} onChange={e => set('gender', e.target.value)} SelectProps={{ native: true }}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </TextField>
              </Grid>
            </Grid>
            <TextField fullWidth label="Emergency Contact" value={f.emergency_contact || ''} onChange={e => set('emergency_contact', e.target.value)} />
          </Stack>
        );
      default:
        return (
          <Stack spacing={2}>
            <TextField fullWidth label="Name / Title" value={f.name || f.title || ''} onChange={e => set('name', e.target.value)} />
            <TextField fullWidth multiline rows={4} label="Full Details" value={f.description || f.details || ''} onChange={e => set('description', e.target.value)} />
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f7f9', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* ── TOP BAR ────────────────────────────────────────────────────────── */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} edge="start" sx={{ mr: 2 }}><Menu /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2d3748', letterSpacing: '-0.5px' }}>
              MEDICO <span style={{ color: '#00b9d8', fontWeight: 400 }}>GSL MASTER</span>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button startIcon={<Public />} size="small" variant="outlined" sx={{ borderRadius: 2 }}>Public View</Button>
            <Button startIcon={<ExitToApp />} onClick={() => navigate('/admin')} sx={{ fontWeight: 700, borderRadius: 2 }}>Admin CRM</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: openDrawer ? drawerWidth : 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#003e5b', 
            color: '#fff',
            borderRight: 'none',
            transition: 'width 0.2s cubic-bezier(0,0,0.2,1)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {Object.entries(menuStructure).map(([key, group]) => (
            <React.Fragment key={key}>
              <ListItemButton onClick={() => toggleSubMenu(key)} sx={{ px: 3, py: 1.5 }}>
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.4)', minWidth: 40 }}>{group.icon}</ListItemIcon>
                <ListItemText primary={group.title} primaryTypographyProps={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }} />
                {openSubMenus[key] ? <ExpandLess sx={{ opacity: 0.5 }} /> : <ExpandMore sx={{ opacity: 0.5 }} />}
              </ListItemButton>
              
              <Collapse in={openSubMenus[key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.items.map((item) => (
                    <ListItemButton 
                      key={item} 
                      selected={activeTab === item}
                      onClick={() => setActiveTab(item)}
                      sx={{ 
                        pl: 8, py: 1, 
                        '&.Mui-selected': { 
                          bgcolor: 'rgba(0,185,216,0.15)', 
                          color: '#00b9d8', 
                          borderRight: '4px solid #00b9d8' 
                        },
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: activeTab === item ? 700 : 400 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 1 }} />
            </React.Fragment>
          ))}
        </Box>
      </Drawer>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#003e5b' }}>{activeTab}</Typography>
            <Breadcrumbs sx={{ mt: 1 }}>
              <Link underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>Master Intelligence</Link>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#00b9d8' }}>{activeTab} Management</Typography>
            </Breadcrumbs>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchData} sx={{ borderRadius: 2 }}>Sync</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: '12px', bgcolor: '#003e5b', px: 4, boxShadow: '0 4px 14px rgba(0,62,91,0.2)' }}>
              Register {activeTab}
            </Button>
          </Stack>
        </Box>

        {/* ── SEARCH & FILTER ──────────────────────────────────────────────── */}
        <Card sx={{ mb: 3, borderRadius: '16px', boxShadow: 'none', border: '1px solid #efefef' }}>
          <CardContent sx={{ py: 2, display: 'flex', gap: 2 }}>
            <TextField 
              fullWidth 
              size="small" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Quick search ${activeTab.toLowerCase()}...`}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#a0aec0' }} />,
                sx: { borderRadius: '10px', bgcolor: '#fcfdfe' }
              }}
            />
            <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '10px' }}>Filter</Button>
          </CardContent>
        </Card>

        {/* ── TABLE VIEW ──────────────────────────────────────────────────── */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#4a5568' }}># ID</TableCell>
                  {renderTableHeaders()}
                  <TableCell sx={{ fontWeight: 800, color: '#4a5568' }}>Last Updated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>Manage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ color: '#a0aec0', fontSize: '0.8rem' }}>#{item.id}</TableCell>
                    {renderTableRow(item)}
                    <TableCell sx={{ fontSize: '0.8rem', color: '#718096' }}>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(item)}><Edit sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}><Delete sx={{ fontSize: 18 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#a0aec0' }}>No records found in {activeTab}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* ── REGISTRATION DIALOG ───────────────────────────────────────────── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, pb: 2 }}>{editingId ? 'Edit' : 'Register New'} {activeTab}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {renderFormContent()}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 700, color: '#718096' }}>Discard</Button>
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: '10px', px: 4, bgcolor: '#003e5b', '&:hover': { bgcolor: '#001a2e' } }}>Save Registration</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={feedback.open} 
        autoHideDuration={4000} 
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>{feedback.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default GSL;
