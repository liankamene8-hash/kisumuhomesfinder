// ================= MOBILE MENU =================

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("active");

}


// ================= SEARCH =================

function searchHouses() {

    const location =
        document.getElementById("location").value;

    const houseType =
        document.getElementById("houseType").value;

    const price =
        document.getElementById("price").value;


    if (!location && !houseType && !price) {

        alert("Please select a location, house type or price.");

        return;
    }


    let message = "Searching houses";

    if (location) {
        message += ` in ${location}`;
    }

    if (houseType) {
        message += ` | ${houseType}`;
    }

    if (price) {
        message += ` | ${price}`;
    }


    alert(message);

    document.getElementById("houses")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================= FAVORITE =================

function favoriteHouse(button) {

    if (button.innerHTML === "♡") {

        button.innerHTML = "♥";

        alert("House added to favorites.");

    } else {

        button.innerHTML = "♡";

    }

}


// ================= VIEW HOUSE =================

function viewHouse(houseName) {

    alert(
        "House selected:\n\n" +
        houseName +
        "\n\nThe full house details page will be added in Step 2."
    );

}


// ================= POST HOUSE =================

function postHouse() {
    window.location.href = "post-house.html";
}

/* =========================================
   KISUMUHOMES - FIND HOUSES
   STEP 4
========================================= */

let allListings = [];

const demoListings = [
    {
        id: "demo1",
        title: "Modern 2 Bedroom Apartment",
        location: "Mamboleo",
        type: "Apartment",
        price: 18000,
        bedrooms: 2,
        bathrooms: 2,
        description:
            "A clean and modern two bedroom apartment located in a secure neighborhood in Mamboleo.",
        amenities: ["Parking", "Water", "Security", "Electricity"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20City%20view.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-01"
    },
    {
        id: "demo2",
        title: "Affordable 1 Bedroom House",
        location: "Nyamasaria",
        type: "1 Bedroom",
        price: 10000,
        bedrooms: 1,
        bathrooms: 1,
        description:
            "Affordable one bedroom house in Nyamasaria with easy access to Nairobi Road.",
        amenities: ["Water", "Security", "Electricity"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Victoria%20as%20visible%20from%20Kisumu%20City.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-02"
    },
    {
        id: "demo3",
        title: "Luxury 3 Bedroom Home",
        location: "Milimani",
        type: "3 Bedroom",
        price: 45000,
        bedrooms: 3,
        bathrooms: 3,
        description:
            "Spacious luxury three bedroom home in the popular Milimani area.",
        amenities: ["Parking", "Water", "Security", "Garden", "Balcony"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20skyline.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-03"
    },
    {
        id: "demo4",
        title: "Clean Modern Bedsitter",
        location: "Kondele",
        type: "Bedsitter",
        price: 7500,
        bedrooms: 1,
        bathrooms: 1,
        description:
            "Clean and affordable bedsitter suitable for students and young professionals.",
        amenities: ["Water", "Security", "Electricity", "WiFi"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Dunga%20beach.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-04"
    },
    {
        id: "demo5",
        title: "Spacious 2 Bedroom House",
        location: "Manyatta",
        type: "2 Bedroom",
        price: 15000,
        bedrooms: 2,
        bathrooms: 1,
        description:
            "Spacious two bedroom house in Manyatta with good security and reliable water.",
        amenities: ["Water", "Security", "Parking"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20town%20hall.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-05"
    },
    {
        id: "demo6",
        title: "Large 4 Bedroom Family Home",
        location: "Lolwe",
        type: "4 Bedroom",
        price: 35000,
        bedrooms: 4,
        bathrooms: 3,
        description:
            "Large family home with spacious rooms, parking and a quiet environment.",
        amenities: ["Parking", "Water", "Security", "Garden", "Kitchen"],
        photos: [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20rooftop.jpg?width=1200"
        ],
        ownerName: "KisumuHomes",
        ownerPhone: "+254742636064",
        whatsapp: "254742636064",
        ownerType: "Agent",
        status: "Available",
        createdAt: "2026-09-06"
    }
];

async function loadListings() {
    try {
        const response = await fetch("/api/houses");

        if (!response.ok) {
            throw new Error("Failed to load houses");
        }

        const houses = await response.json();
        allListings = houses;
        displayListings(allListings);
    } catch (error) {
        console.error("Falling back to demo data:", error);
        allListings = [...demoListings];
        displayListings(allListings);
    }
}

function displayListings(listings) {
    const listingGrid = document.querySelector(".listing-grid");

    if (!listingGrid) return;

    listingGrid.innerHTML = "";

    if (listings.length === 0) {
        listingGrid.innerHTML = `
            <div class="no-results">
                <h3>No houses found</h3>
                <p>Try changing your search filters.</p>
            </div>
        `;

        updateResultCount(0);
        return;
    }

    listings.forEach(listing => {
        const card = document.createElement("div");
        card.className = "property-card";

        const image =
            listing.photos && listing.photos.length > 0
                ? listing.photos[0]
                : "https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20City%20view.jpg?width=1200";

        card.innerHTML = `
            <div class="property-image"
                 style="background-image: url('${image}')">
                <span class="property-status">
                    ${listing.status || "Available"}
                </span>
                <button
                    class="favorite-button"
                    onclick="toggleFavorite(this)"
                    title="Add to favorites">
                    ♡
                </button>
            </div>
            <div class="property-content">
                <h3>${escapeHTML(listing.title)}</h3>
                <p class="property-location">
                    📍 ${escapeHTML(listing.location)}
                </p>
                <div class="property-info">
                    <span>🛏 ${listing.bedrooms || 0} Beds</span>
                    <span>🚿 ${listing.bathrooms || 0} Bath</span>
                </div>
                <div class="property-bottom">
                    <strong>
                        KSh ${Number(listing.price).toLocaleString()}
                        <small>/month</small>
                    </strong>
                    <button
                        class="view-button"
                        onclick="openListingDetails('${listing.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `;

        listingGrid.appendChild(card);
    });

    updateResultCount(listings.length);
}

function normalizeLocationValue(value) {
    return String(value || "").trim().toLowerCase();
}

function normalizeTypeValue(value) {
    const normalized = String(value || "").trim().toLowerCase();

    const map = {
        single: "single room",
        bedsitter: "bedsitter",
        one: "1 bedroom",
        two: "2 bedroom",
        three: "3 bedroom",
        four: "4 bedroom",
        apartment: "apartment",
        maisonette: "maisonette"
    };

    return map[normalized] || normalized;
}

function filterHouses() {
    const location = normalizeLocationValue(document.getElementById("filterLocation")?.value);
    const type = normalizeTypeValue(document.getElementById("filterType")?.value);
    const maxRent = Number(document.getElementById("filterPrice")?.value) || Infinity;

    const filtered = allListings.filter(listing => {
        const listingLocation = normalizeLocationValue(listing.location);
        const listingType = normalizeTypeValue(listing.type);

        const locationMatch = !location || location === "all" || listingLocation.includes(location);
        const typeMatch = !type || type === "all" || listingType.includes(type);
        const priceMatch = Number(listing.price) <= maxRent || maxRent === Infinity;

        return locationMatch && typeMatch && priceMatch;
    });

    displayListings(filtered);
}

function clearFilters() {
    const location = document.getElementById("filterLocation");
    const type = document.getElementById("filterType");
    const rent = document.getElementById("filterPrice");

    if (location) location.value = "all";
    if (type) type.value = "all";
    if (rent) rent.value = "all";

    displayListings(allListings);
}

function sortListings() {
    const sort = document.getElementById("sortListings")?.value;
    let sorted = [...allListings];

    if (sort === "low") {
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "high") {
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
        sorted.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    displayListings(sorted);
}

function openListingDetails(id) {
    window.location.href = `property.html?id=${encodeURIComponent(id)}`;
}

function closeProperty() {
    const modal = document.getElementById("propertyModal");

    if (modal) {
        modal.innerHTML = "";
    }
}

function toggleFavorite(button) {
    button.classList.toggle("active");
    button.innerHTML = button.classList.contains("active") ? "♥" : "♡";
}

function updateResultCount(count) {
    const resultCount = document.getElementById("resultCount");

    if (resultCount) {
        resultCount.textContent =
            `${count} house${count !== 1 ? "s" : ""} found`;
    }
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadPropertyDetails() {
    const detailRoot = document.getElementById("propertyDetails");

    if (!detailRoot) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        detailRoot.innerHTML = `
            <div class="property-detail-empty">
                <h2>Property not found</h2>
                <p>The listing you requested could not be loaded.</p>
                <a href="houses.html" class="post-btn">Back to listings</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/houses/${id}`);

        if (!response.ok) {
            throw new Error("Property not found");
        }

        const property = await response.json();
        const images = Array.isArray(property.photos) && property.photos.length
            ? property.photos
            : ["https://commons.wikimedia.org/wiki/Special:FilePath/Kisumu%20City%20view.jpg?width=1600"];

        const amenities = Array.isArray(property.amenities) && property.amenities.length
            ? property.amenities.map(item => `<span>✓ ${escapeHTML(item)}</span>`).join("")
            : "<span>No amenities listed</span>";

        const whatsappNumber = String(property.whatsapp || property.ownerPhone || "").replace(/\D/g, "");
        const phoneNumber = property.ownerPhone || "+254742636064";

        detailRoot.innerHTML = `
            <div class="property-detail-page">
                <div class="property-detail-gallery">
                    ${images.map((image, index) => `
                        <img src="${image}" alt="${escapeHTML(property.title)} ${index + 1}" class="property-detail-image" />
                    `).join("")}
                </div>

                <div class="property-detail-card">
                    <p class="property-location">📍 ${escapeHTML(property.location)}</p>
                    <h1>${escapeHTML(property.title)}</h1>
                    <div class="property-detail-price">
                        KSh ${Number(property.price).toLocaleString()} <span>/month</span>
                    </div>

                    <div class="property-detail-meta">
                        <span>🛏 ${property.bedrooms || 0} Bedrooms</span>
                        <span>🚿 ${property.bathrooms || 0} Bathrooms</span>
                        <span>🏠 ${escapeHTML(property.type)}</span>
                    </div>

                    <h3>Description</h3>
                    <p>${escapeHTML(property.description || "No description provided.")}</p>

                    <h3>Amenities</h3>
                    <div class="property-detail-amenities">${amenities}</div>

                    <h3>Contact</h3>
                    <div class="property-contact-box">
                        <p><strong>${escapeHTML(property.ownerName || "Landlord / Agent")}</strong></p>
                        <p>${escapeHTML(phoneNumber)}</p>
                        <div class="property-detail-actions">
                            <a href="tel:${phoneNumber}" class="call-button">📞 Call</a>
                            <a href="https://wa.me/${whatsappNumber}" target="_blank" class="whatsapp-button">💬 WhatsApp</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        detailRoot.innerHTML = `
            <div class="property-detail-empty">
                <h2>Property not found</h2>
                <p>The listing is unavailable or has been removed.</p>
                <a href="houses.html" class="post-btn">Back to listings</a>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const propertyDetails = document.getElementById("propertyDetails");

    if (propertyDetails) {
        loadPropertyDetails();
    } else {
        loadListings();
    }
});

/* =========================================
   STEP 3 — POST HOUSE SYSTEM
========================================= */
/* =========================================
   STEP 3 — POST HOUSE SYSTEM
========================================= */


// ================= PHOTO PREVIEW =================

const photoInput =
    document.getElementById("propertyPhotos");

const photoPreview =
    document.getElementById("photoPreview");


if (photoInput) {

    photoInput.addEventListener(
        "change",
        function () {

            photoPreview.innerHTML = "";

            const files =
                Array.from(this.files).slice(0, 6);


            files.forEach(
                function (file, index) {

                    if (!file.type.startsWith("image/")) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const item =
                                document.createElement("div");

                            item.className =
                                "photo-preview-item";


                            item.innerHTML = `

                                <img
                                    src="${event.target.result}"
                                    alt="Property photo"
                                >

                                <button
                                    type="button"
                                    class="remove-photo"
                                    onclick="this.parentElement.remove()"
                                >
                                    ×
                                </button>

                            `;


                            photoPreview.appendChild(item);

                        };


                    reader.readAsDataURL(file);

                }
            );

        }
    );

}


// ================= FORM SUBMISSION =================

const houseForm =
    document.getElementById("houseForm");


if (houseForm) {

    houseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const title =
                document.getElementById("propertyTitle").value.trim();

            const location =
                document.getElementById("propertyLocation").value;

            const type =
                document.getElementById("propertyType").value;

            const price =
                Number(document.getElementById("propertyPrice").value);

            const bedrooms =
                document.getElementById("bedrooms").value;

            const bathrooms =
                document.getElementById("bathrooms").value;

            const description =
                document.getElementById("propertyDescription").value.trim();

            const ownerName =
                document.getElementById("ownerName").value.trim();

            const ownerPhone =
                document.getElementById("ownerPhone").value.trim();

            const whatsapp =
                document.getElementById("ownerWhatsapp").value.trim();

            const ownerType =
                document.getElementById("ownerType").value;

            const selectedAmenities =
                Array.from(
                    document.querySelectorAll('input[name="amenity"]:checked')
                ).map(checkbox => checkbox.value);

            if (!title || !location || !type || !price || !ownerName || !ownerPhone) {
                alert("Please complete all required fields before publishing.");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("location", location);
            formData.append("type", type);
            formData.append("price", String(price));
            formData.append("bedrooms", String(bedrooms || 0));
            formData.append("bathrooms", String(bathrooms || 0));
            formData.append("description", description);
            formData.append("ownerName", ownerName);
            formData.append("ownerPhone", ownerPhone);
            formData.append("whatsapp", whatsapp || ownerPhone);
            formData.append("ownerType", ownerType || "Landlord");

            selectedAmenities.forEach(amenity => {
                formData.append("amenities", amenity);
            });

            const files = Array.from(document.getElementById("propertyPhotos")?.files || []);
            files.slice(0, 6).forEach(file => {
                formData.append("photos", file);
            });

            try {
                const response = await fetch("/api/houses", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result.error || "Unable to publish house.");
                }

                const successModal = document.getElementById("successModal");
                if (successModal) {
                    successModal.classList.add("show");
                }

                houseForm.reset();
                photoPreview.innerHTML = "";

                if (typeof loadListings === "function") {
                    await loadListings();
                }

            } catch (error) {
                console.error(error);
                alert(error.message || "Something went wrong while posting the house.");
            }
        }
    );

}


// ================= CLOSE SUCCESS =================

function closeSuccess() {

    const modal =
        document.getElementById("successModal");

    if (modal) {

        modal.classList.remove("show");

    }

}


// ================= LOGIN MESSAGE =================

function showLoginMessage() {

    alert(
        "Login and account registration will be added in the next stage."
    );

}
