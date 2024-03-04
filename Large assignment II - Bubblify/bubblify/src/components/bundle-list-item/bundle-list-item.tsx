import styles from "./gallery-list-item.module.css";
import { Bundle } from "../../types/bundle";
import { useNavigate } from "react-router-dom";

interface BundleListItemProps {
    item: Bundle | undefined;
}

export const BundleListItem = ({ item } : BundleListItemProps) => {



    return (
        <div>
            <p>{item?.name}</p>
            <p>{item?.items}</p>
           
    
        </div>
    );
} ;
