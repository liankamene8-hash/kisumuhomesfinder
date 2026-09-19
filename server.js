const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================
   BASIC SETTINGS
========================================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* =========================================
   CREATE FOLDERS
========================================= */

const dataFolder = process.env.DATA_DIR || __dirname;

const databaseFolder = path.join(
    dataFolder,
    "database"
);

const uploadFolder = path.join(
    dataFolder,
    "uploads"
);


if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
}


if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}


/* =========================================
   SERVE WEBSITE FILES
========================================= */

app.use(
    express.static(__dirname)
);


/* =========================================
   SERVE UPLOADED IMAGES
========================================= */

app.use(
    "/uploads",
    express.static(uploadFolder)
);


/* =========================================
   DATABASE
========================================= */

const db = new sqlite3.Database(
    path.join(
        databaseFolder,
        "kisumuhomes.db"
    ),
    (error) => {

        if (error) {

            console.error(
                "Database error:",
                error.message
            );

        } else {

            console.log(
                "Connected to KisumuHomes database"
            );
        }
    }
);


/* =========================================
   CREATE TABLE
========================================= */

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS houses (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,

            location TEXT NOT NULL,

            type TEXT NOT NULL,

            price INTEGER NOT NULL,

            bedrooms INTEGER,

            bathrooms INTEGER,

            description TEXT,

            amenities TEXT,

            photos TEXT,

            ownerName TEXT,

            ownerPhone TEXT,

            whatsapp TEXT,

            ownerType TEXT,

            status TEXT DEFAULT 'Available',

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

});


/* =========================================
   IMAGE UPLOAD
========================================= */

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            uploadFolder
        );

    },

    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(file.originalname);

        const filename =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1000000
            ) +
            extension;

        cb(
            null,
            filename
        );
    }
});


const upload = multer({

    storage: storage,

    limits: {
        files: 6,
        fileSize: 5 * 1024 * 1024
    }

});


/* =========================================
   GET ALL HOUSES
========================================= */

app.get(
    "/api/houses",
    (req, res) => {

        db.all(
            `
            SELECT *
            FROM houses
            ORDER BY createdAt DESC
            `,
            [],
            (error, rows) => {

                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        error: "Failed to load houses"
                    });
                }


                const houses =
                    rows.map(house => {

                        return {

                            ...house,

                            amenities:
                                house.amenities
                                    ? JSON.parse(
                                        house.amenities
                                    )
                                    : [],

                            photos:
                                house.photos
                                    ? JSON.parse(
                                        house.photos
                                    )
                                    : []

                        };

                    });


                res.json(houses);

            }
        );

    }
);


/* =========================================
   GET ONE HOUSE
========================================= */

app.get(
    "/api/houses/:id",
    (req, res) => {

        const id =
            req.params.id;


        db.get(
            `
            SELECT *
            FROM houses
            WHERE id = ?
            `,
            [id],
            (error, house) => {

                if (error) {

                    return res.status(500).json({
                        error: "Database error"
                    });
                }


                if (!house) {

                    return res.status(404).json({
                        error: "House not found"
                    });
                }


                house.amenities =
                    house.amenities
                        ? JSON.parse(
                            house.amenities
                        )
                        : [];


                house.photos =
                    house.photos
                        ? JSON.parse(
                            house.photos
                        )
                        : [];


                res.json(house);

            }
        );

    }
);


/* =========================================
   POST NEW HOUSE
========================================= */

app.post(
    "/api/houses",
    upload.array(
        "photos",
        6
    ),
    (req, res) => {

        try {

            const {

                title,
                location,
                type,
                price,
                bedrooms,
                bathrooms,
                description,
                amenities,
                ownerName,
                ownerPhone,
                whatsapp,
                ownerType

            } = req.body;


            /* Validation */

            if (
                !title ||
                !location ||
                !type ||
                !price
            ) {

                return res.status(400).json({

                    error:
                        "Title, location, type and price are required."

                });

            }


            /* Photos */

            const photos =
                (req.files || [])
                    .map(file => {

                        return (
                            "/uploads/" +
                            file.filename
                        );

                    });


            /* Amenities */

            let amenitiesArray = [];

            if (amenities) {

                if (Array.isArray(amenities)) {

                    amenitiesArray =
                        amenities;

                } else {

                    try {

                        amenitiesArray =
                            JSON.parse(
                                amenities
                            );

                    } catch {

                        amenitiesArray =
                            [amenities];

                    }
                }
            }


            /* Insert */

            const sql = `

                INSERT INTO houses (

                    title,
                    location,
                    type,
                    price,
                    bedrooms,
                    bathrooms,
                    description,
                    amenities,
                    photos,
                    ownerName,
                    ownerPhone,
                    whatsapp,
                    ownerType

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            `;


            db.run(
                sql,

                [

                    title,

                    location,

                    type,

                    Number(price),

                    Number(bedrooms) || 0,

                    Number(bathrooms) || 0,

                    description || "",

                    JSON.stringify(
                        amenitiesArray
                    ),

                    JSON.stringify(
                        photos
                    ),

                    ownerName || "",

                    ownerPhone || "",

                    whatsapp || "",

                    ownerType || "Landlord"

                ],

                function (error) {

                    if (error) {

                        console.error(error);

                        return res.status(500).json({

                            error:
                                "Failed to save house."

                        });

                    }


                    res.status(201).json({

                        message:
                            "House published successfully.",

                        id:
                            this.lastID,

                        photos:
                            photos

                    });

                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({

                error:
                    "Something went wrong."

            });

        }

    }
);


/* =========================================
   DELETE HOUSE
========================================= */

app.delete(
    "/api/houses/:id",
    (req, res) => {

        const id =
            req.params.id;


        db.run(
            `
            DELETE FROM houses
            WHERE id = ?
            `,
            [id],
            function (error) {

                if (error) {

                    return res.status(500).json({

                        error:
                            "Failed to delete house."

                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({

                        error:
                            "House not found."

                    });

                }


                res.json({

                    message:
                        "House deleted successfully."

                });

            }
        );

    }
);


/* =========================================
   SERVER
========================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `KisumuHomes running at http://localhost:${PORT}`
        );

    }
);

async function loadDatabaseListings() {

    try {

        const response =
            await fetch("/api/houses");

        if (!response.ok) {

            throw new Error(
                "Failed to load houses"
            );
        }


        const houses =
            await response.json();


        /*
          Database houses first,
          demo houses afterwards.
        */

        allListings = [
            ...houses,
            ...demoListings
        ];


        displayListings(
            allListings
        );


    } catch (error) {

        console.error(error);

        /*
          If backend isn't running,
          show demo houses.
        */

        allListings = [
            ...demoListings
        ];

        displayListings(
            allListings
        );
    }
}