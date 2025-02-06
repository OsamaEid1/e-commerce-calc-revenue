// Get elements
const costPerUnit = document.getElementById("costPerUnit");
const pricePerUnitInput = document.getElementById("pricePerUnit");
const quantityInput = document.getElementById("quantity");
const totalPriceInput = document.getElementById("totalPrice");
const customerShippingFee = document.getElementById("customerShippingFee");
const totalCustomerPay = document.getElementById("totalCustomerPay");
const weightInput = document.getElementById("weight");
const lengthInput = document.getElementById("length");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const shippingFee = document.getElementById("shippingFee");
const shippingTax = document.getElementById("shippingTax");
const packageType = document.getElementById("packageType");
const commissionFee = document.getElementById("commissionFee");
const commissionTax = document.getElementById("commissionTax");
const netIncome = document.getElementById("netIncome");
const netProfit = document.getElementById("netProfit");
const profitMargin = document.getElementById("profitMargin");
const yesInput = document.querySelector('input[name="pickup"][value="2"]');
const noInput = document.querySelector('input[name="pickup"][value="0"]');


// Initial Variables
let productComm = 0,
    priceBarrier = 0,
    commissionForAbove = 0,
    commissionForUnder = 0,
    minimumCommissionFee = 0,
    selectedProductCategoryValue,
    selectedProductCategoryName,
    selectedOptionEvent;

/* Handle Select Category Drop Menu */
// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-options");
    const icon = document.getElementById("dropdown-icon");
    dropdown.classList.toggle("hidden");
    icon.classList.toggle("rotate-180");
}

const setCommForVariableCommission = (selectedOption) => {
    priceBarrier = +selectedOption.dataset.priceBarrier;
    commissionForAbove = +selectedOption.dataset.commForAbove;
    commissionForUnder = +selectedOption.dataset.commForUnder;
    if (selectedOption.dataset.minimumCommFee)
        minimumCommissionFee = +selectedOption.dataset.minimumCommFee;
};
// Handle Category Changes and Set the Required Info
function selectOption(text, value, event) {
    // Set as selected option
    document.getElementById("selected-option").innerText = text;
    selectedProductCategoryValue = value;
    selectedProductCategoryName = text;

    selectedOptionEvent = event ? event.target : null;
    // Set Commission
    if (value == 'variable') setCommForVariableCommission(event.target);
    else productComm = +value;
    
    // Update the commission fee
    setCommissionFee();

    // Close dropdown after selection
    toggleDropdown();
}

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("dropdown-options");
    const button = document.getElementById("custom-select-button");
    if (
        !button.contains(event.target) &&
        !dropdown.contains(event.target)
    ) {
        dropdown.classList.add("hidden");
        document
            .getElementById("dropdown-icon")
            .classList.remove("rotate-180");
    }
});


// Handle Profitability Numbers
const calcProfitsNumbers = () => {
    // Calculate Net Income
    netIncome.value = (
        (totalCustomerPay
            ? totalCustomerPay.value
            : totalPriceInput.value) -
        commissionFee.value -
        commissionTax.value -
        shippingFee.value -
        shippingTax.value
    ).toFixed(2);

    // Calculate Net Profit
    netProfit.value = (
        netIncome.value -
        costPerUnit.value * quantity.value
    ).toFixed(2);

    // Calculate Profit Margin
    if (costPerUnit.value) {
        profitMargin.value = ((netProfit.value /  costPerUnit.value) * 100).toFixed(2) + "%";
        
        if (+profitMargin.value.replace("%", "") < 0)
            profitMargin.style.color = "red";
        else profitMargin.style.color = "green";

        if (+netIncome.value < 0) netIncome.style.color = "red";
        else netIncome.style.color = "green";

        if (+netProfit.value < 0) netProfit.style.color = "red";
        else netProfit.style.color = "green";
    }
};


