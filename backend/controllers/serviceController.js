const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Service = require('../models/Service');

const normalizeCategory = (value) => {
  if (value === undefined || value === null) return undefined;
  const v = String(value).trim();
  if (!v) return undefined;
  const lower = v.toLowerCase();
  if (lower === 'hospital') return 'hospital';
  if (lower === 'atm') return 'ATM';
  if (lower === 'shop') return 'shop';
  if (lower === 'others') return 'others';
  return v;
};

const listServices = async (req, res, next) => {
  try {
    const category = normalizeCategory(req.query.category);
    const filter = {};
    if (category) filter.category = category;

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const listNearby = async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radius);

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radiusKm)) {
      return res.status(400).json({ message: 'lat, lng, radius are required and must be numbers' });
    }

    const maxDistanceMeters = radiusKm * 1000;

    const results = await Service.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distanceMeters',
          spherical: true,
          maxDistance: maxDistanceMeters
        }
      },
      {
        $addFields: {
          distanceKm: { $divide: ['$distanceMeters', 1000] }
        }
      },
      {
        $project: {
          name: 1,
          city: 1,
          category: 1,
          rating: 1,
          location: 1,
          createdAt: 1,
          distanceKm: 1
        }
      },
      { $sort: { distanceKm: 1 } }
    ]);

    res.json(results);
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { name, category, rating, lat, lng, city } = req.body;

    const service = await Service.create({
      name,
      city: city ? String(city).trim() : undefined,
      category: normalizeCategory(category),
      rating: rating === '' || rating === null || rating === undefined ? undefined : Number(rating),
      location: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      }
    });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const { name, category, rating, lat, lng } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = normalizeCategory(category);
    if (rating !== undefined) update.rating = rating === '' || rating === null ? undefined : Number(rating);
    if (city !== undefined) update.city = city ? String(city).trim() : undefined;

    if (lat !== undefined && lng !== undefined) {
      update.location = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
    }

    const service = await Service.findByIdAndUpdate(id, update, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

const adminListServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listServices,
  listNearby,
  createService,
  updateService,
  deleteService,
  adminListServices
};
