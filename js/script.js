
// =====================================
// FleetTrack - Logistics Management
// =====================================

// Sample shipment data
let shipments = [
    {
        id: "FT1001",
        customer: "Rahul Sharma",
        destination: "Delhi",
        date: "25 Nov 2026",
        amount: 12500,
        status: "In Transit"
    },
    {
        id: "FT1002",
        customer: "Aman Verma",
        destination: "Mumbai",
        date: "24 Nov 2026",
        amount: 8500,
        status: "Delivered"
    },
    {
        id: "FT1003",
        customer: "Priya Singh",
        destination: "Chandigarh",
        date: "24 Nov 2026",
        amount: 15000,
        status: "Pending"
    },
    {
        id: "FT1004",
        customer: "Karan Malhotra",
        destination: "Ludhiana",
        date: "23 Nov 2026",
        amount: 6200,
        status: "In Transit"
    },
    {
        id: "FT1005",
        customer: "Neha Gupta",
        destination: "Jaipur",
        date: "22 Nov 2026",
        amount: 11000,
        status: "Delivered"
    },
    {
        id: "FT1006",
        customer: "Arjun Mehta",
        destination: "Amritsar",
        date: "22 Nov 2026",
        amount: 9300,
        status: "Pending"
    }
];

// =====================================
// DOM Elements
// =====================================

