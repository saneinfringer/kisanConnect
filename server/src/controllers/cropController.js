const Crop = require('../models/Crop');

// Add a new crop
exports.addCrop = async (req, res) => {
  try {
    const { name, price, quantity, location, contactNumber } = req.body;

    // Validate required fields
    if (!name || price == null || quantity == null) {
      return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    // Include owner (if user authenticated)
    const ownerId = req.user ? req.user.id : null;

    const newCrop = new Crop({
      name,
      price,
      quantity,
      location,
      contactNumber,
      owner: ownerId, // ✅ properly attach farmer ID
    });

    await newCrop.save();

    res.status(201).json(newCrop);
  } catch (error) {
    console.error('Error adding crop:', error);
    res.status(400).json({ message: error.message });
  }
};


// Get all crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get crop by ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.status(200).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
