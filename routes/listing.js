const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User");


//fix error middleware
router.get('/', (req, res) => {
    // Xử lý logic
});


// Configuration Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({storage})

// Create Listing 
router.post("/create", upload.array("listingPhotos"), async(req,res) => {
    try{
        // Take infor from form
        const {creator, category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount, bedCount, bathroomCount, amenities, title, description, highlight, highlightDesc, price } = req.body;

        const listingPhotos = req.files
        if (!listingPhotos) {
            return res.status(400).send("No file uploaded.")
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path)

        const newListing = new Listing({
            creator,
            category,
            type,
            streetAddress, 
            aptSuite, 
            city, 
            province, 
            country, 
            guestCount, 
            bedroomCount, 
            bedCount, 
            bathroomCount, 
            amenities, 
            listingPhotoPaths,
            title, 
            description, 
            highlight, 
            highlightDesc, 
            price,
        })

        await newListing.save()

        res.status(200).json(newListing)

    } catch (err) {
        res.status(409).json({message: "Fail to create Listing", error: err.message})
        console.log(err)
    }
});

// Get listing 
router.get("/", async(req,res) => {
    const qCategory = req.query.category

    try{
        let listings 
        if (qCategory) {
            listings = await Listing.find({ category: qCategory }).populate("creator")
        } else{
            listings = await Listing.find()
        }

        res.status(200).json(listings)

    } catch (err) {
        res.status(404).json({message: "Fail to fetch Listing", error: err.message})
        console.log(err)
    }
})
module.exports = router;