// Handle Commission
const setCommissionFee = () => {
    // Set Price To Pay (for Both FBM/FBA)
    const priceToPay = totalCustomerPay
        ? +totalCustomerPay.value
        : +totalPriceInput.value;


    if (selectedProductCategoryValue === "variable") {
        if (priceToPay < priceBarrier) {
            commissionFee.value = (
                priceToPay * commissionForUnder
            ).toFixed(2);
            // Set the minimum commission fee
            if (commissionFee.value < minimumCommissionFee)
                commissionFee.value = minimumCommissionFee;

        } else {
            // Get commissions for price under and above the price barrier
            const commForPriceUnderThePriceBarrier =
                priceBarrier * commissionForUnder;
            const commForPriceAboveThePriceBarrier =
                (priceToPay - priceBarrier) * commissionForAbove;
            // Set the commission
            commissionFee.value = (
                commForPriceUnderThePriceBarrier +
                commForPriceAboveThePriceBarrier
            ).toFixed(2);
            // Set the minimum commission fee
            if (commissionFee.value < minimumCommissionFee)
                commissionFee.value = minimumCommissionFee;
        }
    } else {
        commissionFee.value = (priceToPay * productComm).toFixed(2);
        // Set the minimum commission fee
        if (commissionFee.value < minimumCommissionFee)
            commissionFee.value = minimumCommissionFee;
    }

    // Set 14% Tax On Commission Fee
    commissionTax.value = (commissionFee.value * 0.14).toFixed(2);

    calcProfitsNumbers();
};


// Handle Total Price
const calcTotalPrice = () => {
    // Get the values from the inputs
    const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    // calc the total price
    const totalPrice = pricePerUnit * quantity;
    // Set the total price in the respective input field
    totalPriceInput.value = totalPrice.toFixed(2);

    setCustomerShippingFee();
    setTotalCustomerPay();
};
const setCustomerShippingFee = () => {
    if (totalPrice.value < 200) customerShippingFee.value = 25;
    else if (totalPrice.value < 600) customerShippingFee.value = 12.5;
    else customerShippingFee.value = 0;
};    
const setTotalCustomerPay = () => {
    totalCustomerPay.value = (+totalPriceInput.value + +customerShippingFee.value).toFixed(2);

    setCommissionFee();
};


// Handle Seller Shipping Costs
const calcSellerShippingFee = () => {
    // Get the values from the inputs
    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;
    let weight = parseFloat(weightInput.value) || 0;

    const volumetricWeight = Math.ceil((length * width * height) / 5000);
    if (volumetricWeight > weight) weight = volumetricWeight;
    else weight = weight;

    // Check If Will calc Is Standard Weight Or Super Weight
    let isStandard = false;
    if (weight <= 12)
        isStandard = true;

    if (isStandard) {
        calcSellerShippingFeeAsStandard(weight);
        packageType.value = "قياسي";
    } else {
        calcSellerShippingFeeAsSuper(weight);
        packageType.value = "كبير";
    }

    calcProfitsNumbers();
};
const calcSellerShippingFeeAsStandard = (weight) => {
    const baseShippingFee = 36;
    const weightIncrement = 2;
    const maxWeight = 12;
    const additionalFeePerKg = 2;
    const maxFee = 67;
    let updatedShippingFee = baseShippingFee;

    if (weight <= 0.25) updatedShippingFee = baseShippingFee;
    else if (weight <= 0.5) updatedShippingFee = 41;
    else if (weight <= 1) updatedShippingFee = 43;
    else if (weight <= 1.5) updatedShippingFee = 45;
    else if (weight <= weightIncrement) updatedShippingFee = 47;
    else if (weight > weightIncrement) {
        const diffWeight = maxWeight - weight;
        const additionalFee = diffWeight * additionalFeePerKg;
        updatedShippingFee = maxFee - additionalFee;
    }

    // Handle Pickup Fees / Add 2 egy pounds for pickup service
    if (yesInput.checked) updatedShippingFee += 2;
    // Set Shipping Fees
    shippingFee.value = updatedShippingFee;
    shippingTax.value = (updatedShippingFee * 0.14).toFixed(2);
};
const calcSellerShippingFeeAsSuper = (weight) => {
    const baseShippingFee = 45;
    const additionalFeePerKg = 2;
    let updatedShippingFee = baseShippingFee;

    if (weight <= 1) updatedShippingFee = baseShippingFee;
    else if (weight <= 2) updatedShippingFee = 47;
    else if (weight <= 3) updatedShippingFee = 50;
    else if (weight <= 4 || weight <= 10) {
        if (weight == 10) updatedShippingFee = 64;
        else {
            const diffWeight = 10 - weight;
            const additionalFee = diffWeight * additionalFeePerKg;
            updatedShippingFee = 64 - additionalFee;
        }
    } else if (weight <= 15) updatedShippingFee = 66;
    else if (weight <= 20) updatedShippingFee = 76;
    else if (weight <= 25) updatedShippingFee = 86;
    else if (weight <= 30) updatedShippingFee = 96;
    else {
        const diffWeight = weight - 30;
        const additionalFee = diffWeight * additionalFeePerKg;
        updatedShippingFee = 96 + additionalFee;
    }

    // Handle Pickup Fees / Add 2 egy pounds for pickup service
    if (yesInput.checked) updatedShippingFee += 2;
    // Set Shipping Fees
    shippingFee.value = updatedShippingFee;
    shippingTax.value = (updatedShippingFee * 0.14).toFixed(2);
};