const shipmentTable = document.getElementById("shipmentTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const shipmentModal = document.getElementById("shipmentModal");
const addShipmentBtn = document.getElementById("addShipmentBtn");
const closeModal = document.getElementById("closeModal");
const shipmentForm = document.getElementById("shipmentForm");

const toast = document.getElementById("toast");

// =====================================
// Date Display
// =====================================

function displayDate() {
    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}

displayDate();

// =====================================
// Escape HTML for user-entered values
// =====================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// =====================================
// Render Shipment Table
// =====================================

function renderShipments() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredShipments = shipments.filter(shipment => {

        const matchesSearch =
            shipment.id.toLowerCase().includes(searchValue) ||
            shipment.customer.toLowerCase().includes(searchValue) ||
            shipment.destination.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            shipment.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    shipmentTable.innerHTML = "";

    if (filteredShipments.length === 0) {
        shipmentTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:25px;">
                    No shipments found.
                </td>
            </tr>
        `;
    }

    filteredShipments.forEach(shipment => {

        const row = document.createElement("tr");

        const safeId = escapeHTML(shipment.id);
        const safeCustomer = escapeHTML(shipment.customer);
        const safeDestination = escapeHTML(shipment.destination);
        const safeDate = escapeHTML(shipment.date);
        const safeStatus = escapeHTML(shipment.status);

        row.innerHTML = `
            <td>${safeId}</td>
            <td>${safeCustomer}</td>
            <td>${safeDestination}</td>
            <td>${safeDate}</td>
            <td>₹${Number(shipment.amount).toLocaleString("en-IN")}</td>
            <td>
                <span class="status ${safeStatus.replace(" ", "-")}">
                    ${safeStatus}
                </span>
            </td>
            <td>
                <button class="action-btn"
                    data-track="${safeId}">
                    View
                </button>
            </td>
        `;

        shipmentTable.appendChild(row);
    });

    document.getElementById("tableCount").textContent =
        `Showing ${filteredShipments.length} of ${shipments.length} shipments`;

    updateStats();
}

// =====================================
// Update Dashboard Statistics
// =====================================

function updateStats() {

    const delivered = shipments.filter(
        item => item.status === "Delivered"
    ).length;

    const transit = shipments.filter(
        item => item.status === "In Transit"
    ).length;

    const pending = shipments.filter(
        item => item.status === "Pending"
    ).length;

    document.getElementById("totalShipments").textContent =
        (1284 + shipments.length - 6).toLocaleString("en-IN");

    document.getElementById("transitCount").textContent =
        356 + transit - 2;

    document.getElementById("deliveredCount").textContent =
        892 + delivered - 2;

    document.getElementById("pendingCount").textContent =
        36 + pending - 2;
}

// =====================================
// Search and Filter
// =====================================

searchInput.addEventListener("input", renderShipments);

statusFilter.addEventListener("change", renderShipments);

// =====================================
// Add Shipment Modal
// =====================================

addShipmentBtn.addEventListener("click", () => {
    shipmentModal.classList.add("show");
});

closeModal.addEventListener("click", () => {
    shipmentModal.classList.remove("show");
});

shipmentModal.addEventListener("click", (event) => {
    if (event.target === shipmentModal) {
        shipmentModal.classList.remove("show");
    }
});

// =====================================
// Create New Shipment
// =====================================

shipmentForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const customer = document.getElementById("customerName").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const status = document.getElementById("shipmentStatus").value;

    if (!customer || !destination || !Number.isFinite(amount) || amount <= 0) {
        showToast("Please enter valid shipment details.");
        return;
    }

    const newShipment = {
        id: "FT" + (1001 + shipments.length),
        customer: customer,
        destination: destination,
        date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        amount: amount,
        status: status
    };

    shipments.unshift(newShipment);

    shipmentForm.reset();
    shipmentModal.classList.remove("show");

    searchInput.value = "";
    statusFilter.value = "all";

    renderShipments();

    showToast("Shipment created successfully!");
});

// =====================================
// Shipment Tracking
// =====================================

const trackingForm = document.getElementById("trackingForm");

trackingForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const trackingId = document
        .getElementById("trackingInput")
        .value.trim()
        .toUpperCase();

    const result = shipments.find(
        shipment => shipment.id.toUpperCase() === trackingId
    );

    const trackingResult = document.getElementById("trackingResult");

    if (result) {

        trackingResult.innerHTML = `
            <strong>Shipment Found!</strong><br>
            Tracking ID: ${escapeHTML(result.id)}<br>
            Customer: ${escapeHTML(result.customer)}<br>
            Destination: ${escapeHTML(result.destination)}<br>
            Current Status:
            <strong>${escapeHTML(result.status)}</strong>
        `;

    } else {

        trackingResult.textContent =
            "No shipment found. Please check your tracking ID.";
    }
});

// =====================================
// View Shipment Button
// =====================================

shipmentTable.addEventListener("click", (event) => {

    const button = event.target.closest("[data-track]");

    if (!button) return;

    document.getElementById("trackingInput").value =
        button.dataset.track;

    document.getElementById("trackingForm").requestSubmit();

    document.getElementById("tracking").scrollIntoView({
        behavior: "smooth"
    });
});

// =====================================
// Toast Notification
// =====================================

let toastTimer;

function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// =====================================
// Mobile Sidebar
// =====================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
        sidebar.classList.remove("open");
    });
});

// =====================================
// Navigation Support Buttons
// =====================================

document.getElementById("supportBtn").addEventListener("click", () => {
    showToast("Contact support at support@fleettrack.demo");
});

document.getElementById("notificationBtn").addEventListener("click", () => {
    showToast("You are all caught up!");
});

// =====================================
// Chart Period
// =====================================

const chartData = {
    week: [35, 50, 70, 55, 85, 65, 95],
    month: [45, 65, 55, 80, 70, 90, 75, 95, 60, 85, 72, 100],
    year: [55, 70, 65, 85, 75, 90, 80, 100, 70, 85, 95, 100]
};

const chartLabels = {
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

document.getElementById("chartPeriod").addEventListener("change", function() {

    const period = this.value;

    const barsContainer = document.getElementById("chartBars");

    barsContainer.innerHTML = "";

    chartData[period].forEach((height, index) => {

        const group = document.createElement("div");

        group.className = "bar-group";

        group.innerHTML = `
            <div class="bar" style="height:${height}%"></div>
            <span>${chartLabels[period][index]}</span>
        `;

        barsContainer.appendChild(group);
    });
});

// =====================================
// View All
// =====================================

document.getElementById("viewAllBtn").addEventListener("click", () => {

    searchInput.value = "";
    statusFilter.value = "all";

    renderShipments();

    showToast("All available demo shipments are displayed.");
});

// =====================================
// Initial Dashboard Load
// =====================================

renderShipments();

console.log("FleetTrack Dashboard Loaded Successfully!");
