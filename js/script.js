// These are like containers to store information from the webpage.
const dropLists = document.querySelectorAll("form select");
const fromCurrencySelect = document.querySelector(".from select");
const toCurrencySelect = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeIcon = document.querySelector("form .icon");

// These are like buttons where you can choose different things.
// We make a list of options for each button and set a default option for the first button (USD) and the second button (INR).
// We also show a little flag image next to the chosen option.
for (let dropList of dropLists) {
    for (let currencyCode in country_list) {
        const isSelected = dropList === fromCurrencySelect ? currencyCode === "USD" : currencyCode === "INR";
        const selectedAttribute = isSelected ? "selected" : "";
        const optionTag = `<option value="${currencyCode}" ${selectedAttribute}>${currencyCode}</option>`;
        dropList.insertAdjacentHTML("beforeend", optionTag);
    }

    // When you pick a different option, it changes the flag image.
    dropList.addEventListener("change", (e) => {
        loadFlag(e.target);
    });
}

// This is like a function to show the flag image when you choose a currency.
function loadFlag(selectElement) {
    for (let code in country_list) {
        if (code === selectElement.value) {
            const imgTag = selectElement.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// When you first open the webpage, it sets everything up.
window.addEventListener("load", () => {
    getExchangeRate();
});

// This is like a button that lets you switch the two options.
exchangeIcon.addEventListener("click", () => {
    swapCurrencies();
});

// This is like a button that calculates how much of one currency you get for another.
getButton.addEventListener("click", (e) => {
    e.preventDefault(); // This prevents the page from refreshing when you click the button.
    getExchangeRate();
});

// This is like a function to switch the two options.
function swapCurrencies() {
    const tempCode = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempCode;
    loadFlag(fromCurrencySelect);
    loadFlag(toCurrencySelect);
    getExchangeRate();
}

// This is like a function to get the exchange rate and show it on the webpage.
function getExchangeRate() {
    const amountInput = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountValue = amountInput.value;

    // If you don't put in a number or put in zero, it assumes you want to exchange 1 of the first currency.
    if (amountValue === "" || amountValue === "0") {
        amountInput.value = "1";
        amountValue = 1;
    }

    // It tells you it's figuring out the exchange rate.
    exchangeRateTxt.innerText = "Getting exchange rate...";

    // It talks to a special website to get the exchange rate.
    // Then, it calculates how much of the second currency you get for the amount you put in of the first currency.
    const apiUrl = `https://v6.exchangerate-api.com/v6/e540b8809f4c6c9e6f2850d6/latest/${fromCurrencySelect.value}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            const exchangeRate = result.conversion_rates[toCurrencySelect.value];
            const totalExRate = (amountValue * exchangeRate).toFixed(2);
            // It shows you the result on the webpage.
            exchangeRateTxt.innerText = `${amountValue} ${fromCurrencySelect.value} = ${totalExRate} ${toCurrencySelect.value}`;
        })
        .catch(() => {
            // If something goes wrong, it tells you there's an issue.
            exchangeRateTxt.innerText = "Something went wrong";
        });
}


console.log(country_list);