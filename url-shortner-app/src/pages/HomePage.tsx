import { Typography, Container, Paper } from '@mui/material';
import UrlForm from '../components/UrlForm';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Shorten Your URLs
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Enter up to 5 URLs to shorten them concurrently.
        </Typography>
        <UrlForm />
      </Paper>
    </Container>
  );
};

export default HomePage;