import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PickupFormProps {
    goBack: () => void;
}

export const PickupForm = ({ goBack } : PickupFormProps) => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const isFormValid = fullName && phoneNumber;

    const handleSubmit = () => {
        navigate('/review');
    };

    return (
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
            <button type="submit" onClick={handleSubmit} disabled={!isFormValid}>Submit</button>
        </div>
    )
}