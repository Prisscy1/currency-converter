document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript Loaded!');
  populateCurrencyDropdowns();
});

const convertButton = document.getElementById('convert');
const amountInput = document.getElementById('amount');
const resultDisplay = document.getElementById('result');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const swapButton = document.querySelector('.swapButton');

// Function to populate currency dropdowns
async function populateCurrencyDropdowns() {
  try {
    const response = await fetch(
      'https://v6.exchangerate-api.com/v6/db5ff63a2bee3751e3c73396/codes'
    );
    const data = await response.json();

    if (!data.supported_codes) {
      console.error('Error fetching currency codes');
      return;
    }

    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    data.supported_codes.forEach(([code, name]) => {
      const option1 = document.createElement('option');
      option1.value = code;
      option1.textContent = `${code} - ${name}`; // Show currency code and name

      const option2 = option1.cloneNode(true); // Clone for the second dropdown

      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'NGN';
  } catch (error) {
    console.error('Error populating currency dropdowns:', error);
  }
}

// Function to format numbers with commas
function formatNumberWithCommas(number) {
  return new Intl.NumberFormat('en-US').format(number); // Correctly formats numbers with commas
}

// Convert currency
convertButton.addEventListener('click', async () => {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultDisplay.innerText = 'Please enter a valid amount.';
    return;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/db5ff63a2bee3751e3c73396/pair/${from}/${to}`
    );
    const data = await response.json();

    if (!data.conversion_rate) {
      resultDisplay.innerText = 'Invalid currency selection.';
      return;
    }

    const exchangeRate = data.conversion_rate;
    const convertedAmount = amount * exchangeRate;

    resultDisplay.innerText = `${formatNumberWithCommas(
      amount
    )} ${from} = ${formatNumberWithCommas(convertedAmount.toFixed(2))} ${to}`;
  } catch (error) {
    resultDisplay.innerText = 'Error fetching exchange rate. Try again.';
    console.error(error);
  }
});

// Swap Button Functionality
swapButton.addEventListener('click', () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});
