const bookingForm = document.getElementById("bookingForm");
const flightType = document.getElementById("flightType");
const returnDateContainer = document.getElementById("returnDateContainer");
let selectedFlight = null;

let bookingSummary = {
  bookingData: null,
  passengers: []
};

flightType.addEventListener("change", () => {
  returnDateContainer.style.display =
    flightType.value === "roundtrip" ? "block" : "none";
});

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
  bookingSummary.passengers = [];
  renderFlights(bookingData);

  document.querySelector("#flight").scrollIntoView({ behavior: "smooth" });
});





const schedules = [
  { flightNo: "5J 560", route: "→", departTime: "06:00 AM", hours: 1.5, price: 1999, seats: 60, fareType: "Promo Fare", type: "oneway", fromTerminal: "Terminal 1", toTerminal: "Terminal 2" },
  { flightNo: "PR 2814", route: "→", departTime: "02:00 PM", hours: 1, price: 4500, seats: 30, fareType: "None", type: "oneway", fromTerminal: "Terminal 1", toTerminal: "Terminal 3" },
  { flightNo: "DG 6208", route: "→", departTime: "10:00 PM", hours: 2, price: 4800, seats: 8, fareType: "None", type: "oneway", fromTerminal: "Terminal 2", toTerminal: "Terminal 1" },
  { flightNo: "5J 561", route: "↔", departTime: "08:00 AM", returnTime: "12:00 PM", hours: 3, price: 3998, seats: 50, fareType: "Promo Fare", type: "roundtrip", fromTerminal: "Terminal 1", toTerminal: "Terminal 2" },
  { flightNo: "PR 4512", route: "↔", departTime: "04:00 PM", returnTime: "08:00 PM", hours: 2, price: 9000, seats: 25, fareType: "None", type: "roundtrip", fromTerminal: "Terminal 3", toTerminal: "Terminal 1" },
  { flightNo: "DG 8123", route: "↔", departTime: "12:00 AM", returnTime: "09:00 AM", hours: 4, price: 9600, seats: 5, fareType: "None", type: "roundtrip", fromTerminal: "Terminal 4", toTerminal: "Terminal 2" },
];


function renderFlights(bookingData) {
  const flightsList = document.getElementById("flightsList");
  flightsList.innerHTML = "";

  const availableFlights = schedules.filter(f => f.type === bookingData.flightType);

  availableFlights.forEach(flight => {
    const destination = `${bookingData.from} ${flight.route} ${bookingData.to}`; 
    const card = document.createElement("div");
    card.classList.add("flight-card");

    card.innerHTML = flight.type === "oneway"
    ? `
      <h3>${flight.flightNo} - ${destination}</h3>
      <p><b>Depart:</b> ${bookingData.departDate} (${flight.departTime})</p>
      <p><b>Price:</b> ₱${flight.price}</p>
      <p><b>Seats Available:</b> ${flight.seats}</p>
      <p><b>Travel Time:</b> ${flight.hours} hr(s)</p>
      <p><b>Fare Type:</b> ${flight.fareType}</p>
      <button class="select-flight">Select Flight</button>
    `
    : `
      <h3>${flight.flightNo} - ${destination}</h3>
      <p><b>Depart:</b> ${bookingData.departDate} (${flight.departTime})</p>
      <p><b>Return:</b> ${bookingData.returnDate} (${flight.returnTime})</p>
      <p><b>Price:</b> ₱${flight.price}</p>
      <p><b>Seats Available:</b> ${flight.seats}</p>
      <p><b>Travel Time:</b> ${flight.hours} hr(s)</p>
      <p><b>Fare Type:</b> ${flight.fareType}</p>
      <button class="select-flight">Select Flight</button>
    `;


    card.querySelector(".select-flight").addEventListener("click", () => {
      selectedFlight = { ...flight, destination };
      alert(`You selected flight ${flight.flightNo}!`);

      const totalPassengers = bookingSummary.bookingData?.passengers || 0;
      if (totalPassengers > 0) {
        setPassengerFormEnabled(true);
        document.querySelector("#passenger").scrollIntoView({ behavior: "smooth" });
      }
    });

    flightsList.appendChild(card);
  });
}





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

  bookingSummary.passengers.push({ firstName, lastName, email, phone, age, gender });
  passengerCount++;

  const totalPassengers = bookingSummary.bookingData?.passengers || 1;
  if (passengerCount < totalPassengers) {
    alert(`Passenger ${passengerCount} added. Please enter details for Passenger ${passengerCount + 1}.`);
    document.getElementById("passengerForm").reset();
  } else {
    alert("All passenger details collected successfully!");
    document.getElementById("passengerForm").reset();
    setPassengerFormEnabled(false);
    displaySummary();

    document.querySelector("#summary").scrollIntoView({ behavior: "smooth" });
  }

  return false;
}

function setPassengerFormEnabled(enabled) {
  const inputs = document.querySelectorAll("#passengerForm input, #passengerForm select, #addPassengerBtn");
  inputs.forEach(el => el.disabled = !enabled);
}

setPassengerFormEnabled(false);





const bookNowBtn = document.getElementById("bookNowBtn");
const successMessage = document.getElementById("successMessage");

bookNowBtn.style.display = "none";

