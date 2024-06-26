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


    const [fullNameDel, setFullNameDel] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumberDel, setPhoneNumberDel] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [fullNamePick, setFullNamePick] = useState('');
    const [phoneNumberPick, setPhoneNumberPick] = useState('');

    const [showReview, setShowReview] = useState(false);
    const [error, setError] = useState('');

    const isDeliveryFormValid = fullNameDel && address && city && phoneNumberDel && postalCode;

    const isPickupFormValid = fullNamePick && phoneNumberPick;


    const handleNext = () => {
        setShowReview(true);
    };

    const handleBackToForm = () => {
        setShowReview(false);
    };

    const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');

    const handleConfirm = async () => {
        let response;

        if (selectedOption === 'pickupform') {
            response = await submitOrder(phoneNumberPick, cartFromStorage);
        } else {
            response = await submitOrder(phoneNumberDel, cartFromStorage);
        }
    
        if (response) {
            let userInfo;

            if (selectedOption === 'pickupform') {
                userInfo = { "fullName": fullNamePick, "phoneNumber": phoneNumberPick };
            } else {
                userInfo = { "fullName": fullNameDel, "phoneNumber": phoneNumberDel };
            }
     
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
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Full Name" aria-label="Input" value={fullNamePick} onChange={e => setFullNamePick(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-medium" type="text" placeholder="Phone Number" aria-label="Input" value={phoneNumberPick} onChange={e => setPhoneNumberPick(e.target.value)} />
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
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Full Name" aria-label="Input" value={fullNameDel} onChange={e => setFullNameDel(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="Address" aria-label="Input" value={address} onChange={e => setAddress(e.target.value)} />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-large" type="text" placeholder="City" aria-label="Input" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                
                                <div className="uk-margin">
                                    <input className="uk-input uk-form-width-medium" type="text" placeholder="Phone Number" aria-label="Input" value={phoneNumberDel} onChange={e => setPhoneNumberDel(e.target.value)} />
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
                    <CartList cart={cartFromStorage} />

                    <button className={styles.button} type="button" onClick={handleBackToForm}>Back</button>
                    <button className={styles.button} type="submit" onClick={handleConfirm}>Confirm</button>
                </div>
            )}
        </div>
    );
};