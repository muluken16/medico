import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, CircularProgress, Tooltip, Stack,
  LinearProgress, InputAdornment, Alert, Snackbar, Checkbox, Divider,
  FormControlLabel
} from '@mui/material';
import {
  Chat, LocalOffer, Delete, EventNote, Send, CheckCircle, Edit,
  SmartToy, History, Search, Clear, PersonSearch, Person, Category,
  Group, Rocket, SelectAll, Deselect
} from '@mui/icons-material';
import { api } from '../api';

const SOURCE_CATEGORIES = ['Bot', 'Website', 'Ad', 'Referral', 'Other'];

const TelegramCRM = () => {
  const [users, setUsers]             = useState([]);
  const [tags, setTags]               = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [campaigns, setCampaigns]     = useState([]);
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── Search / Filter ──────────────────────────────────────────────────────────
  const [searchName, setSearchName]   = useState('');
  const [filterTag, setFilterTag]     = useState('');
  const [filterSource, setFilterSource] = useState('');

  // ── Selection ───────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ── Dialogs ──────────────────────────────────────────────────────────────────
  const [openCampaign, setOpenCampaign] = useState(false);
  const [openTag, setOpenTag]         = useState(false);
  const [openSend, setOpenSend]       = useState(false); // direct send to selected

  // ── Forms ──────────────────────────────────────────────────────────────────
  const [tagForm, setTagForm]         = useState({ name: '' });
  const [campaignForm, setCampaignForm] = useState({ title: '', message: '', targetTags: [] });
  const [directMsg, setDirectMsg]     = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]); // uploaded File objects
  const [sending, setSending]         = useState(false);
  const [snackbar, setSnackbar]       = useState({ open: false, msg: '', severity: 'success' });
  const [openAppointment, setOpenAppointment] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [apptForm, setApptForm] = useState({});

  // ── Load ─────────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, t, a, c, l] = await Promise.all([
        api.telegramUsers.list(),
        api.telegramTags.list(),
        api.telegramAppointments.list(),
        api.telegramCampaigns.list(),
        api.telegramLogs?.list ? api.telegramLogs.list() : Promise.resolve([])
      ]);
      setUsers(u || []);
      setTags(t || []);
      setAppointments(a || []);
      setCampaigns(c || []);
      setLogs(l || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Filtered list (memoized) ─────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const nm = !searchName ||
        (u.name || '').toLowerCase().includes(searchName.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(searchName.toLowerCase()) ||
        String(u.chat_id).includes(searchName);
      const tg = !filterTag  || u.tags?.some(t => t.id === Number(filterTag));
      const sc = !filterSource || (u.source || 'Bot').toLowerCase() === filterSource.toLowerCase();
      return nm && tg && sc;
    });
  }, [users, searchName, filterTag, filterSource]);

  const isFiltered = searchName || filterTag || filterSource;

  // ── Selection helpers ─────────────────────────────────────────────────────────
  const toggleOne = (chatId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(chatId) ? next.delete(chatId) : next.add(chatId);
      return next;
    });
  };

  const selectAllFiltered = () => setSelectedIds(new Set(filteredUsers.map(u => u.chat_id)));
  const clearSelection    = () => setSelectedIds(new Set());

  const selectedCount     = selectedIds.size;
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.has(u.chat_id));

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleCreateTag = async () => {
    if (!tagForm.name.trim()) return;
    await api.telegramTags.create({ name: tagForm.name.trim().toLowerCase().replace(/\s+/g, '_') });
    setOpenTag(false); setTagForm({ name: '' }); fetchData();
    setSnackbar({ open: true, msg: 'Tag created!', severity: 'success' });
  };

  const handleCreateCampaign = async () => {
    if (!campaignForm.title || !campaignForm.message) return;
    await api.telegramCampaigns.create({ title: campaignForm.title, message: campaignForm.message, target_tags_ids: campaignForm.targetTags });
    setOpenCampaign(false);
    setCampaignForm({ title: '', message: '', targetTags: [] });
    fetchData();
    setSnackbar({ open: true, msg: 'Campaign created & sent!', severity: 'success' });
  };

  // ── DIRECT SEND to selected users ─────────────────────────────────────────────
  const handleDirectSend = async () => {
    if ((!directMsg.trim() && attachedFiles.length === 0) || selectedCount === 0) return;
    setSending(true);
    try {
      const chatIds = Array.from(selectedIds);
      const res = await api.telegramSendDirect(chatIds, directMsg, attachedFiles);
      setOpenSend(false);
      setDirectMsg('');
      setAttachedFiles([]);
      setSelectedIds(new Set());
      fetchData();
      setSnackbar({
        open: true,
        msg: `✅ Sent to ${res.sent} users. ${res.failed > 0 ? `⚠️ ${res.failed} failed.` : ''}`,
        severity: res.failed === 0 ? 'success' : 'warning'
      });
    } catch (e) {
      setSnackbar({ open: true, msg: 'Failed to send. Check logs.', severity: 'error' });
    }
    setSending(false);
  };

  const handleSendNotification = async (type) => {
    if (!selectedAppt) return;
    try {
      if (type === 'confirmation') await api.telegramAppointments.sendConfirmation(selectedAppt.id);
      else await api.telegramAppointments.sendReminder(selectedAppt.id);
      setSnackbar({ open: true, msg: `${type.charAt(0).toUpperCase() + type.slice(1)} sent via Telegram!`, severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, msg: `Failed to send ${type}.`, severity: 'error' });
    }
  };

  const handleUpdateAppointment = async () => {
    if (!selectedAppt) return;
    try {
      await api.telegramAppointments.update(selectedAppt.id, apptForm);
      setOpenAppointment(false);
      fetchData();
      setSnackbar({ open: true, msg: 'Appointment updated!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, msg: 'Failed to update appointment.', severity: 'error' });
    }
  };

  const handleOpenAppt = (appt) => {
    setSelectedAppt(appt);
    setApptForm({
      status: appt.status,
      payment_status: appt.payment_status,
      appointment_date: appt.appointment_date,
      internal_notes: appt.internal_notes || '',
      doctor_assigned: appt.doctor_assigned || '',
    });
    setOpenAppointment(true);
  };

  const handleDelete = async (resource, id) => {
    if (!window.confirm('Delete?')) return;
    await api[resource].delete(id);
    fetchData();
  };

  if (loading) return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <CircularProgress thickness={5} size={56} />
      <Typography sx={{ mt: 2, fontWeight: 800, color: '#999' }}>LOADING TELEGRAM CRM...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 950, color: '#001a2e', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy color="primary" /> Smart Telegram CRM
          </Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            Select users → Message them directly. No bulk spam.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<LocalOffer />} onClick={() => setOpenTag(true)} sx={{ borderRadius: 6, fontWeight: 800 }}>
            New Tag
          </Button>
          <Button variant="contained" startIcon={<Send />} onClick={() => setOpenCampaign(true)}
            sx={{ borderRadius: 6, fontWeight: 800, background: 'linear-gradient(135deg, #001a2e, #007ea7)' }}>
            Tag Campaign
          </Button>
        </Box>
      </Box>

      {/* ── KPI Row ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'SUBSCRIBERS', val: users.length, color: '#e3f2fd', icon: <Person sx={{ color: '#0288d1' }} /> },
          { label: 'CAMPAIGNS', val: campaigns.length, color: '#e8f5e9', icon: <Rocket sx={{ color: '#388e3c' }} /> },
          { label: 'BOOKED APPTS', val: appointments.filter(a => a.status === 'booked').length, color: '#fff3e0', icon: <EventNote sx={{ color: '#f57c00' }} /> },
          { label: 'MSGS DELIVERED', val: logs.length || users.length * 2, color: '#f3e5f5', icon: <CheckCircle sx={{ color: '#7b1fa2' }} /> }
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{ borderRadius: 4, p: 2, bgcolor: s.color, boxShadow: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {s.icon}
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 900, color: '#666', fontSize: '0.62rem', lineHeight: 1 }}>{s.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 950, color: '#001a2e', lineHeight: 1.1 }}>{s.val}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Search Panel ── */}
      <Card sx={{ borderRadius: 4, mb: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e8f4f8' }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonSearch color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Search & Select Users</Typography>
            {filteredUsers.length < users.length && (
              <Chip size="small" color="primary" label={`${filteredUsers.length} of ${users.length}`} sx={{ fontWeight: 800 }} />
            )}
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small"
                placeholder="Name, @username, or chat ID..."
                value={searchName} onChange={e => setSearchName(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#bbb' }} /></InputAdornment>,
                  endAdornment: searchName
                    ? <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchName('')}><Clear fontSize="small" /></IconButton></InputAdornment>
                    : null
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Tag / Group</InputLabel>
                <Select value={filterTag} onChange={e => setFilterTag(e.target.value)} label="Filter by Tag / Group" sx={{ borderRadius: 3 }}>
                  <MenuItem value="">All Tags</MenuItem>
                  {tags.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Category</InputLabel>
                <Select value={filterSource} onChange={e => setFilterSource(e.target.value)} label="Filter by Category" sx={{ borderRadius: 3 }}>
                  <MenuItem value="">All Sources</MenuItem>
                  {SOURCE_CATEGORIES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" startIcon={<Clear />}
                onClick={() => { setSearchName(''); setFilterTag(''); setFilterSource(''); }}
                sx={{ borderRadius: 3, fontWeight: 800, height: 40 }} disabled={!isFiltered}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>

        {/* ── Users Table with Checkboxes ── */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chat color="primary" /> CRM Users
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button size="small" startIcon={<SelectAll />} variant="outlined" sx={{ borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}
                    onClick={selectAllFiltered}>
                    Select All ({filteredUsers.length})
                  </Button>
                  {selectedCount > 0 && (
                    <Button size="small" startIcon={<Deselect />} onClick={clearSelection}
                      sx={{ borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>
                      Clear ({selectedCount})
                    </Button>
                  )}
                </Box>
              </Box>

              {/* ── Selected Banner ── */}
              {selectedCount > 0 && (
                <Box sx={{
                  mb: 2, p: 2, borderRadius: 3,
                  background: 'linear-gradient(135deg, #001a2e 0%, #007ea7 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2
                }}>
                  <Box>
                    <Typography sx={{ fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rocket sx={{ color: '#00e5ff' }} />
                      {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Ready to receive a personalised direct message.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={() => setOpenSend(true)}
                    sx={{
                      borderRadius: 6, fontWeight: 900, bgcolor: '#00e5ff', color: '#001a2e',
                      '&:hover': { bgcolor: '#00b9d8' }, boxShadow: '0 4px 16px rgba(0,229,255,0.35)'
                    }}>
                    Send Message to {selectedCount}
                  </Button>
                </Box>
              )}

              <TableContainer sx={{ maxHeight: 480 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" sx={{ bgcolor: '#fafafa' }}>
                        <Checkbox
                          indeterminate={selectedCount > 0 && !allFilteredSelected}
                          checked={allFilteredSelected}
                          onChange={allFilteredSelected ? clearSelection : selectAllFiltered}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 900, bgcolor: '#fafafa' }}>Name / Chat ID</TableCell>
                      <TableCell sx={{ fontWeight: 900, bgcolor: '#fafafa' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 900, bgcolor: '#fafafa' }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: 900, bgcolor: '#fafafa' }}>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#bbb' }}>
                          No users match your filter.
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.map(u => {
                      const isSelected = selectedIds.has(u.chat_id);
                      return (
                        <TableRow key={u.id} hover selected={isSelected}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: isSelected ? 'rgba(0,185,216,0.06)' : 'inherit',
                            '&:hover': { bgcolor: isSelected ? 'rgba(0,185,216,0.10)' : '#f9f9f9' },
                            transition: '0.15s'
                          }}
                          onClick={() => toggleOne(u.chat_id)}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} size="small"
                              sx={{ color: '#00b9d8', '&.Mui-checked': { color: '#00b9d8' } }} />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.87rem' }}>{u.name || `@${u.username}`}</Typography>
                            <Typography variant="caption" sx={{ color: '#aaa' }}>ID: {u.chat_id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={u.source || 'Bot'} variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                              {u.tags?.map(t => (
                                <Chip key={t.id} size="small" label={t.name}
                                  sx={{ bgcolor: '#e0f7fa', color: '#007ea7', fontWeight: 800, fontSize: '0.68rem', height: 18 }} />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>
                            {new Date(u.join_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right Column ── */}
        <Grid item xs={12} lg={4}>
          {/* Appointments */}
          <Card sx={{ borderRadius: 4, mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventNote color="warning" /> Appointments
              </Typography>
              <Box sx={{ maxHeight: 280, overflowY: 'auto' }}>
                {appointments.length === 0
                  ? <Typography color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>No appointments booked via Telegram.</Typography>
                  : appointments.map(app => (
                    <Box key={app.id} 
                      onClick={() => handleOpenAppt(app)}
                      sx={{ 
                        p: 1.5, border: '1px solid #eee', borderRadius: 2, mb: 1, 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f0faff', borderColor: '#00b9d8' },
                        transition: '0.2s'
                      }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.87rem' }}>
                          {app.user_info?.name || app.user_info?.chat_id}
                        </Typography>
                        <Chip size="small" label={app.status?.replace('_', ' ')}
                          color={app.status === 'confirmed' ? 'success' : app.status === 'pending_payment' ? 'warning' : 'default'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#007ea7', fontWeight: 700 }}>
                        🩺 {app.service_name} • 📅 {new Date(app.appointment_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </Typography>
                    </Box>
                  ))
                }
              </Box>
            </CardContent>
          </Card>

          {/* Live Bot Logs */}
          <Card sx={{ borderRadius: 4, bgcolor: '#001a2e' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#00b9d8' }}>
                <History /> Live Bot Logs
              </Typography>
              <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                {logs.length === 0
                  ? <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    No messages sent yet.
                  </Typography>
                  : logs.slice(0, 50).map(log => (
                    <Box key={log.id} sx={{ p: 1.5, borderLeft: '3px solid #00b9d8', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#00e5ff', textTransform: 'uppercase' }}>
                          {log.message_type}
                        </Typography>
                        <Chip size="small" label={log.status}
                          sx={{ height: 18, fontSize: '0.6rem', bgcolor: log.status === 'sent' ? 'rgba(0,255,120,0.2)' : 'rgba(255,80,80,0.2)', color: '#fff' }} />
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.85, fontStyle: 'italic', color: '#fff', fontSize: '0.78rem', mb: 0.5 }}>
                        "{log.message_content?.substring(0, 65)}{(log.message_content?.length || 0) > 65 ? '…' : ''}"
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', textAlign: 'right', fontSize: '0.65rem' }}>
                        {new Date(log.sent_at).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Campaigns Section ── */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>🎯 Smart Targeted Campaigns</Typography>
              {campaigns.length === 0
                ? <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>No campaigns yet.</Typography>
                : <Grid container spacing={2}>
                  {campaigns.map(camp => (
                    <Grid item xs={12} md={4} key={camp.id}>
                      <Card variant="outlined" sx={{ borderRadius: 3, p: 2, position: 'relative', overflow: 'visible' }}>
                        {camp.status === 'Sent' && (
                          <Box sx={{ position: 'absolute', top: -8, right: 12, bgcolor: '#4caf50', color: '#fff', borderRadius: 4, px: 1, py: 0.2, fontSize: '0.65rem', fontWeight: 900 }}>
                            ✓ SENT
                          </Box>
                        )}
                        <Typography sx={{ fontWeight: 800, mb: 1 }}>{camp.title}</Typography>
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TARGETED TAGS:</Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {camp.target_tags?.length > 0
                              ? camp.target_tags.map(t => <Chip key={t.id} size="small" label={t.name} sx={{ mr: 0.5, mb: 0.5 }} />)
                              : <Chip size="small" label="All Subscribers" color="primary" variant="outlined" />
                            }
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.8rem', height: 38, overflow: 'hidden', mb: 1.5 }}>
                          "{camp.message}"
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#555' }}>{camp.total_recipients} delivered</Typography>
                          <IconButton size="small" onClick={() => handleDelete('telegramCampaigns', camp.id)}>
                            <Delete fontSize="small" color="error" />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── DIALOG: Direct Send to Selected ── */}
      <Dialog open={openSend} onClose={() => setOpenSend(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Send sx={{ color: '#007ea7' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Direct Message — {selectedCount} User{selectedCount !== 1 ? 's' : ''}</Typography>
              <Typography variant="caption" color="text.secondary">Each receives a personalised copy of this message.</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Recipient chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 2 }}>
            {users.filter(u => selectedIds.has(u.chat_id)).map(u => (
              <Chip key={u.chat_id} size="small"
                label={u.name || `@${u.username}` || u.chat_id}
                onDelete={() => toggleOne(u.chat_id)}
                sx={{ fontWeight: 700, bgcolor: '#e0f7fa' }} />
            ))}
          </Box>

          {/* Text message */}
          <TextField
            fullWidth multiline rows={4}
            label="Message (optional if sending media)"
            placeholder={`Hi {{name}} 👋\n\nHere is a document from Medico.`}
            value={directMsg}
            onChange={e => setDirectMsg(e.target.value)}
            helperText="{{name}} is replaced with each user's real name."
          />

          {/* Media Upload Area */}
          <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, border: '2px dashed #b2dfdb', bgcolor: '#e0f7fa20' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#007ea7', display: 'block', mb: 1 }}>
              📎 ATTACH MEDICAL FILES (images, audio, video, PDF, etc.)
            </Typography>
            <Button variant="outlined" component="label" size="small"
              sx={{ borderRadius: 6, fontWeight: 800, mb: 1.5 }}>
              + Add Files
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={e => {
                  const newFiles = Array.from(e.target.files);
                  setAttachedFiles(prev => [...prev, ...newFiles]);
                  e.target.value = '';
                }}
              />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {attachedFiles.map((f, i) => {
                const isImage = f.type.startsWith('image');
                const isVideo = f.type.startsWith('video');
                const isAudio = f.type.startsWith('audio');
                const icon = isImage ? '🖼️' : isVideo ? '🎬' : isAudio ? '🎵' : '📄';
                return (
                  <Chip key={i} size="small"
                    label={`${icon} ${f.name.length > 20 ? f.name.substring(0, 20) + '…' : f.name}`}
                    onDelete={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    sx={{ fontWeight: 700, bgcolor: '#fff', border: '1px solid #b2dfdb' }}
                  />
                );
              })}
              {attachedFiles.length === 0 && (
                <Typography variant="caption" sx={{ color: '#aaa', fontStyle: 'italic' }}>
                  No files selected. Supports: images, videos, audio, PDFs, documents.
                </Typography>
              )}
            </Box>
          </Box>

          {sending && <LinearProgress sx={{ mt: 2, borderRadius: 4 }} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setOpenSend(false); setAttachedFiles([]); }} disabled={sending}>Cancel</Button>
          <Button onClick={handleDirectSend}
            variant="contained"
            disabled={(!directMsg.trim() && attachedFiles.length === 0) || sending}
            startIcon={<Send />}
            sx={{ borderRadius: 6, fontWeight: 900, background: 'linear-gradient(135deg, #001a2e, #007ea7)' }}>
            {sending ? 'Sending…' : `Send to ${selectedCount} User${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DIALOG: New Tag ── */}
      <Dialog open={openTag} onClose={() => setOpenTag(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>🏷️ Create Tag / Group</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Tag name (e.g. vip, inactive, interested)"
            fullWidth value={tagForm.name} onChange={e => setTagForm({ name: e.target.value })}
            helperText="Tags power smart targeting & filtering." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenTag(false)}>Cancel</Button>
          <Button onClick={handleCreateTag} variant="contained" sx={{ borderRadius: 6, fontWeight: 800 }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* ── DIALOG: Tag Campaign ── */}
      <Dialog open={openCampaign} onClose={() => setOpenCampaign(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>🚀 Targeted Tag Campaign</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField label="Campaign Name" fullWidth value={campaignForm.title}
              onChange={e => setCampaignForm({ ...campaignForm, title: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Target Tags (leave empty = All users)</InputLabel>
              <Select multiple value={campaignForm.targetTags}
                onChange={e => setCampaignForm({ ...campaignForm, targetTags: e.target.value })}
                label="Target Tags (leave empty = All users)"
                renderValue={sel => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {sel.map(v => <Chip key={v} size="small" label={tags.find(t => t.id === v)?.name} />)}
                  </Box>
                )}>
                {tags.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Message" fullWidth multiline rows={5}
              helperText="Use {{name}} for personalisation."
              value={campaignForm.message}
              onChange={e => setCampaignForm({ ...campaignForm, message: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCampaign(false)}>Cancel</Button>
          <Button onClick={handleCreateCampaign} variant="contained"
            sx={{ borderRadius: 6, fontWeight: 900, background: 'linear-gradient(135deg, #001a2e, #007ea7)' }}>
            🚀 Send Campaign
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DIALOG: Appointment Details ── */}
      <Dialog open={openAppointment} onClose={() => setOpenAppointment(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        <DialogTitle sx={{ bgcolor: '#001a2e', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventNote sx={{ color: '#00e5ff' }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Appointment Manager</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenAppointment(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}><Clear /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedAppt && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: '#64748b' }}>Patient Information</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedAppt.user_info?.name || 'Anonymous'}</Typography>
                  <Typography variant="body2" color="text.secondary">📱 Phone: <b>{selectedAppt.user_info?.phone || 'Not provided'}</b></Typography>
                  <Typography variant="body2" color="text.secondary">🆔 Telegram: <b>@{selectedAppt.user_info?.username || selectedAppt.user_info?.chat_id}</b></Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Current Status</InputLabel>
                  <Select label="Current Status" value={apptForm.status} onChange={e => setApptForm({...apptForm, status: e.target.value})}>
                    <MenuItem value="pending_payment">Pending Payment</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Payment Status</InputLabel>
                  <Select label="Payment Status" value={apptForm.payment_status} onChange={e => setApptForm({...apptForm, payment_status: e.target.value})}>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="pending_verification">Pending Verification</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Re-Schedule (Date & Time)" type="datetime-local" margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={apptForm.appointment_date?.substring(0, 16) || ''}
                  onChange={e => setApptForm({...apptForm, appointment_date: e.target.value})} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Assigned Doctor / Department" margin="dense"
                  value={apptForm.doctor_assigned} onChange={e => setApptForm({...apptForm, doctor_assigned: e.target.value})} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Internal Clinical Notes" margin="dense"
                  placeholder="Only visible to clinic staff..."
                  value={apptForm.internal_notes} onChange={e => setApptForm({...apptForm, internal_notes: e.target.value})} />
              </Grid>

              {selectedAppt.notes && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fff9c4', border: '1px solid #fff59d' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#f57f17' }}>Patient Note from Telegram:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{selectedAppt.notes}"</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
             <Button variant="outlined" size="small" startIcon={<CheckCircle />} onClick={() => handleSendNotification('confirmation')} sx={{ borderRadius: 6, fontWeight: 800, borderColor: '#00b9d8', color: '#00b9d8' }}>Confirm Msg</Button>
             <Button variant="outlined" size="small" startIcon={<Rocket />} onClick={() => handleSendNotification('reminder')} sx={{ borderRadius: 6, fontWeight: 800 }}>Send Reminder</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setOpenAppointment(false)} sx={{ fontWeight: 700 }}>Discard</Button>
            <Button variant="contained" onClick={handleUpdateAppointment} 
              sx={{ borderRadius: 6, fontWeight: 900, bgcolor: '#001a2e', '&:hover': { bgcolor: '#003e5b' } }}>
              Save & Update Schedule
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TelegramCRM;
