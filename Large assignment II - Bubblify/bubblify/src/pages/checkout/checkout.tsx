import styles from "./checkout.module.css";
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
                    <h3>Would you like to</h3>
                    <button className={styles.option} onClick={() => handleSelectOption('option1')}>Pick Up</button>
                    <button className={styles.option} onClick={() => handleSelectOption('option2')}>Have Delivered</button>
                </div>
            ) : selectedOption === 'option1' ? (
                <PickupForm goBack={handleBack}/>
            ) : (
                <DeliveryForm goBack={handleBack} />
            )}
        </div>
    );
};