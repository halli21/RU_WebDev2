import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartList } from "../cart-list/cart-list";

interface PickupFormProps {
    goBack: () => void;
}

export const PickupForm = ({ goBack } : PickupFormProps) => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showReview, setShowReview] = useState(false);

    const isFormValid = fullName && phoneNumber;

    const handleNext = () => {
        setShowReview(true);
    };

    const handleBackToForm = () => {
        setShowReview(false);
    };

    const handleSubmit = () => {
        navigate('/confirmed');
    };

    return (
        <div>
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
                    <CartList />

                    <button type="button" onClick={handleBackToForm}>Back</button>
                    <button type="submit" onClick={handleSubmit}>Confirm</button>
                </div>
            )}

         
        </div>
    )
}