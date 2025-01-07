import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Dialog,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    description,
    price,
    unit,
    image,
    minimumOrder,
    averageRating,
    numReviews,
    bulkPricing,
    stock,
  } = product;

  const [open, setOpen] = useState(false);
  const [showBulkPricing, setShowBulkPricing] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: minimumOrder }));
  };

  const handleReviewClick = () => {
    setOpen(true);
  };

  const renderBulkPricing = () => {
    if (!bulkPricing || bulkPricing.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Bulk Pricing:
        </Typography>
        {bulkPricing
          .sort((a, b) => a.minQuantity - b.minQuantity)
          .map((tier, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {tier.minQuantity}+ {unit}: ${tier.price}/{unit}
            </Typography>
          ))}
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Button
              size="small"
              onClick={handleReviewClick}
              sx={{ ml: 1 }}
            >
              ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" color="primary">
                ${price}/{unit}
              </Typography>
              {bulkPricing && bulkPricing.length > 0 && (
                <Button
                  size="small"
                  startIcon={<InfoIcon />}
                  onClick={() => setShowBulkPricing(!showBulkPricing)}
                >
                  Bulk Pricing Available
                </Button>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Min. Order: {minimumOrder} {unit}
            </Typography>
          </Box>
          
          <Collapse in={showBulkPricing}>
            {renderBulkPricing()}
          </Collapse>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color={stock < 20 ? 'error.main' : 'success.main'}>
              {stock < 20 ? `Only ${stock} ${unit} left!` : 'In Stock'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {name} - Reviews
          </Typography>
          <ReviewList productId={_id} />
          <ReviewForm productId={_id} onReviewSubmitted={() => {
            // Refresh product data after new review
            // This would be handled by your data fetching logic
          }} />
        </Box>
      </Dialog>
    </>
  );
};

export default ProductCard;
