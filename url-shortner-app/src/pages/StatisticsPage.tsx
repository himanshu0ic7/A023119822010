import { useUrlContext } from '../context/UrlContext';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Link as MuiLink } from '@mui/material';

const StatisticsPage = () => {
  const { urlMappings } = useUrlContext();

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Statistics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Expires At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urlMappings.map((row) => (
              <TableRow key={row.shortCode}>
                <TableCell>
                    <MuiLink href={`/${row.shortCode}`} target="_blank" rel="noopener">
                        {window.location.origin}/{row.shortCode}
                    </MuiLink>
                </TableCell>
                <TableCell sx={{overflowWrap: 'break-word', maxWidth: '300px'}}>{row.originalUrl}</TableCell>
                <TableCell>{row.clickCount}</TableCell>
                <TableCell>{new Date(row.expiryDate).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StatisticsPage;