document.addEventListener('DOMContentLoaded', () => {
    // Get input elements
    const costPerUnit = document.getElementById("costPerUnit");
    const pricePerUnitInput = document.getElementById("pricePerUnit");
    const quantityInput = document.getElementById("quantity");
    const totalPriceInput = document.getElementById("totalPrice");
    const weightInput = document.getElementById("weight");
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

    const calcShippingProcessingFee = (weight) => {
        const MAX_WEIGHT_TO_BE_SMALL = 1; // In KG
        const MAX_WEIGHT_TO_BE_Medium = 5; // In KG
        const MAX_WEIGHT_TO_BE_Large = 30; // In KG

        let fee = 0;
        if (weight <= MAX_WEIGHT_TO_BE_SMALL) {
            fee = 8;
        } else if (weight <= MAX_WEIGHT_TO_BE_Medium) {
            fee = 13
        } else if (weight <= MAX_WEIGHT_TO_BE_Large) {
            fee = 30
        } else {
            fee = 90
        }

        return fee;
    };

    const handleShippingProcessingFee = (weight) => {
        // Get Appropriate Fee
        const fee = calcShippingProcessingFee(weight);

        // Set Package Type
        for (let i = 0; i < packageType.options.length; i++) {
            if(packageType.options[i].value == fee)
                packageType.options[i].selected = true;
        }

        // Set Fee
        shippingProcessingFee.value = fee * quantityInput.value;

        calcProfitsNumbers();
    }

    const setCommissionFee = (totalPrice) => {
        commissionFee.value = (totalPrice * productCategory.value).toFixed(2);

        calcProfitsNumbers();
    };

    const calcProfitsNumbers = () => {
        const pickupFee = yesInput.checked ? yesInput.value : 0;

        // Calculate Net Income
        netIncome.value = (totalPriceInput.value - commissionFee.value - shippingProcessingFee.value - pickupFee).toFixed(2);
        // Calculate Net Profit
        netProfit.value = (netIncome.value - costPerUnit.value * quantity.value).toFixed(2);
        // Calculate Profit Margin
        profitMargin.value = ((netProfit.value / costPerUnit.value) * 100).toFixed(2) + "%";
    };


    // Handle Total Price
    [pricePerUnitInput, quantityInput].forEach(input => {
        input.addEventListener('input', calcTotalPrice)
    });
    // Handle Shipping Processing Order Fee
    weightInput.addEventListener('input', (e) => handleShippingProcessingFee(e.target.value))
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