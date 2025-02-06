import { getSavedPreferences, savePreferences } from "../helpers/main.js";

document.addEventListener('DOMContentLoaded', () => {
    // Get Input Elements
    const costPerUnit = document.getElementById("costPerUnit");
    const pricePerUnitInput = document.getElementById("pricePerUnit");
    const quantityInput = document.getElementById("quantity");
    const totalPriceInput = document.getElementById("totalPrice");
    const packageType = document.getElementById("packageType");
    const shippingProcessingFee = document.getElementById("shippingProcessingFee");
    const commissionFee = document.getElementById("commissionFee");
    const productCategory = document.getElementById("productCategory");
    const yesInput = document.querySelector('input[name="pickup"][value="15"]');
    const noInput = document.querySelector('input[name="pickup"][value="0"]');
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

        setCommissionFee(totalPrice);
    };

    const setCommissionFee = (totalPrice) => {
        commissionFee.value = (totalPrice * productCategory.value).toFixed(2);

        calcProfitsNumbers();
    };


    const calcProfitsNumbers = () => {
        const pickupFee = yesInput.checked ? yesInput.value : 0;

        // Calculate Net Income
        netIncome.value = (totalPriceInput.value - commissionFee.value - shippingProcessingFee.value - pickupFee).toFixed(2);
        if (+netIncome.value < 0) netIncome.style.color = 'red';
        else netIncome.style.color = 'green';
        // Calculate Net Profit
        netProfit.value = (netIncome.value - costPerUnit.value * quantity.value).toFixed(2);
        if (+netProfit.value < 0) netProfit.style.color = 'red';
        else netProfit.style.color = 'green';

        
        // Calculate Profit Margin
        if (costPerUnit.value == 0) profitMargin.value = '0%';
        else {
            profitMargin.value = ((netProfit.value / (costPerUnit.value != 0 ? costPerUnit.value : netProfit.value)) * 100).toFixed(2) + "%";
            if (+profitMargin.value.replace('%', '') < 0) profitMargin.style.color = 'red';
            else profitMargin.style.color = 'green';
        }
    };


    // Handle Total Price
    [pricePerUnitInput, quantityInput].forEach(input => {
        input.addEventListener('input', calcTotalPrice)
    });
    // Handle Shipping Processing Order Fee
    packageType.addEventListener('change', (e) => {
        shippingProcessingFee.value = e.target.value * quantityInput.value;
        calcProfitsNumbers();
    });
    quantityInput.addEventListener('input', (e) => {
        shippingProcessingFee.value = packageType.value * e.target.value;
        calcProfitsNumbers();
    });
    // Handle Profit Stats
    [costPerUnit, yesInput, noInput].forEach(input => {
        input.addEventListener('input', calcProfitsNumbers)
    });



    // Handle Preferences
    // Get
    const handleSetSavedPreferences = (preferences) => {
        // Handle Product Category
        const targetProductCategory = Array.from(productCategory.options).find(option => (option.textContent.trim() === preferences.category?.name.trim()) && (option.value === preferences.category?.value));
        if (targetProductCategory) targetProductCategory.selected = true;
        const targetPackageType = Array.from(packageType.options).find(option => option.value === preferences.packageType);
        // Handle Package Type
        if (targetPackageType) {
            targetPackageType.selected = true
            shippingProcessingFee.value = targetPackageType.value * quantityInput.value;
        };
        // Handle Pickup
        if (preferences.isDealWithPickup) yesInput.checked = true;
        else noInput.checked = true;
    };
    const KEY = "jumia-revenue-calc-preferences";
    const savedPreferences = getSavedPreferences(KEY);
    if (savedPreferences) handleSetSavedPreferences(savedPreferences);

    // Set
    const savePreferencesBtn = document.getElementById("savePreferencesBtn");
    savePreferencesBtn.addEventListener('click', () => {
        const selectedCatgOpt = Array.from(productCategory.options).find(option => option.selected === true);
        const preferences = {
            category: {name: selectedCatgOpt.textContent.trim(), value: selectedCatgOpt.value},
            packageType: packageType.value,
            isDealWithPickup: yesInput.checked
        };
        savePreferences(KEY, preferences);
    });
});
