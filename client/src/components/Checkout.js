import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
} from '@mui/material';
import { clearCart } from '../features/cartSlice';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const handlePlaceOrder = async () => {
    try {
      // Here we would typically make an API call to create the order
      const order = {
        items,
        total,
        shippingAddress: shippingData,
      };
      
      // Clear the cart after successful order
      dispatch(clearCart());
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const renderShippingForm = () => (
    <form onSubmit={handleShippingSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Street Address"
            value={shippingData.street}
            onChange={(e) =>
              setShippingData({ ...shippingData, street: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingData.city}
            onChange={(e) =>
              setShippingData({ ...shippingData, city: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingData.state}
            onChange={(e) =>
              setShippingData({ ...shippingData, state: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            value={shippingData.zipCode}
            onChange={(e) =>
              setShippingData({ ...shippingData, zipCode: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Country"
            value={shippingData.country}
            onChange={(e) =>
              setShippingData({ ...shippingData, country: e.target.value })
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={() => navigate('/cart')} sx={{ mr: 1 }}>
          Back to Cart
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Card Number"
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField required fullWidth label="Expiry Date" placeholder="MM/YY" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField required fullWidth label="CVV" placeholder="123" />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </form>
  );

  const renderReviewOrder = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {items.map((item) => (
        <Box key={item._id} sx={{ mb: 2 }}>
          <Typography>
            {item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ${total.toFixed(2)}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderReviewOrder();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default Checkout;
