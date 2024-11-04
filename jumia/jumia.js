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
        profitMargin.value = ((netProfit.value / costPerUnit.value) * 100).toFixed(2) + "%";
        if (+profitMargin.value.replace('%', '') < 0) profitMargin.style.color = 'red';
        else profitMargin.style.color = 'green';
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
});