function updateBookNowButtonVisibility() {
  const { bookingData, passengers } = bookingSummary;
 
  if (bookingData && passengers.length > 0 && selectedFlight) {
    bookNowBtn.style.display = "inline-block";
    bookNowBtn.disabled = false;
  } else {
    bookNowBtn.style.display = "none";
  }
}

function displaySummary() {
  const passengerTableBody = document.querySelector("#passenger-summary tbody");
  const flightTableBody = document.querySelector("#flight-summary tbody");
  passengerTableBody.innerHTML = "";
  flightTableBody.innerHTML = "";

  const { bookingData, passengers } = bookingSummary;

  passengers.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.firstName} ${p.lastName}</td>
      <td>${p.email}</td>
      <td>${p.phone}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>`;
    passengerTableBody.appendChild(row);
  });

  if (bookingData && selectedFlight) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${bookingData.from}</td>
      <td>${bookingData.to}</td>
      <td>${bookingData.flightType}</td>
      <td>${bookingData.departDate}</td>
      <td>${bookingData.flightType === "roundtrip" ? bookingData.returnDate : "-"}</td>
      <td>${selectedFlight.flightNo}</td>
      <td>${selectedFlight.destination}</td>
      <td>${selectedFlight.fareType}</td>
      <td>₱${selectedFlight.price}</td>
      <td>₱${selectedFlight.price * bookingData.passengers}</td>`;
    flightTableBody.appendChild(row);
  }

  updateBookNowButtonVisibility();
}





bookNowBtn.addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const { bookingData, passengers } = bookingSummary;

  doc.setFillColor(255, 140, 0);
  doc.rect(0, 0, 210, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("TRIPPORT AIRLINES", 15, 20);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("FLIGHT BOOKING RECEIPT", 15, 45);
  doc.setFontSize(10);
  doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 150, 45);

  doc.setFont("helvetica", "bold");
  doc.text("Flight Information", 15, 57);
  doc.setFont("helvetica", "normal");
  let leftY = 65;
  doc.text(`Flight No: ${selectedFlight.flightNo}`, 15, leftY);
  leftY += 7;
  doc.text(`From: ${bookingData.from}`, 15, leftY);
  leftY += 7;
  doc.text(`To: ${bookingData.to}`, 15, leftY);
  leftY += 7;
  doc.text(`Type: ${bookingData.flightType}`, 15, leftY);
  leftY += 7;
  doc.text(`Fare Type: ${selectedFlight.fareType}`, 15, leftY);

  const rightX = 110;
  doc.setFont("helvetica", "bold");
  doc.text("Flight Details", rightX, 57);
  doc.setFont("helvetica", "normal");
  let rightY = 65;
  doc.text(`Depart: ${bookingData.departDate} (${selectedFlight.departTime})`, rightX, rightY);
  rightY += 7;
  doc.text(`Departing: ${bookingData.from} International Airport ${selectedFlight.fromTerminal}`, rightX, rightY, { maxWidth: 90 });
  rightY += 7;
  doc.text(`Arriving: ${bookingData.to} International Airport ${selectedFlight.toTerminal}`, rightX, rightY, { maxWidth: 90 });
  rightY += 7;
  if (bookingData.flightType === "roundtrip") {
    doc.text(`Return: ${bookingData.returnDate} (${selectedFlight.returnTime})`, rightX, rightY);
  } else {
    doc.text(`Return: N/A`, rightX, rightY);
  }
  rightY += 7;
  doc.text(`Travel Time: ${selectedFlight.hours} hr(s)`, rightX, rightY);

  const boxBottom = Math.max(leftY, rightY) + 5;
  const boxHeight = boxBottom - 50;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(10, 50, 190, boxHeight);

  doc.setFont("helvetica", "bold");
  doc.text("Passenger Information", 15, boxBottom + 10);

  let y = boxBottom + 17;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("No", 15, y);
  doc.text("Name", 25, y);
  doc.text("Age", 85, y);
  doc.text("Gender", 100, y);
  doc.text("Email", 125, y);
  doc.text("Phone", 165, y);

  y += 5;
  doc.setLineWidth(0.1);
  doc.line(10, y, 200, y);

  passengers.forEach((p, i) => {
    y += 8;
    doc.text(`${i + 1}`, 15, y);
    doc.text(`${p.firstName} ${p.lastName}`, 25, y);
    doc.text(`${p.age}`, 85, y);
    doc.text(`${p.gender}`, 100, y);
    doc.text(`${p.email}`, 125, y, { maxWidth: 35 });
    doc.text(`${p.phone}`, 165, y);
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  y += 15;
  doc.setDrawColor(0);
  doc.rect(10, y, 190, 25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Summary", 15, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(`Price per Passenger: P${selectedFlight.price}`, 15, y + 16);
  doc.text(
    `Total Amount: P${selectedFlight.price * bookingData.passengers}`,
    100,
    y + 16
  );

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    "Thank you for flying with Tripport Airlines. Have a safe and pleasant journey!",
    15,
    290
  );
  doc.text("This is a system-generated ticket. No signature required.", 15, 295);

  doc.save(`Flight_Ticket_${selectedFlight.flightNo}.pdf`);

  successMessage.classList.remove("hidden");
  this.disabled = true;
  this.style.backgroundColor = "#ccc";
  this.innerText = "Booked";
});





const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("ul li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) link.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  setPassengerFormEnabled(false);
});