// Add event listeners to calc total price when inputs change
costPerUnit.addEventListener("input", calcTotalPrice);
pricePerUnitInput.addEventListener("input", calcTotalPrice);
quantityInput.addEventListener("input", calcTotalPrice);

// Handle Calc Easy Shipping
weightInput.addEventListener("input", calcSellerShippingFee);
lengthInput.addEventListener("input", calcSellerShippingFee);
widthInput.addEventListener("input", calcSellerShippingFee);
heightInput.addEventListener("input", calcSellerShippingFee);

// Handle Profit Stats
[yesInput, noInput].forEach(input => {
    input.addEventListener('input', calcSellerShippingFee)
});






/* Handle Preferences */
const savePreferences = (key, preferences) => {
    if (typeof preferences === "object") {
        localStorage.setItem(key, JSON.stringify(preferences));
        alert("لقد تم حفظ اختياراتك بنجاح ✅");
    } else alert("لقد حدث خطأ ما، حاول لاحقاً !");
};
const getSavedPreferences = (key) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error("Error parsing stored Preferences", error);
            return null;
        }
    } else {
        console.warn(`No value found for key: ${key}`);
        return null;
    }
};

// Get 
const KEY = "noon-revenue-calc-preferences";
const savedPreferences = getSavedPreferences(KEY);
if (savedPreferences?.category) {
    /* Handle Product Category */
    // Set as selected option
    document.getElementById("selected-option").innerText = savedPreferences.category.name;
    selectedProductCategoryValue = savedPreferences.category.value;
    selectedProductCategoryName = savedPreferences.category.name;

    // Set Commission
    if (savedPreferences.category.value == "variable") {
        priceBarrier = +savedPreferences.category.element?.priceBarrier;
        commissionForAbove = +savedPreferences.category.element?.commissionForAbove;
        commissionForUnder = +savedPreferences.category.element?.commissionForUnder;
    }
    else productComm = +savedPreferences.category.value;

    // Update the commission fee
    setCommissionFee();

    /* Handle Pickup */
    if (savedPreferences.isDealWithPickup) yesInput.checked = true;
    else noInput.checked = true;
} else if (savedPreferences?.isDealWithPickup) {
    if (savedPreferences.isDealWithPickup) yesInput.checked = true;
    else noInput.checked = true;
}

// Set
const savePreferencesBtn = document.getElementById("savePreferencesBtn");
savePreferencesBtn.addEventListener('click', () => {
    const elementProps = (selectedOptionEvent || priceBarrier) ? {
        priceBarrier: +priceBarrier || +selectedOptionEvent.dataset.priceBarrier,
        commissionForAbove: +commissionForAbove || +selectedOptionEvent.dataset.commForAbove,
        commissionForUnder: +commissionForUnder || +selectedOptionEvent.dataset.commForUnder,
    } : null;

    const preferences = {
        category: {
            name: selectedProductCategoryName,
            value: selectedProductCategoryValue,
            element: elementProps
        },
        isDealWithPickup: yesInput.checked,
    };

    savePreferences(KEY, preferences);
});