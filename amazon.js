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
    const AmazonShippingFee = document.getElementById("shippingFee");
    const AmazonShippingTax = document.getElementById("shippingTax");
    const packageType = document.getElementById("packageType");
    const commissionFee = document.getElementById("commissionFee");
    const productCategory = document.getElementById("productCategory");
    const commissionTax = document.getElementById("commissionTax");
    const netIncome = document.getElementById("netIncome");
    const netProfit = document.getElementById("netProfit");
    const profitMargin = document.getElementById("profitMargin");
    const updatedCommission = document.getElementById("updatedCommission");


    // Initial Variables
    let productComm = 0,
        priceBarrier = 0,
        commissionForAbove = 0,
        commissionForUnder = 0,
        minimumCommissionFee = 5;

    // Handle Profitability Numbers
    const calcProfitsNumbers = () => {
        // Calculate Net Income
        netIncome.value = (
            (totalCustomerPay
                ? totalCustomerPay.value
                : totalPriceInput.value) -
            commissionFee.value -
            commissionTax.value -
            AmazonShippingFee.value -
            AmazonShippingTax.value
        ).toFixed(2);
        if (+netIncome.value < 0) netIncome.style.color = "red";
        else netIncome.style.color = "green";

        // Calculate Net Profit
        netProfit.value = (
            netIncome.value -
            costPerUnit.value * quantity.value
        ).toFixed(2);
        if (+netProfit.value < 0) netProfit.style.color = "red";
        else netProfit.style.color = "green";

        // Calculate Profit Margin
        if (costPerUnit.value) {
            profitMargin.value =
                ((netProfit.value / (costPerUnit.value != 0 ? costPerUnit.value : netProfit.value)) * 100).toFixed(2) + "%";
            if (+netProfit.value < 0)
                profitMargin.style.color = "red";
            else profitMargin.style.color = "green";
        }
    };


    // Handle Commission
    const setCommissionFee = (newCommission) => {
        // Set Price To Pay (for Both FBM/FBA)
        const priceToPay = totalCustomerPay
            ? +totalCustomerPay.value
            : +totalPriceInput.value;

        // Check if user entered a new commission
        if (updatedCommission && updatedCommission.value != productComm && updatedCommission.value != commissionForAbove && updatedCommission.value != commissionForUnder) {
            commissionFee.value = (priceToPay * updatedCommission.value).toFixed(2);
            // Set the minimum commission fee
            if (commissionFee.value < 5) commissionFee.value = minimumCommissionFee;
        } else {  // Calc based on the stored commissions info
            // Handle Variable Commission
            if (productCategory.value === "variable") {
                if (priceToPay < priceBarrier) {
                    commissionFee.value = (priceToPay * commissionForUnder).toFixed(2);
                    // Set the minimum commission fee
                    if (commissionFee.value < minimumCommissionFee) commissionFee.value = minimumCommissionFee;

                    // Set Updated Commission
                    if (updatedCommission) updatedCommission.value = commissionForUnder;
                } else {
                    // Get commissions for price under and above the price barrier
                    const commForPriceUnderThePriceBarrier = priceBarrier * commissionForUnder;
                    const commForPriceAboveThePriceBarrier = (priceToPay - priceBarrier) * commissionForAbove;
                    // Set the commission
                    commissionFee.value = (
                        commForPriceUnderThePriceBarrier +
                        commForPriceAboveThePriceBarrier
                    ).toFixed(2);
                    // Set the minimum commission fee
                    if (commissionFee.value < minimumCommissionFee) commissionFee.value = minimumCommissionFee;

                    // Set Updated Commission
                    if (updatedCommission) updatedCommission.value = commissionForAbove;
                }
            } else {
                commissionFee.value = (priceToPay * productComm).toFixed(2);
                // Set the minimum commission fee
                if (commissionFee.value < minimumCommissionFee) commissionFee.value = minimumCommissionFee;

                // Set updated Commission Fee
                if (updatedCommission && updatedCommission.value != 0 && newCommission != 0)
                    updatedCommission.value = productComm;
            }
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

        if (totalCustomerPay) setTotalCustomerPay();
        else setCommissionFee();
    };
    const setTotalCustomerPay = () => {
        totalCustomerPay.value = (
            +totalPriceInput.value +
            (customerShippingFee ? +customerShippingFee.value : 0)
        ).toFixed(2);

        setCommissionFee();
    };

    // Handle Category Changes and Set the Required Info
    const setCommForVariableCommission = (selectedOption) => {
        priceBarrier = +selectedOption.dataset.priceBarrier;
        commissionForAbove = +selectedOption.dataset.commForAbove;
        commissionForUnder = +selectedOption.dataset.commForUnder;
        if (selectedOption.dataset.minimumCommFee) minimumCommissionFee = +selectedOption.dataset.minimumCommFee; 
    };
    const setCommForDiscountedCommission = (selectedOption) => {
        const offerType1StartDate = "08/01/2024";
        const offerType1EndDate = "01/31/2025";
        const offerType2StartDate = "08/01/2024";
        const offerType2EndDate = "01/31/2025";
        const offerType3StartDate = "01/01/2025";
        const offerType3EndDate = "03/31/2025";
        const offerType3DiscountBarrier = 300;

        switch (+selectedOption.dataset.offerType) {
            case 1:
                if (
                    new Date(offerType1StartDate) <= new Date() &&
                    new Date() <= new Date(offerType1EndDate)
                )
                    productComm = +selectedOption.dataset.offerDiscount;
                else productComm = +selectedOption.value;
                break;
            case 2:
                if (
                    new Date(offerType2StartDate) <= new Date() &&
                    new Date() <= new Date(offerType2EndDate)
                )
                    productComm = +selectedOption.dataset.offerDiscount;
                else productComm = +selectedOption.value;
                break;
            case 3:
                const priceToPay = totalCustomerPay
                    ? +totalCustomerPay.value
                    : +totalPriceInput.value;
                if (
                    priceToPay >= offerType3DiscountBarrier &&
                    new Date(offerType3StartDate) <= new Date() &&
                    new Date() <= new Date(offerType3EndDate)
                )
                    productComm = +selectedOption.dataset.offerDiscount;
                else productComm = +selectedOption.value;
                break;

            default:
                productComm = +selectedOption.value;
                break;
        }

        // Set Updated Commission
        if (updatedCommission) updatedCommission.value = productComm;
    };
    const handleGetCategoryCommission = () => { 
        // Get the selected <option> element
        const selectedOption = productCategory.options[productCategory.selectedIndex];

        // Handle Variable Commissions
        if (productCategory.value === "variable")
            setCommForVariableCommission(selectedOption);

        // Handle Discounted FBA Commissions
        if (selectedOption.dataset.offerType) {
            setCommForDiscountedCommission(selectedOption);
        } else if (productCategory.value !== "variable") {
            // Handle Normal Commission
            productComm = +selectedOption.value;
            if (updatedCommission) updatedCommission.value = productComm;
        }

        // Update the commission fee
        setCommissionFee();
    };
    productCategory.addEventListener("change", handleGetCategoryCommission); // Call when category changes

    // Handle Easy Shipping
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
        if (length <= 45 && width <= 34 && height <= 26 && weight <= 12)
            isStandard = true;

        if (isStandard) {
            calcEasyShipAsStandard(weight);
            packageType.value = "قياسي";
        } else {
            calcEasyShipAsSuper(weight);
            packageType.value = "كبير";
        }

        calcProfitsNumbers();
    };
    const calcEasyShipAsStandard = (weight) => {
        const baseShippingFee = 45.5;
        const weightIncrement = 2;
        const maxWeight = 12;
        const additionalFeePerKg = 2;
        let shippingFees = baseShippingFee;

        if (weight <= 0.25) shippingFees = baseShippingFee;
        else if (weight <= 0.5) shippingFees = 51;
        else if (weight <= 1) shippingFees = 53;
        else if (weight <= 1.5) shippingFees = 57.5;
        else if (weight <= weightIncrement) shippingFees = 59.5;
        else if (weight > weightIncrement) {
            // Calculate the number of additional kilograms over the base increment
            const additionalKg = Math.min(weight, maxWeight) - weightIncrement;
            // Add the additional fee based on the extra kilograms
            shippingFees += additionalKg * additionalFeePerKg;
        }

        // Set Shipping Fees
        AmazonShippingFee.value = shippingFees;
        AmazonShippingTax.value = (shippingFees * 0.14).toFixed(2);
    };
    const calcEasyShipAsSuper = (weight) => {
        const baseShippingFee = 55.5;
        const weightIncrement = 1;
        const additionalFeePerKg = 2;
        let shippingFees = baseShippingFee;

        // Calculate the number of additional kilograms over the base increment
        const additionalKg = Math.ceil(weight - weightIncrement);
        // Add the additional fee based on the extra kilograms
        shippingFees += additionalKg * additionalFeePerKg;

        // Set Shipping Fees
        AmazonShippingFee.value = shippingFees;
        AmazonShippingTax.value = (shippingFees * 0.14).toFixed(2);
    };

    // Handle FBA Shipping Fee
    function calcFBAShippingFee() {
        // Get the values from the inputs
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        let weightKg = parseFloat(weightInput.value) || 0;

        // Determine the size category
        let sizeCategory;
        if (length <= 20 && width <= 15 && height <= 1) {
            sizeCategory = "المُغلف الصغير";
        } else if (length <= 33 && width <= 23 && height <= 2.5) {
            sizeCategory = "المُغلف الأساسي";
        } else if (length <= 33 && width <= 23 && height <= 5) {
            sizeCategory = "المُغلف الكبير";
        } else if (length <= 45 && width <= 34 && height <= 26) {
            sizeCategory = "الطرد الأساسي";
        } else {
            sizeCategory = "فائق الحجم";
        }

        // Determine the shipping fee based on size and weight
        let shippingFee;
        switch (sizeCategory) {
            case "المُغلف الصغير":
                if (weightKg <= 0.1) {
                    shippingFee = 17.5;
                    break;
                } else {
                    shippingFee = "غير متاح"; // Weight exceeds the limit
                }

            case "المُغلف الأساسي":
                if (weightKg <= 0.1) {
                    shippingFee = 17.5;
                    sizeCategory = "المُغلف الأساسي";
                    break;
                } else if (weightKg <= 0.2) {
                    shippingFee = 17.5;
                    sizeCategory = "المُغلف الأساسي";
                    break;
                } else if (weightKg <= 0.5) {
                    shippingFee = 18.5;
                    sizeCategory = "المُغلف الأساسي";
                    break;
                }

            case "المُغلف الكبير":
                if (weightKg <= 1) {
                    shippingFee = 19;
                    sizeCategory = "المُغلف الكبير";
                    break;
                }

            case "الطرد الأساسي":
                if (weightKg <= 0.25) {
                    shippingFee = 17.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 0.5) {
                    shippingFee = 18.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 1) {
                    shippingFee = 19;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 1.5) {
                    shippingFee = 20;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 2) {
                    shippingFee = 20.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 3) {
                    shippingFee = 21.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 4) {
                    shippingFee = 22.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 5) {
                    shippingFee = 23.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 6) {
                    shippingFee = 24.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 7) {
                    shippingFee = 25.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 8) {
                    shippingFee = 26.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 9) {
                    shippingFee = 27.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 10) {
                    shippingFee = 28.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 11) {
                    shippingFee = 29.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                } else if (weightKg <= 12) {
                    shippingFee = 30.5;
                    sizeCategory = "الطرد الأساسي";
                    break;
                }

            case "فائق الحجم":
                if (weightKg <= 1) {
                    shippingFee = 23;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 2) {
                    shippingFee = 25;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 3) {
                    shippingFee = 27;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 4) {
                    shippingFee = 29;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 5) {
                    shippingFee = 31;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 6) {
                    shippingFee = 33;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 7) {
                    shippingFee = 35;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 8) {
                    shippingFee = 37;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 9) {
                    shippingFee = 39;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 10) {
                    shippingFee = 41;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 15) {
                    shippingFee = 51;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 20) {
                    shippingFee = 61;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 25) {
                    shippingFee = 71;
                    sizeCategory = "فائق الحجم";
                } else if (weightKg <= 30) {
                    shippingFee = 81;
                    sizeCategory = "فائق الحجم";
                } else {
                    // For weights above 30 kg, add 2 EGP per additional kg
                    const additionalWeight = weightKg - 30;
                    shippingFee = 81 + additionalWeight * 2;
                    sizeCategory = "فائق الحجم";
                }
                break;
        }

        // Set the result
        packageType.value = sizeCategory;
        AmazonShippingFee.value = shippingFee * quantityInput.value;
        AmazonShippingTax.value = (shippingFee * 0.14).toFixed(2);
    }

    // Add event listeners to calc total price when inputs change
    costPerUnit.addEventListener("input", calcTotalPrice);
    pricePerUnitInput.addEventListener("input", calcTotalPrice);
    quantityInput.addEventListener("input", () => {
        // Update Shipping Fee In Case of FBA
        if (!customerShippingFee) calcFBAShippingFee();
        // Update Total Price
        calcTotalPrice();
    });

    totalPriceInput.addEventListener("input", handleGetCategoryCommission);

    // For Amazon FBM
    if (customerShippingFee) {
        customerShippingFee.addEventListener("input", setTotalCustomerPay);
        customerShippingFee.addEventListener("input", (e) => {
            const fee = e.target.value;
            if (fee > 26 || fee < -1) customerShippingFee.value = "26";
        });

        totalCustomerPay.addEventListener("input", setCommissionFee);

        // Handle Calc Easy Shipping
        weightInput.addEventListener("input", calcEasyShipping);
        lengthInput.addEventListener("input", calcEasyShipping);
        widthInput.addEventListener("input", calcEasyShipping);
        heightInput.addEventListener("input", calcEasyShipping);
    } else { // Handle Calc FBA System
        // FBA Shipping
        weightInput.addEventListener("input", calcFBAShippingFee);
        lengthInput.addEventListener("input", calcFBAShippingFee);
        widthInput.addEventListener("input", calcFBAShippingFee);
        heightInput.addEventListener("input", calcFBAShippingFee);

        // Cover Changes of Commissions
        updatedCommission.addEventListener("input", (e) => setCommissionFee(e.target.value))
    }


    // Handle Preferences
    // Get
    const KEY = "amz-revenue-calc-preferences";
    const savedPreferences = getSavedPreferences(KEY);
    if (savedPreferences?.category) {
        const targetProductCategory = Array.from(productCategory.options).find(
            (option) =>
                option.textContent.trim() === savedPreferences.category?.name &&
                option.value === savedPreferences.category?.value
        );
        
        if (targetProductCategory) targetProductCategory.selected = true;
    };

    handleGetCategoryCommission(); // Call for the first load to get product's category commission

    // Set
    const savePreferencesBtn = document.getElementById("savePreferencesBtn");
    savePreferencesBtn.addEventListener("click", () => {
        const selectedCatgOpt = productCategory.options[productCategory.selectedIndex];

        const elementProps = selectedCatgOpt ? {
            priceBarrier: +selectedCatgOpt.dataset.priceBarrier,
            commissionForAbove: +selectedCatgOpt.dataset.commForAbove,
            commissionForUnder: +selectedCatgOpt.dataset.commForUnder,
        } : null;

        savePreferences(KEY, {
            category: {
                name: selectedCatgOpt.textContent.trim(),
                value: selectedCatgOpt.value,
                element: elementProps,
            },
        });
    });
});
