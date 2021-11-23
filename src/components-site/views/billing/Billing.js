import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const billingHistory = [
  {
    date: 'May 1, 2022',
    amount: '20,000 KRW',
    plan: 'Basic plan'
  },
  {
    date: 'May 1, 2022',
    amount: '20,000 KRW',
    plan: 'Basic plan'
  },
  {
    date: 'May 1, 2022',
    amount: '20,000 KRW',
    plan: 'Basic plan'
  },
  {
    date: 'May 1, 2022',
    amount: '20,000 KRW',
    plan: 'Basic plan'
  }
]

const Billing = () => {
  return (
    <Box sx={{ mt: 10, ml: 4, width: '100%' }}>
      <Typography variant="h5" color="#fff">Current plan</Typography>
      
      <Typography variant="h6" color="#d3d9de" fontWeight="bold" sx={{ mt: 2 }}>Basic plan</Typography>
      <Typography variant="h6" color="#d3d9de" sx={{ mt: 1 }}>20,000 KRW</Typography>

      <Typography variant="h6" color="#d3d9de" sx={{ mt: 1 }}>Your plan renews on June 1 2022</Typography>
      
      <Box sx={{ mt: 2, display: 'flex' }}>
        <Button variant="contained" sx={{ mr: 2 }}>Change plan</Button>
        <Button variant="contained" color="secondary">Cancel plan</Button>
      </Box>
      
      <Typography variant="h5" color="#fff" sx={{ mt: 4, mb: 2 }}>Payment method</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
        <i class="fab fa-cc-visa fa-2x"></i>
        <Typography variant="h6" sx={{ ml: 2, color: '#d3d9de' }}>************</Typography>
        <Typography variant="h6" sx={{ ml: 1, color: '#d3d9de' }}>4323</Typography>
        <Typography variant="h6" sx={{ ml: 10, mr: 2, color: '#d3d9de' }}>Expires on 2025</Typography>
        <CloseIcon />
      </Box>
      
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Add payment method</Typography>

      <Typography variant="h5" color="#fff" sx={{ mt: 3 }}>Billing history</Typography>

      <Box sx={{ mt: 2 }}>
        {billingHistory.map(history => 
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Typography variant="h6" sx={{ mr: 10, color: '#d3d9de' }}>{history.date}</Typography>
            <Typography variant="h6" sx={{ mr: 10, color: '#d3d9de' }}>{history.amount}</Typography>
            <Typography variant="h6" sx={{ color: '#d3d9de' }}>{history.plan}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
 
export default Billing;