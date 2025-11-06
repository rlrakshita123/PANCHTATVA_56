const fs = require('fs');
const path = require('path');

// Path to your JSON dataset
const dataPath = path.join(__dirname, '../data/bangalore_medicine_dataset.json');
const medicines = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Helper: calculate distance between two lat/lon points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Controller function
exports.getMedicinesByName = (req, res) => {
    const userMedicine = req.params.name.toLowerCase();
    const userLat = parseFloat(req.query.lat); // ?lat=...
    const userLon = parseFloat(req.query.lon); // ?lon=...

    if (!userLat || !userLon) {
        return res.status(400).json({ error: "Please provide user latitude and longitude as query params" });
    }

    // Filter medicines and calculate distance
    const results = medicines
        .filter(med => med.medicine_name.toLowerCase() === userMedicine)
        .map(med => ({
            pharmacy_name: med.pharmacy_name,
            address: med.address,
            medicine_name: med.medicine_name,
            dosage: med.dosage,
            price: med.price,
            quantity: med.quantity,
            distance_km: calculateDistance(userLat, userLon, med.latitude, med.longitude).toFixed(2)
        }))
        .sort((a, b) => a.distance_km - b.distance_km) // nearest first
        .slice(0,5);

    res.json(results);
};
