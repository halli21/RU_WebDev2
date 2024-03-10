import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartList } from "../cart-list/cart-list";
import { submitOrder } from "../../services/bubblify-service";


interface PickupFormProps {
    goBack: () => void;
}

export const PickupForm = ({ goBack } : PickupFormProps) => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showReview, setShowReview] = useState(false);
    const [error, setError] = useState('');

    const isFormValid = fullName && phoneNumber;

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
            {error && <div>{error}</div>}
            {!showReview ? (
                <div>
                <form>
                    <fieldset className="uk-fieldset">

                        <legend className="uk-legend">Pick Up Information</legend>

                        <div className="uk-margin">
                            <input className="uk-input uk-form-width-large" type="text" placeholder="Full Name" aria-label="Input" value={fullName} onChange={e => setFullName(e.target.value)} />
                        </div>

                        <div className="uk-margin">
                            <input className="uk-input uk-form-width-medium" type="text" placeholder="Phone Number" aria-label="Input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                        </div>

                    </fieldset>
                </form>

                <button type="button" onClick={goBack}>Back</button>
                <button type="submit" onClick={handleNext} disabled={!isFormValid}>Next</button>
                </div>
            ) : (
                <div>
                    <h3>Review your order</h3>
                    <CartList order={cartFromStorage} />

                    <button type="button" onClick={handleBackToForm}>Back</button>
                    <button type="submit" onClick={handleConfirm}>Confirm</button>
                </div>
            )}

         
        </div>
    )
}