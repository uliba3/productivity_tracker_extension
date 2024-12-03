import { displayVisuals } from './visualization.js';

// Add date picker event listener
document.addEventListener('DOMContentLoaded', async () => {
  const datePicker = document.getElementById('datePicker');
  const displayToggle = document.getElementById('displayToggle');

  // Set today as max date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  // Set date constraints
  datePicker.max = today; // Can't select future dates
  datePicker.value = today;

  await displayVisuals(today);


  // Update on date change
  datePicker.addEventListener('change', async (e) => {
    const selectedDate = e.target.value;
    await displayVisuals(selectedDate);
  });

  // Toggle display preference
  displayToggle.addEventListener('change', async (e) => {
    const selectedDate = datePicker.value;
    await displayVisuals(selectedDate);
  });
});