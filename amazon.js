import { getSavedPreferences, savePreferences } from "./helpers/main.js";

document.addEventListener("DOMContentLoaded", function () {
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
    const easyShippingFee = document.getElementById("easyShippingFee");
    const shippingTax = document.getElementById("shippingTax");
    const packageType = document.getElementById("packageType");
    const commissionFee = document.getElementById("commissionFee");
    const productCategory = document.getElementById("productCategory");
    const commissionTax = document.getElementById("commissionTax");
    const netIncome = document.getElementById("netIncome");
    const netProfit = document.getElementById("netProfit");
    const profitMargin = document.getElementById("profitMargin");
    
    
    const calcTotalPrice = () => {
        // Get the values from the inputs
        const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        // calc the total price
        const totalPrice = pricePerUnit * quantity;
        // Set the total price in the respective input field
        totalPriceInput.value = totalPrice.toFixed(2);

        setTotalCustomerPay();
    };
    const setTotalCustomerPay = () => {
        totalCustomerPay.value = (+totalPriceInput.value + +customerShippingFee.value).toFixed(2);

        setCommissionFee();
    };
    const setCommissionFee = () => {
        commissionFee.value = (totalCustomerPay.value * productCategory.value).toFixed(2);
        // Set 14% Tax On Commission Fee
        commissionTax.value = (commissionFee.value * 0.14).toFixed(2);

        calcProfitsNumbers();
    };

    const calcEasyShipping = () => {
        // Get the values from the inputs
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        let weight = parseFloat(weightInput.value) || 0;

        const volumetricWeight = (length * width * height) / 5000;
        if (volumetricWeight > weight) weight = volumetricWeight;
        else weight = weight;

        // Check If Will calc Is Standard Weight Or Super Weight
        let isStandard = false;
        if (length <= 45 && width <= 34 && height <= 26 && weight <= 12) isStandard = true;

        if (isStandard) {
            calcEasyShipAsStandard(weight);
            packageType.value = "قياسي"
        } else {
            calcEasyShipAsSuper(weight);
            packageType.value = "كبير"
        }

        calcProfitsNumbers()
    };
    const  calcEasyShipAsStandard = (weight) => {
        const baseShippingFee = 42
        const weightIncrement = 2;
        const maxWeight = 12;
        const additionalFeePerKg = 2;
        let shippingFees = baseShippingFee;

        if (weight <= 0.250) shippingFees = baseShippingFee;
        else if (weight <= 0.500) shippingFees = 47;
        else if (weight <= 1) shippingFees = 49;
        else if (weight <= 1.5) shippingFees = 51;
        else if (weight <= weightIncrement) shippingFees = 53;
        else if (weight > weightIncrement) {
            // Calculate the number of additional kilograms over the base increment
            const additionalKg = Math.min(weight, maxWeight) - weightIncrement;
            // Add the additional fee based on the extra kilograms
            shippingFees += additionalKg * additionalFeePerKg;
        }

        // Set Shipping Fees
        easyShippingFee.value = shippingFees;
        shippingTax.value = (shippingFees * 0.14).toFixed(2);
    };
    const  calcEasyShipAsSuper = (weight) => {
        const baseShippingFee = 49
        const weightIncrement = 1;
        const additionalFeePerKg = 2;
        let shippingFees = baseShippingFee;

        // Calculate the number of additional kilograms over the base increment
        const additionalKg = Math.ceil(weight - weightIncrement);
        // Add the additional fee based on the extra kilograms
        shippingFees += additionalKg * additionalFeePerKg;

        // Set Shipping Fees
        easyShippingFee.value = shippingFees;
        shippingTax.value = (shippingFees * 0.14).toFixed(2);
    };

    const calcProfitsNumbers = () => {
        // Calculate Net Income
        netIncome.value = (totalCustomerPay.value - commissionFee.value - commissionTax.value - easyShippingFee.value - shippingTax.value).toFixed(2);
        if (+netIncome.value < 0) netIncome.style.color = 'red';
        else netIncome.style.color = 'green';
        // Calculate Net Profit
        netProfit.value = (netIncome.value - (costPerUnit.value * quantity.value)).toFixed(2);
        if (+netProfit.value < 0) netProfit.style.color = 'red';
        else netProfit.style.color = 'green';
        // Calculate Profit Margin
        profitMargin.value = ((netProfit.value / costPerUnit.value) * 100).toFixed(2) + "%";
        if (+profitMargin.value.replace('%', '') < 0) profitMargin.style.color = 'red';
        else profitMargin.style.color = 'green';
    };


    // Add event listeners to calc total price when inputs change
    costPerUnit.addEventListener("input", calcTotalPrice);
    pricePerUnitInput.addEventListener("input", calcTotalPrice);
    quantityInput.addEventListener("input", calcTotalPrice);

    customerShippingFee.addEventListener("input", setTotalCustomerPay);
    customerShippingFee.addEventListener("input", (e) => {
        const fee = e.target.value;
        if (fee > 26 || fee < -1) 
            customerShippingFee.value = "26";
    });

    totalCustomerPay.addEventListener("input", setCommissionFee);

    weightInput.addEventListener("input", calcEasyShipping);
    lengthInput.addEventListener("input", calcEasyShipping);
    widthInput.addEventListener("input", calcEasyShipping);
    heightInput.addEventListener("input", calcEasyShipping);
    

    // Handle Preferences
    // Get
    const KEY = "amz-revenue-calc-preferences";
    const savedPreferences = getSavedPreferences(KEY);
    if (savedPreferences?.category) {
        const targetProductCategory = Array.from(productCategory.options).find(option => (option.textContent === savedPreferences.category?.name) && (option.value === savedPreferences.category?.value));
        if (targetProductCategory) targetProductCategory.selected = true;
    }

    // Set
    const savePreferencesBtn = document.getElementById("savePreferencesBtn");
    savePreferencesBtn.addEventListener('click', () => {
        const selectedCatgOpt = Array.from(productCategory.options).find(option => option.selected === true);
        savePreferences(KEY, {category: {name: selectedCatgOpt.textContent, value: selectedCatgOpt.value}});
    });
});
