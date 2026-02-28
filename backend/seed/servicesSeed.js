const dotenv = require('dotenv');
dotenv.config();

const connectDb = require('../config/db');
const Service = require('../models/Service');

const run = async () => {
  await connectDb();

  await Service.deleteMany({});

  const services = [
    {
      name: 'City Hospital',
      city: 'Pune',
      category: 'hospital',
      rating: 4.5,
      location: { type: 'Point', coordinates: [73.8567, 18.5204] }
    },
    {
      name: 'Main ATM',
      city: 'Pune',
      category: 'ATM',
      rating: 4.0,
      location: { type: 'Point', coordinates: [73.8580, 18.5220] }
    },
    {
      name: 'Local Shop',
      city: 'Pune',
      category: 'shop',
      rating: 4.2,
      location: { type: 'Point', coordinates: [73.8542, 18.5190] }
    },
    {
      name: 'Community Service Point',
      city: 'Pune',
      category: 'others',
      rating: 3.8,
      location: { type: 'Point', coordinates: [73.8602, 18.5182] }
    }
  ];

  await Service.insertMany(services);

  console.log('Seeded services:', services.length);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
