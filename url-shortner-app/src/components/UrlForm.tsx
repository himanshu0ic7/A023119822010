import { useState } from 'react';
import { Box, Button, TextField, Stack, Alert, List, ListItem, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useUrlContext } from '../context/UrlContext';
import { createShortUrl } from '../services/urlService';
import { UrlMapping } from '../types';
import { Log } from '@your-org/logging-middleware';

interface InputRow {
  id: number;
  longUrl: string;
  customCode: string;
  validity: string;
}

const UrlForm = () => {
  const { urlMappings, addUrlMapping } = useUrlContext();
  const [rows, setRows] = useState<InputRow[]>([{ id: 1, longUrl: '', customCode: '', validity: '' }]);
  const [error, setError] = useState<string>('');
  const [successResults, setSuccessResults] = useState<UrlMapping[]>([]);

  const handleAddRow = () => {
    if (rows.length < 5) {
      setRows([...rows, { id: Date.now(), longUrl: '', customCode: '', validity: '' }]);
      Log('frontend', 'info', 'component', 'User added a new URL input row.');
    }
  };

  const handleInputChange = (id: number, field: keyof Omit<InputRow, 'id'>, value: string) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessResults([]);
    const newResults: UrlMapping[] = [];

    rows.forEach(row => {
      if (!row.longUrl) return; 
      if (!validateUrl(row.longUrl)) {
        const errorMsg = `Invalid URL format for: ${row.longUrl}`;
        setError(prev => (prev ? `${prev}\n${errorMsg}` : errorMsg));
        Log('frontend', 'warn', 'component', errorMsg);
        return;
      }
      
      const validityNum = row.validity ? parseInt(row.validity, 10) : undefined;
      if (row.validity && (isNaN(validityNum) || validityNum <= 0)) {
        const errorMsg = `Validity for ${row.longUrl} must be a positive number.`;
        setError(prev => (prev ? `${prev}\n${errorMsg}` : errorMsg));
        Log('frontend', 'warn', 'component', errorMsg);
        return;
      }

      const result = createShortUrl(
        row.longUrl,
        urlMappings,
        row.customCode || undefined,
        validityNum
      );
      
      if ('error' in result) {
        setError(prev => (prev ? `${prev}\n${result.error}` : result.error));
      } else {
        addUrlMapping(result);
        newResults.push(result);
      }
    });
    setSuccessResults(newResults);
    if(newResults.length > 0) {
        Log('frontend', 'info', 'component', `Successfully created ${newResults.length} short URLs.`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={2}>
        {rows.map((row, index) => (
          <Stack direction="row" spacing={2} key={row.id}>
            <TextField
              label={`Original URL ${index + 1}`}
              variant="outlined"
              fullWidth
              value={row.longUrl}
              onChange={(e) => handleInputChange(row.id, 'longUrl', e.target.value)}
              required
            />
            <TextField
              label="Custom Code (Opt.)"
              variant="outlined"
              value={row.customCode}
              onChange={(e) => handleInputChange(row.id, 'customCode', e.target.value)}
            />
            <TextField
              label="Validity (Mins, Opt.)"
              variant="outlined"
              type="number"
              value={row.validity}
              onChange={(e) => handleInputChange(row.id, 'validity', e.target.value)}
            />
          </Stack>
        ))}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={handleAddRow} disabled={rows.length >= 5}>
          Add another URL
        </Button>
        <Button type="submit" variant="contained" size="large">
          Shorten
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successResults.length > 0 && (
        <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">Results:</Typography>
            <List>
                {successResults.map(res => (
                    <ListItem key={res.shortCode}>
                        <Typography variant="body2" sx={{overflowWrap: 'break-word', mr: 2}}>
                            {res.originalUrl} →{' '}
                            <MuiLink href={`/${res.shortCode}`} target="_blank" rel="noopener">
                                {window.location.origin}/{res.shortCode}
                            </MuiLink>
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>
      )}
    </Box>
  );
};

export default UrlForm;