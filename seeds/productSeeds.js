const { Product } = require('../models');
const db = require('../config/connection');

const productData = [
  {
    name: 'Fresh Atlantic Salmon',
    description: 'Premium quality Atlantic salmon, perfect for sushi or grilling',
    price: 12.99,
    stock: 100,
    category: 'fish',
    image: '/images/salmon.jpg',
    unit: 'lb',
    minimumOrder: 10,
  },
  {
    name: 'Jumbo Shrimp',
    description: 'Large, succulent shrimp ideal for cocktails or grilling',
    price: 15.99,
    stock: 150,
    category: 'crustaceans',
    image: '/images/shrimp.jpg',
    unit: 'lb',
    minimumOrder: 5,
  },
  {
    name: 'Fresh Oysters',
    description: 'Fresh, briny oysters perfect for raw bars',
    price: 24.99,
    stock: 200,
    category: 'shellfish',
    image: '/images/oysters.jpg',
    unit: 'piece',
    minimumOrder: 24,
  },
];

db.once('open', async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(productData);
    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
