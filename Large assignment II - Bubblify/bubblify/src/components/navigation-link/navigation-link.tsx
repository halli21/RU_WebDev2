import styles from "./navigation-link.module.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

interface NavigationLinkProps {
    title: string;
    href: string;
}

export const NavigationLink = ({
    title,
    href
} : NavigationLinkProps) => (
    <li className={styles.navigationLink}>
        <Link to={href}>{title}</Link>
    </li>
);

NavigationLink.propTypes = {
    // The title of the navigation link
    title: PropTypes.string.isRequired,
    // The URL of the navigation link
    href: PropTypes.string.isRequired
}
