import styles from "./checkout.module.css";
import { useState } from "react";
import { submitOrder } from "../../services/bubblify-service";
import { useNavigate } from "react-router-dom";
import { CartList } from "../../components/cart-list/cart-list";


export const Checkout = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    const handleBack = () => {
        setSelectedOption('');
    };

    const navigate = useNavigate();


    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [showReview, setShowReview] = useState(false);
    const [error, setError] = useState('');

    const isDeliveryFormValid = fullName && address && city && phoneNumber && postalCode;

    const isPickupFormValid = fullName && phoneNumber;


    const handleNext = () => {
        setShowReview(true);
    };

    const handleBackToForm = () => {
        setShowReview(false);
    };

    const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');

    const handleConfirm = async () => {
        const response = await submitOrder(phoneNumber, cartFromStorage);
    
        if (response) {
            const userInfo = { fullName, phoneNumber };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('cart', JSON.stringify({ products: [], bundles: [] }));
            console.log('User information saved and order confirmed.');
            navigate('/confirmed');
        } else {
            setError('Error: Something happened while confirming order');
        }
    };



    return (
        <div>
            {!showReview && (
                <div>
                {!selectedOption ? (
                    <div>
                        <h3>Would you like to</h3>

                        <button className={styles.option} onClick={() => handleSelectOption('pickupform')}>Pick Up</button>
                        <button className={styles.option} onClick={() => handleSelectOption('deliveryform')}>Have Delivered</button>

                    </div>
                ) : selectedOption === 'pickupform' ? (
                    <div>
                        <form>
                            <fieldset className="uk-fieldset">

                                <h3>Pick Up Information</h3>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Full Name" aria-label="Input" value={fullName} onChange={e => setFullName(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-medium" type="text" placeholder="Phone Number" aria-label="Input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                </div>

                            </fieldset>
                        </form>

                        <button className={styles.button} type="button" onClick={handleBack}>Back</button>
                        <button className={styles.button} type="submit" onClick={handleNext} disabled={!isPickupFormValid}>Next</button>
                    </div>
                ) : (
                    <div>
                        <form>
                            <fieldset className="uk-fieldset">

                                <h3>Delivery Information</h3>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Full Name" aria-label="Input" value={fullName} onChange={e => setFullName(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Address" aria-label="Input" value={address} onChange={e => setAddress(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="City" aria-label="Input" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                
                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-medium" type="text" placeholder="Phone Number" aria-label="Input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-small" type="text" placeholder="Postal Code" aria-label="Input" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                                </div>

                            </fieldset>
                        </form>

                        <button className={styles.button} type="button" onClick={handleBack}>Back</button>
                        <button className={styles.button} type="submit" onClick={handleNext} disabled={!isDeliveryFormValid}>Next</button>
                    </div>
                )}
                </div>
            )}

            {showReview && (
                <div>
                    {error && <div>{error}</div>}
    
                    <h3>Review your order</h3>
                    <CartList order={cartFromStorage} />

                    <button className={styles.button} type="button" onClick={handleBackToForm}>Back</button>
                    <button className={styles.button} type="submit" onClick={handleConfirm}>Confirm</button>
                </div>
            )}
        </div>
    );
};