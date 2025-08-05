import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography sx={{ mt: 2 }}>
        The link you followed may be broken, expired, or the page may have been removed.
      </Typography>
      <Link to="/">Go back to the homepage</Link>
    </Box>
  );
};

export default NotFoundPage;