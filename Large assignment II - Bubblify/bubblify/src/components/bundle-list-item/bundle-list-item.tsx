import styles from "./bundle-list-item.module.css";
import { Bundle } from "../../types/bundle";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


interface BundleListItemProps {
    item: Bundle;
}

export const BundleListItem = ({ item } : BundleListItemProps) => {
    const navigate = useNavigate();
    const bubbleIds = item?.items;
    const bubblesList = useBundleBubbles(bubbleIds);
    const [buttonState, setButtonState] = useState('addToCart');

    const bundlePrice = bubblesList.reduce((total, bubble) => {
        return total + (bubble?.price || 0);
    }, 0);


    const addToCart = (bundle: Bundle) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        cart.bundles.push(bundle);
        localStorage.setItem('cart', JSON.stringify(cart));
        setButtonState('goToCheckout');

        
        setTimeout(() => {
            setButtonState('addToCart');
        }, 5000);
    };

    
    return (
        <div className={styles.bundleListItem}>
            <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex={-1} uk-slideshow="autoplay: true, autoplay-interval: 3000" style={{height: "125px", width: "100%", aspectRatio: "1/1", display: "grid", justifyContent:"center"}}>
                <ul className="uk-slideshow-items" style={{height: "125px", width: "125px"}}>
                    {bubblesList.map((bubble, index) => (
                        bubble && bubble.image ? (
                            <li key={index}>
                                <img style={{height: "125px", width: "125px"}} src={bubble.image} alt={bubble.name} uk-cover="true" />
                            </li>
                        ) : null
                    ))}
                </ul>

                <a className="uk-position-center-left uk-position-small" uk-slidenav-previous="true" uk-slideshow-item="previous" style={{color: "gray"}}></a>
                <a className="uk-position-center-right uk-position-small" uk-slidenav-next="true" uk-slideshow-item="next" style={{color: "gray"}}></a>
            </div>


            <div className={styles.heading}>
                <h2>{item?.name}</h2>
                <p>{bundlePrice} kr</p>
            </div>
                            
            <div className={styles.includes}>
                <p>This bundle includes:</p>
                {bubblesList.map((bubble, index) => (
                    <ul key={index}>
                        <li>{bubble?.name}</li> 
                    </ul>
                ))}
            </div>
            

            {buttonState === 'addToCart' ? (
                <button className={styles.cart} onClick={(e) => {
                    e.stopPropagation();
                    if (item) {
                        addToCart(item);
                    }
                }}>Add to cart</button>
            ) : (
                <button className={styles.cart} onClick={(e) => {
                    e.stopPropagation();
                    navigate('/checkout');
                }}>
                    Go to checkout
                </button>
            )}
        </div>
    );
};


BundleListItem.propTypes = {
    // This is the bundle item which should be displayed in the component
    item: PropTypes.shape({
        // Unique identifier for the bundle
        id: PropTypes.number.isRequired,
        // Name of the bundle
        name: PropTypes.string.isRequired,
        // Array of bubble ids that are included in the bundle
        items: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
};
