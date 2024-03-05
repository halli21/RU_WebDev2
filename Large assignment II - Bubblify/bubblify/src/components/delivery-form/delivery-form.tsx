import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DeliveryFormProps {
    goBack: () => void;
}

export const DeliveryForm = ({ goBack } : DeliveryFormProps) => {
    const navigate = useNavigate();


    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const isFormValid = fullName && address && city && phoneNumber && postalCode;


    const handleSubmit = () => {
        navigate('/review');
    };

    
    return (
        <div>
            <form>
                <fieldset className="uk-fieldset">

                    <legend className="uk-legend">Delivery</legend>

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

            <button type="button" onClick={goBack}>Back</button>
            <button type="submit" onClick={handleSubmit} disabled={!isFormValid}>Submit</button>
          
        </div>
    )
}