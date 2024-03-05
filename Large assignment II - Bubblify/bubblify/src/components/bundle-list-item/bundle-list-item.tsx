import styles from "./bundle-list-item.module.css";
import { Bundle } from "../../types/bundle";
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
        <div className={styles.bundleListItem}>
            <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex={-1} uk-slideshow="autoplay: true, autoplay-interval: 3000" style={{height: "150px", width: "100%", aspectRatio: "1/1", display: "grid", justifyContent:"center"}}>
                <ul className="uk-slideshow-items" style={{height: "150px", width: "150px"}}>
                    {bubblesList.map((bubble, index) => (
                        bubble && bubble.image ? (
                            <li key={index}>
                                <img style={{height: "150px", width: "150px"}} src={bubble.image} alt={bubble.name} uk-cover="true" />
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
                {bubblesList.map((bubble) => (
                    <div>
                        <p>{bubble?.name}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
};