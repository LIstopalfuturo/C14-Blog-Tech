import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateQuantity } from '../features/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          <List>
            {items.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          ${item.price}/{item.unit} × {item.quantity} {item.unit}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Typography component="span" sx={{ mx: 1 }}>
                            {item.quantity}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </Box>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Typography variant="h6" gutterBottom>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
