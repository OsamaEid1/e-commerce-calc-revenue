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
    /* Deprecated for now By Amazon */
    // const setCommForDiscountedCommission = (selectedOption) => {
    //     const offerType1StartDate = "08/01/2024";
    //     const offerType1EndDate = "01/31/2025";
    //     const offerType2StartDate = "08/01/2024";
    //     const offerType2EndDate = "01/31/2025";
    //     const offerType3StartDate = "01/01/2025";
    //     const offerType3EndDate = "03/31/2025";
    //     const offerType3DiscountBarrier = 300;

    //     switch (+selectedOption.dataset.offerType) {
    //         case 1:
    //             if (
    //                 new Date(offerType1StartDate) <= new Date() &&
    //                 new Date() <= new Date(offerType1EndDate)
    //             )
    //                 productComm = +selectedOption.dataset.offerDiscount;
    //             else productComm = +selectedOption.value;
    //             break;
    //         case 2:
    //             if (
    //                 new Date(offerType2StartDate) <= new Date() &&
    //                 new Date() <= new Date(offerType2EndDate)
    //             )
    //                 productComm = +selectedOption.dataset.offerDiscount;
    //             else productComm = +selectedOption.value;
    //             break;
    //         case 3:
    //             const priceToPay = totalCustomerPay
    //                 ? +totalCustomerPay.value
    //                 : +totalPriceInput.value;
    //             if (
    //                 priceToPay >= offerType3DiscountBarrier &&
    //                 new Date(offerType3StartDate) <= new Date() &&
    //                 new Date() <= new Date(offerType3EndDate)
    //             )
    //                 productComm = +selectedOption.dataset.offerDiscount;
    //             else productComm = +selectedOption.value;
    //             break;

    //         default:
    //             productComm = +selectedOption.value;
    //             break;
    //     }

    //     // Set Updated Commission
    //     if (updatedCommission) updatedCommission.value = productComm;
    // };
    const handleGetCategoryCommission = () => { 
        // Get the selected <option> element
        const selectedOption = productCategory.options[productCategory.selectedIndex];

        // Handle Variable Commissions
        if (productCategory.value === "variable")
            setCommForVariableCommission(selectedOption);

        // Handle Discounted FBA Commissions
            /* Deprecated for now By Amazon */
            /* if (selectedOption.dataset.offerType) {
                setCommForDiscountedCommission(selectedOption);
            } else  */
        if (productCategory.value !== "variable") {
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
        const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;
        let shippingFees = 0;
        const maxWeight = 22;

        // Determine base shipping fee based on weight and price
        if (weight <= 0.25) {
            shippingFees = pricePerUnit <= 350 ? 46.5 : 52.5;
        } else if (weight <= 0.5) {
            shippingFees = pricePerUnit <= 350 ? 52 : 58;
        } else if (weight <= 1) {
            shippingFees = pricePerUnit <= 350 ? 54 : 60;
        } else if (weight <= 1.5) {
            shippingFees = pricePerUnit <= 350 ? 58.5 : 64.5;
        } else if (weight <= 2) {
            shippingFees = pricePerUnit <= 350 ? 60.5 : 66.5;
        } else if (weight > 2 && weight <= maxWeight) {
            // For weights above 2 kg, add 2 EGP per additional kg
            const additionalWeight = weight - 2;
            const baseFee = pricePerUnit <= 350 ? 60.5 : 66.5;
            shippingFees = baseFee + additionalWeight * 2;
        } else {
            // Weight exceeds max limit
            shippingFees = 0;
        }

        // Set Shipping Fees
        AmazonShippingFee.value = shippingFees;
        AmazonShippingTax.value = (shippingFees * 0.14).toFixed(2);
    };
    const calcEasyShipAsSuper = (weight) => {
        const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;
        let shippingFees = 0;

        // Determine base shipping fee based on weight and price
        if (weight <= 1) {
            shippingFees = pricePerUnit <= 350 ? 56.5 : 62.5;
        } else if (weight > 1) {
            // For weights above 1 kg, add 2 EGP per additional kg
            const additionalWeight = weight - 1;
            const baseFee = pricePerUnit <= 350 ? 56.5 : 62.5;
            shippingFees = baseFee + additionalWeight * 2;
        }

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

        // Determine the shipping fee based on size, weight, and price per unit
        let shippingFee = 0;
        const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;

        switch (sizeCategory) {
            case "المُغلف الصغير":
                if (weightKg <= 0.1) {
                    shippingFee = pricePerUnit <= 350 ? 19.5 : 24.5;
                } else {
                    shippingFee = "غير متاح"; // Weight exceeds the limit
                }
                break;

            case "المُغلف الأساسي":
                if (weightKg <= 0.1) {
                    shippingFee = pricePerUnit <= 350 ? 19.5 : 24.5;
                } else if (weightKg <= 0.2) {
                    shippingFee = pricePerUnit <= 350 ? 19.5 : 24.5;
                } else if (weightKg <= 0.5) {
                    shippingFee = pricePerUnit <= 350 ? 20.5 : 25.5;
                } else {
                    shippingFee = "غير متاح";
                }
                break;

            case "المُغلف الكبير":
                if (weightKg <= 1) {
                    shippingFee = pricePerUnit <= 350 ? 21 : 26;
                } else {
                    shippingFee = "غير متاح";
                }
                break;

            case "الطرد الأساسي":
                if (weightKg <= 0.25) {
                    shippingFee = pricePerUnit <= 350 ? 19.5 : 24.5;
                } else if (weightKg <= 0.5) {
                    shippingFee = pricePerUnit <= 350 ? 20.5 : 25.5;
                } else if (weightKg <= 1) {
                    shippingFee = pricePerUnit <= 350 ? 21 : 26;
                } else if (weightKg <= 1.5) {
                    shippingFee = pricePerUnit <= 350 ? 22 : 27;
                } else if (weightKg <= 2) {
                    shippingFee = pricePerUnit <= 350 ? 22.5 : 27.5;
                } else if (weightKg <= 3) {
                    shippingFee = pricePerUnit <= 350 ? 23.5 : 28.5;
                } else if (weightKg <= 4) {
                    shippingFee = pricePerUnit <= 350 ? 24.5 : 29.5;
                } else if (weightKg <= 5) {
                    shippingFee = pricePerUnit <= 350 ? 25.5 : 30.5;
                } else if (weightKg <= 6) {
                    shippingFee = pricePerUnit <= 350 ? 26.5 : 31.5;
                } else if (weightKg <= 7) {
                    shippingFee = pricePerUnit <= 350 ? 27.5 : 32.5;
                } else if (weightKg <= 8) {
                    shippingFee = pricePerUnit <= 350 ? 28.5 : 33.5;
                } else if (weightKg <= 9) {
                    shippingFee = pricePerUnit <= 350 ? 29.5 : 34.5;
                } else if (weightKg <= 10) {
                    shippingFee = pricePerUnit <= 350 ? 30.5 : 35.5;
                } else if (weightKg <= 11) {
                    shippingFee = pricePerUnit <= 350 ? 31.5 : 36.5;
                } else if (weightKg <= 12) {
                    shippingFee = pricePerUnit <= 350 ? 32.5 : 37.5;
                } else {
                    shippingFee = "غير متاح";
                }
                break;

            case "فائق الحجم":
                if (weightKg <= 1) {
                    shippingFee = pricePerUnit <= 350 ? 25 : 30;
                } else if (weightKg <= 2) {
                    shippingFee = pricePerUnit <= 350 ? 27 : 32;
                } else if (weightKg <= 3) {
                    shippingFee = pricePerUnit <= 350 ? 29 : 34;
                } else if (weightKg <= 4) {
                    shippingFee = pricePerUnit <= 350 ? 31 : 36;
                } else if (weightKg <= 5) {
                    shippingFee = pricePerUnit <= 350 ? 33 : 38;
                } else if (weightKg <= 6) {
                    shippingFee = pricePerUnit <= 350 ? 35 : 40;
                } else if (weightKg <= 7) {
                    shippingFee = pricePerUnit <= 350 ? 37 : 42;
                } else if (weightKg <= 8) {
                    shippingFee = pricePerUnit <= 350 ? 39 : 44;
                } else if (weightKg <= 9) {
                    shippingFee = pricePerUnit <= 350 ? 41 : 46;
                } else if (weightKg <= 10) {
                    shippingFee = pricePerUnit <= 350 ? 43 : 48;
                } else if (weightKg <= 15) {
                    shippingFee = pricePerUnit <= 350 ? 53 : 58;
                } else if (weightKg <= 20) {
                    shippingFee = pricePerUnit <= 350 ? 63 : 68;
                } else if (weightKg <= 25) {
                    shippingFee = pricePerUnit <= 350 ? 73 : 78;
                } else if (weightKg <= 30) {
                    shippingFee = pricePerUnit <= 350 ? 83 : 88;
                } else {
                    // For weights above 30 kg, add 2 EGP per additional kg
                    const additionalWeight = weightKg - 30;
                    const baseFee = pricePerUnit <= 350 ? 83 : 88;
                    shippingFee = baseFee + additionalWeight * 2;
                }
                break;

            default:
                shippingFee = "غير متاح";
                break;
        }

        // Set the result
        packageType.value = sizeCategory;
        AmazonShippingFee.value = (shippingFee || 0) * quantityInput.value;
        AmazonShippingTax.value = ((shippingFee || 0 )* 0.14).toFixed(2);
    }


    // Add event listeners to calc total price when inputs change
    costPerUnit.addEventListener("input", calcTotalPrice);
    pricePerUnitInput.addEventListener("input", () => {
        // Update Shipping Fee In Case of FBA
        if (!customerShippingFee) calcFBAShippingFee();
        // Update Total Price
        calcTotalPrice();
    });
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
