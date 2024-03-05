import styles from "./bundle-list-item.module.css";
import { Bundle } from "../../types/bundle";
import { useNavigate } from "react-router-dom";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";


interface BundleListItemProps {
    item: Bundle | undefined;
}

export const BundleListItem = ({ item } : BundleListItemProps) => {
    const bubbleIds = item?.items ?? [];
    const bubblesList = useBundleBubbles(bubbleIds);

    const bundlePrice = bubblesList.reduce((total, bubble) => {
        return total + (bubble?.price || 0);
    }, 0);


    return (
        <div>
            <h2>{item?.name}</h2>
            <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex={-1} uk-slideshow="true">

                <ul className="uk-slideshow-items">
                    {bubblesList.map((bubble, index) => (
                        bubble && bubble.image ? (
                            <li key={index}>
                                <img src={bubble.image} alt={bubble.name} uk-cover="true" />
                            </li>
                        ) : null
                    ))}
                </ul>

                <a className="uk-position-center-left uk-position-small uk-hidden-hover" uk-slidenav-previous="true" uk-slideshow-item="previous"></a>
                <a className="uk-position-center-right uk-position-small uk-hidden-hover" uk-slidenav-next="true" uk-slideshow-item="next"></a>

            </div>

            <p>This bundle includes:</p>
            {bubblesList.map((bubble) => (
                <div>
                    <p>{bubble?.name}</p>
                </div>
            ))}
            <p>{bundlePrice} kr</p>
           
        </div>
    );
};
