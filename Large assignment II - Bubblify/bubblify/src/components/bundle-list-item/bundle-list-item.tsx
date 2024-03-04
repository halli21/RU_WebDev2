import styles from "./gallery-list-item.module.css";
// import { Bubble } from "../../types/bubble";
import { useNavigate } from "react-router-dom";

interface BundleListItemProps {
    item: any | undefined;
}

export const BundleListItem = ({ item } : BundleListItemProps) => {



    return (
        <div>
            <p>{item?.name}</p>
            <p>{item?.price}</p>
            <p>{item?.description}</p>
    
        </div>
    );
} ;
