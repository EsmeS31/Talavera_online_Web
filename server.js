const express = require('express');
const path = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;

// This product data is prepared on the server and passed into both page templates.
const products = [
  { id: 'flor-azul', name: 'Flor Azul Plate', category: 'tableware', categoryName: 'Tableware', placeholder: 'Plate image', price: 42, color: 'blue-flower', description: 'A hand-painted floral plate for everyday meals or display.', featured: true },
  { id: 'sol-planter', name: 'Sol Planter', category: 'planters', categoryName: 'Planters', placeholder: 'Planter image', price: 58, color: 'sun-flower', description: 'A sunny home for your favorite plants, painted by hand.', featured: true },
  { id: 'jardin-bowl', name: 'Jardín Serving Bowl', category: 'serveware', categoryName: 'Serveware', placeholder: 'Bowl image', price: 76, color: 'red-flower', description: 'A generous serving bowl with a lively garden motif.', featured: true },
  { id: 'luna-mug', name: 'Luna Coffee Mug', category: 'tableware', categoryName: 'Tableware', placeholder: 'Mug image', price: 34, color: 'blue-flower', description: 'A cheerful mug for slow mornings and warm drinks.', featured: false },
  { id: 'nopal-vase', name: 'Nopal Bud Vase', category: 'decor', categoryName: 'Decor', placeholder: 'Vase image', price: 49, color: 'sun-flower', description: 'A small sculptural vase inspired by the shapes of Puebla.', featured: false },
  { id: 'fiesta-platter', name: 'Fiesta Serving Platter', category: 'serveware', categoryName: 'Serveware', placeholder: 'Platter image', price: 89, color: 'red-flower', description: 'A bright centerpiece for sharing food with family.', featured: false }
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.get('/', (req, res) => {
  res.render('shop', { products, featured: products.filter((product) => product.featured) });
});

app.get('/cart', (req, res) => {
  res.render('cart', { products });
});

app.get('/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) return res.status(404).render('not-found', { title: 'Product not found' });
  res.render('product', { product });
});

app.get('/api/products', (_req, res) => res.json(products));

app.listen(PORT, () => {
  console.log(`Casa Talavera is running at http://localhost:${PORT}`);
});
