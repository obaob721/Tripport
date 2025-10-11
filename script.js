// ===============================
// ✈️ BOOKING SECTION LOGIC
// ===============================
const bookingForm = document.getElementById("bookingForm");
const flightType = document.getElementById("flightType");
const returnDateContainer = document.getElementById("returnDateContainer");
let selectedFlight = null;

// 🟩 Data storage
let bookingSummary = {
  bookingData: null,
  passengers: []
};

flightType.addEventListener("change", () => {
  returnDateContainer.style.display =
    flightType.value === "roundtrip" ? "block" : "none";
});



// ===============================
// ✈️ FLIGHT SECTION LOGIC
// ===============================
const schedules = [
  // 🟩 One Way Flights
  { flightNo: "5J 560", destination: "Cebu → Manila", departTime: "08:00 AM", hours: 1.5, price: 3500, seats: 20, fareType: "Promo Fare", type: "oneway" },
  { flightNo: "PR 2814", destination: "Cebu → Iloilo", departTime: "10:30 AM", hours: 2, price: 4200, seats: 15, fareType: "None", type: "oneway" },
  { flightNo: "DG 6208", destination: "Cebu → Davao", departTime: "02:00 PM", hours: 1, price: 3100, seats: 12, fareType: "Promo Fare", type: "oneway" },

  // 🟦 Round Trip Flights
  { flightNo: "5J 561", destination: "Cebu ↔ Manila", departTime: "09:00 AM", returnTime: "06:00 PM", hours: 3, price: 7000, seats: 18, fareType: "Promo Fare", type: "roundtrip" },
  { flightNo: "PR 4512", destination: "Cebu ↔ Iloilo", departTime: "11:30 AM", returnTime: "07:00 PM", hours: 4, price: 8900, seats: 10, fareType: "None", type: "roundtrip" },
  { flightNo: "DG 8123", destination: "Cebu ↔ Davao", departTime: "03:00 PM", returnTime: "04:00 PM", hours: 3.5, price: 7500, seats: 8, fareType: "Promo Fare", type: "roundtrip" },
];

function renderFlights(bookingData) {
  const flightsList = document.getElementById("flightsList");
  flightsList.innerHTML = "";

  const availableFlights = schedules.filter(f => f.type === bookingData.flightType);

  availableFlights.forEach(flight => {
    const card = document.createElement("div");
    card.classList.add("flight-card");

    card.innerHTML = flight.type === "oneway"
      ? `
        <h3>${flight.flightNo} - ${flight.destination}</h3>
        <p><b>Depart:</b> ${bookingData.departDate} (${flight.departTime})</p>
        <p><b>Price:</b> ₱${flight.price}</p>
        <p><b>Seats Available:</b> ${flight.seats}</p>
        <p><b>Travel Time:</b> ${flight.hours} hr(s)</p>
        <p><b>Fare Type:</b> ${flight.fareType}</p>
        <button class="select-flight">Select Flight</button>
      `
      : `
        <h3>${flight.flightNo} - ${flight.destination}</h3>
        <p><b>Depart:</b> ${bookingData.departDate} (${flight.departTime})</p>
        <p><b>Return:</b> ${bookingData.returnDate} (${flight.returnTime})</p>
        <p><b>Price:</b> ₱${flight.price}</p>
        <p><b>Seats Available:</b> ${flight.seats}</p>
        <p><b>Travel Time:</b> ${flight.hours} hr(s)</p>
        <p><b>Fare Type:</b> ${flight.fareType}</p>
        <button class="select-flight">Select Flight</button>
      `;

    card.querySelector(".select-flight").addEventListener("click", () => {
      selectedFlight = flight;
      alert(`You selected flight ${flight.flightNo}!`);
    });

    flightsList.appendChild(card);
  });
}

// ✅ Booking form submission (render flights)
bookingForm.addEventListener("submit", e => {
  e.preventDefault();

  const bookingData = {
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    flightType: flightType.value,
    departDate: document.getElementById("departDate").value,
    returnDate: document.getElementById("returnDate").value,
    passengers: parseInt(document.getElementById("passengers").value)
  };

  bookingSummary.bookingData = bookingData;
  bookingSummary.passengers = []; // reset passenger list if new booking
  renderFlights(bookingData);
});



// ===============================
// 👤 PASSENGER SECTION LOGIC
// ===============================
let passengerCount = 0;

function validatePassengerForm() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;

  if (!/^\d{11}$/.test(phone)) {
    alert("Phone number must be exactly 11 digits.");
    return false;
  }
  if (age < 1 || age > 120) {
    alert("Please enter a valid age between 1 and 120.");
    return false;
  }

  // ✅ store passenger info
  bookingSummary.passengers.push({
    firstName, lastName, email, phone, age, gender
  });

  passengerCount++;

  // ✅ clear form for next passenger if not yet complete
  const totalPassengers = bookingSummary.bookingData?.passengers || 1;
  if (passengerCount < totalPassengers) {
    alert(`Passenger ${passengerCount} added. Please enter details for Passenger ${passengerCount + 1}.`);
    document.getElementById("passengerForm").reset();
  } else {
    alert("All passenger details collected successfully!");
    document.getElementById("passengerForm").reset();
    displaySummary();
  }

  return false; // prevent reload
}

// ===============================
// 📋 SUMMARY DISPLAY LOGIC
// ===============================
function displaySummary() {
  const passengerSummary = document.getElementById("passenger-summary");
  const flightSummary = document.getElementById("flight-summary");

  passengerSummary.innerHTML = "";
  flightSummary.innerHTML = "";

  const { bookingData, passengers } = bookingSummary;

  // 🧍‍♂️ Passenger Summary
  if (passengers.length > 0) {
    passengers.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("passenger-card");
      div.innerHTML = `
        <h4>Passenger ${i + 1}</h4>
        <p><b>Name:</b> ${p.firstName} ${p.lastName}</p>
        <p><b>Email:</b> ${p.email}</p>
        <p><b>Phone:</b> ${p.phone}</p>
        <p><b>Age:</b> ${p.age}</p>
        <p><b>Gender:</b> ${p.gender}</p>
        <hr>
      `;
      passengerSummary.appendChild(div);
    });
  }

  // 🛫 Flight Summary
  if (bookingData && selectedFlight) {
    flightSummary.innerHTML = `
      <p><b>From:</b> ${bookingData.from}</p>
      <p><b>To:</b> ${bookingData.to}</p>
      <p><b>Flight Type:</b> ${bookingData.flightType}</p>
      <p><b>Depart Date:</b> ${bookingData.departDate}</p>
      ${
        bookingData.flightType === "roundtrip"
          ? `<p><b>Return Date:</b> ${bookingData.returnDate}</p>`
          : ""
      }
      <p><b>Passengers:</b> ${bookingData.passengers}</p>
      <hr>
      <p><b>Flight No:</b> ${selectedFlight.flightNo}</p>
      <p><b>Destination:</b> ${selectedFlight.destination}</p>
      <p><b>Fare Type:</b> ${selectedFlight.fareType}</p>
      <p><b>Price per Passenger:</b> ₱${selectedFlight.price}</p>
      <p><b>Total Price:</b> ₱${selectedFlight.price * bookingData.passengers}</p>
    `;
  }
}

// ===============================
// ✅ BOOK NOW BUTTON
// ===============================
document.getElementById("bookNowBtn").addEventListener("click", function () {
  const msg = document.getElementById("successMessage");
  msg.classList.remove("hidden");
  this.disabled = true;
  this.style.backgroundColor = "#ccc";
  this.innerText = "Booked";
});
