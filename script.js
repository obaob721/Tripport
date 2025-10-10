// ===============================
// ✈️ BOOKING SECTION LOGIC
// ===============================
const bookingForm = document.getElementById("bookingForm");
const flightType = document.getElementById("flightType");
const returnDateContainer = document.getElementById("returnDateContainer");
let selectedFlight = null;

flightType.addEventListener("change", () => {
  returnDateContainer.style.display = 
    flightType.value === "roundtrip" ? "block" : "none";
});

// ===============================
// ✈️ FLIGHT SECTION LOGIC
// ===============================
const schedules = [
  // 🟩 One Way Flights
  { flightNo: "5J 560", destination: "Manila → Cebu", departTime: "08:00 AM", hours: 1.5, price: 3500, seats: 20, fareType: "Promo Fare", type: "oneway" },
  { flightNo: "PR 2814", destination: "Manila → Davao", departTime: "10:30 AM", hours: 2, price: 4200, seats: 15, fareType: "None", type: "oneway" },
  { flightNo: "DG 6208", destination: "Manila → Iloilo", departTime: "02:00 PM", hours: 1, price: 3100, seats: 12, fareType: "Promo Fare", type: "oneway" },
  { flightNo: "5J 560", destination: "Manila → Cebu", departTime: "08:00 AM", hours: 1.5, price: 3500, seats: 20, fareType: "Promo Fare", type: "oneway" },
  { flightNo: "PR 2814", destination: "Manila → Davao", departTime: "10:30 AM", hours: 2, price: 4200, seats: 15, fareType: "None", type: "oneway" },
  { flightNo: "DG 6208", destination: "Manila → Iloilo", departTime: "02:00 PM", hours: 1, price: 3100, seats: 12, fareType: "Promo Fare", type: "oneway" },
  { flightNo: "PR 2814", destination: "Manila → Davao", departTime: "10:30 AM", hours: 2, price: 4200, seats: 15, fareType: "None", type: "oneway" },
  { flightNo: "DG 6208", destination: "Manila → Iloilo", departTime: "02:00 PM", hours: 1, price: 3100, seats: 12, fareType: "Promo Fare", type: "oneway" },
    
    
  // 🟦 Round Trip Flights
  { flightNo: "5J 561", destination: "Cebu ↔ Manila", departTime: "09:00 AM", returnTime: "06:00 PM", hours: 3, price: 7000, seats: 18, fareType: "Promo Fare", type: "roundtrip" },
  { flightNo: "PR 4512", destination: "Davao ↔ Manila", departTime: "11:00 AM", returnTime: "07:00 PM", hours: 4, price: 8900, seats: 10, fareType: "None", type: "roundtrip" },
  { flightNo: "DG 8123", destination: "Iloilo ↔ Manila", departTime: "05:30 AM", returnTime: "04:00 PM", hours: 3.5, price: 7500, seats: 8, fareType: "Promo Fare", type: "roundtrip" },
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

// ✅ Booking form submission (just render flights, no hiding)
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

  renderFlights(bookingData);
});



function validatePassengerForm() {
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;

  if (!/^\d{11}$/.test(phone)) {
    alert("Phone number must be exactly 11 digits.");
    return false;
  }

  if (age < 1 || age > 120) {
    alert("Please enter a valid age between 1 and 120.");
    return false;
  }

  alert("Passenger information submitted successfully!");
  return true;
}


document.getElementById("bookNowBtn").addEventListener("click", function() {
  // Show success message
  const msg = document.getElementById("successMessage");
  msg.classList.remove("hidden");

  // Optionally disable button after booking
  this.disabled = true;
  this.style.backgroundColor = "#ccc";
  this.innerText = "Booked";
});