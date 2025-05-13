let tzCount = 0;
const selectedLocations = [];

function setupMapClick() {
  const paths = document.querySelectorAll("#map-container svg path");
  paths.forEach(path => {
    path.addEventListener("click", () => {
      const countryName = path.getAttribute("title");
      const match = TIMEZONES.find(tz =>
        tz.country === countryName || tz.label.includes(countryName)
      );

      if (match) {
        addLocation(match);
        path.classList.add("selected-location");
      } else {
        alert(`No timezone found for ${countryName}`);
      }
    });
  });
}

function addLocation(timezone) {
  if (!selectedLocations.includes(timezone.value)) {
    selectedLocations.push(timezone.value);
    updateSelectedList();
  }
}

function updateSelectedList() {
  const container = document.getElementById("timezoneInputs");
  container.innerHTML = "";

  selectedLocations.forEach((tz, index) => {
    const label = TIMEZONES.find(t => t.value === tz)?.label || tz;
    const div = document.createElement("div");
    div.className = "timezone-group";
    div.textContent = `📍 ${label}`;
    container.appendChild(div);
  });
}

function findOverlap() {
  if (selectedLocations.length < 2) {
    alert("Please select at least two time zones.");
    return;
  }

  const start = parseInt(document.getElementById("startTime").value.split(':')[0]);
  const end = parseInt(document.getElementById("endTime").value.split(':')[0]);

  let overlaps = [];

  for (let utc = 0; utc < 24; utc++) {
    const localHours = selectedLocations.map(tz => utcToLocalHour(utc, tz));
    if (localHours.every(h => h >= start && h < end)) {
      overlaps.push({
        utc: `${utc}:00 UTC`,
        locals: localHours.map((h, i) => `${h}:00 ${selectedLocations[i]}`),
      });
    }
  }

  const resultDiv = document.getElementById("result");

  if (overlaps.length === 0) {
    resultDiv.innerHTML = "<p>No overlapping working hours found.</p>";
    return;
  }

  let html = "<p>Possible overlapping times:</p><ul>";
  overlaps.forEach(time => {
    html += `<li>${time.utc} → ${time.locals.join(', ')}</li>`;
  });
  html += "</ul>";

  resultDiv.innerHTML = html;
}

function utcToLocalHour(utcHour, timeZone) {
  const date = new Date();
  date.setUTCHours(utcHour, 0, 0, 0);
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: timeZone
  });
  return parseInt(formatter.format(date));
}

function addTimezone() {
  // Optional: keep search box as backup
  alert("Use the map to select locations.");
}