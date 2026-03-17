const apiKey = '793af60931d81f9344daacca';
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const currencyDisplay = document.getElementById('currencyToEGP');
const amountInput = document.getElementById('amount');
const convertedAmountInput = document.getElementById('convertedAmount');
const convertNowButton = document.getElementById('convertNow');
const swapCurrenciesButton = document.getElementById('swapCurrencies');

let exchangeRates = {}; // لتخزين أسعار الصرف الحالية

// دالة لجلب أسعار الصرف من API
async function exchangeCurrency(baseCurrency) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`);
        const data = await response.json();
        exchangeRates = data.conversion_rates; // خزّن البيانات
        return data;
    } catch (error) {
        console.error('Error fetching currency data:', error);
        return null;
    }
}

// دالة عامة لملء أي قائمة select بالعملات
function populateCurrencySelect(selectElement, data, defaultValue) {
    if (!data || !data.conversion_rates) return;

    const currencies = Object.keys(data.conversion_rates); 
    selectElement.innerHTML = '';

    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;

        if (currency === defaultValue) {
            option.selected = true;
        }

        selectElement.appendChild(option);
    });
}

// دالة لتحديث سعر الصرف المعروض
function updateExchangeRate() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const rate = exchangeRates[toCurrency]; 
    if (rate) {
        currencyDisplay.innerHTML = `1 ${fromCurrency} = <span class="text-primary">${rate.toFixed(2)} ${toCurrency}</span>`;
    } else {
        currencyDisplay.textContent = 'Exchange rate not available';
    }
}

// دالة لتحويل المبلغ
function convertCurrency() {
    const amount = Number(amountInput.value);
    const toCurrency = toCurrencySelect.value;
    const rate = exchangeRates[toCurrency];

    if (rate && !isNaN(amount)) {
        const convertedAmount = (amount * rate).toFixed(2);
        convertedAmountInput.value = convertedAmount;
    } else {
        convertedAmountInput.value = 'Conversion not available';
    }
}

// دالة لتبديل العملات
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;

    if (convertedAmountInput.value) {
        amountInput.value = convertedAmountInput.value;
    } else {
        amountInput.value = '';
    }

    updateCurrencies();
    convertCurrency();
}

// دالة لتحديث العملات عند تغيير fromCurrency
async function updateCurrencies() {
    const baseCurrency = fromCurrencySelect.value;
    const data = await exchangeCurrency(baseCurrency);
    populateCurrencySelect(toCurrencySelect, data, 'EGP'); // default to EGP
    updateExchangeRate();
    convertCurrency();
}

// أحداث
convertNowButton.addEventListener('click', convertCurrency);
swapCurrenciesButton.addEventListener('click', swapCurrencies);
fromCurrencySelect.addEventListener('change', updateCurrencies);
toCurrencySelect.addEventListener('change', () => {
    updateExchangeRate();
    convertCurrency();
});

// عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', async () => {
    const baseCurrency = 'USD';
    const data = await exchangeCurrency(baseCurrency);

    populateCurrencySelect(fromCurrencySelect, data, 'USD'); // fromCurrency default USD
    populateCurrencySelect(toCurrencySelect, data, 'EGP');   // toCurrency default EGP
    updateExchangeRate();
});