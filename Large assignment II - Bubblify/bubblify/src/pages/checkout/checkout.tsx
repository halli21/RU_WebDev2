import { CartList } from "../../components/cart-list/cart-list";
import { useState } from "react";
import { PickupForm } from "../../components/pickup-form/pickup-form";
import { DeliveryForm } from "../../components/delivery-form/delivery-form";

export const Checkout = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    const handleBack = () => {
        setSelectedOption('');
    };

    return (
        <div>
            {!selectedOption ? (
                <div>
                    <button onClick={() => handleSelectOption('option1')}>Store Pick Up</button>
                    <button onClick={() => handleSelectOption('option2')}>Delivery</button>
                </div>
            ) : selectedOption === 'option1' ? (
                <PickupForm goBack={handleBack}/>
            ) : (
                <DeliveryForm goBack={handleBack} />
            )}
        </div>
    );
};