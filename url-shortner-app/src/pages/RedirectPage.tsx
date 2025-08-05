import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { Log } from '@your-org/logging-middleware';

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { urlMappings, trackClick } = useUrlContext();

  useEffect(() => {
    if (!shortCode) {
      navigate('/not-found');
      return;
    }

    const mapping = urlMappings.find(m => m.shortCode === shortCode);

    if (mapping) {
      if (Date.now() > mapping.expiryDate) {
        Log('frontend', 'error', 'route', `Attempted to access expired shortcode: ${shortCode}`);
        navigate('/not-found?reason=expired');
        return;
      }

      const updatedMapping = trackClick(shortCode, {
        source: document.referrer || 'Direct',
        location: 'N/A' // Geolocation would be implemented here
      });
      
      if(updatedMapping) {
        Log('frontend', 'info', 'route', `Redirecting shortcode '${shortCode}' to '${updatedMapping.originalUrl}'`);
        window.location.replace(updatedMapping.originalUrl);
      } else {
        Log('frontend', 'fatal', 'route', `Logic error: trackClick returned undefined for valid shortcode ${shortCode}`);
      }

    } else {
      Log('frontend', 'error', 'route', `Shortcode not found: ${shortCode}`);
      navigate('/not-found');
    }
  }, [shortCode, urlMappings, trackClick, navigate]);

  return <Typography>Redirecting...</Typography>; 
};

export default RedirectPage;