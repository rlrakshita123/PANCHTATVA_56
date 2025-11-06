import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';



export const handleSearch = async (req, res) => {
  try {
     const mapToken = process.env.MAPBOX_TOKEN; // must be Mapbox token
  const geocodingClient = mbxGeocoding({ accessToken: mapToken });

    const { medicine, city, pincode } = req.body;
   
    if (!medicine || !city || !pincode) {
      return res.status(400).json({ error: "Provide medicine, city and pincode" });
    }

    const address = `${pincode}, ${city}`;

    const geoResponse = await geocodingClient.forwardGeocode({
      query: address,
      limit: 1
    }).send();

    if (!geoResponse.body.features || geoResponse.body.features.length === 0) {
      return res.status(400).json({ error: "Could not find location" });
    }

    const coordinates = geoResponse.body.features[0].geometry.coordinates;
    const location = { lng: coordinates[0], lat: coordinates[1] };
    console.log(`Lat: ${location.lat}, Lng: ${location.lng}`);

    res.json({
      medicine,
      city,
      pincode,
      location
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
