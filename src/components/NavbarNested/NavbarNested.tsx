import { useEffect, useRef } from 'react';
import { ScrollArea } from '@mantine/core';
import {
    IconNotes,
    IconBook,
} from '@tabler/icons-react';
import classes from './NavbarNested.module.css';
import { LinksGroup } from './NavbarLinksGroup';
import { UserButton } from './UserButton';
import { useLocation } from 'react-router-dom';
import { useAbilityManuals } from '../../hooks/useAbilityManuals';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeCustomizer } from '../ThemeCustomizer';
import { useState } from 'react';

/**
 * Default navigation items structure
 * This serves as a template for the navigation menu
 */
const mockdata = [
    {
        label: 'Abilities Library',
        icon: IconNotes,
        link: '/',
        exact: true,
        ariaLabel: 'Go to Abilities Library'
    },
    {
        label: 'Ability Manuals',
        icon: IconBook,
        initiallyOpened: true,
        isManuals: true,
        ariaLabel: 'Ability Manuals navigation group'
        // Will be replaced dynamically with actual manuals
    },
];

/**
 * Props for the NavbarNested component
 * @interface NavbarNestedProps
 */
export interface NavbarNestedProps {
    /** Whether the navbar is opened/expanded */
    opened: boolean;
    /** Custom header component to be displayed at the top of the navbar */
    headerComponent?: React.ReactNode;
    /** Custom footer component to be displayed at the bottom of the navbar instead of the default UserButton */
    footerComponent?: React.ReactNode;
    /** Whether to show the user info section at the bottom */
    showUserInfo?: boolean;
    /** Custom styles to apply to the navbar container */
    customStyle?: React.CSSProperties;
}

/**
 * NavbarNested component displays a collapsible navigation sidebar with support for nested links
 * @param props - Component props
 * @returns React component
 */
export function NavbarNested({
    opened = true, // Default to opened
    headerComponent,
    footerComponent,
    showUserInfo = true,
    customStyle = {} // Initialize with empty object to avoid undefined error
}: NavbarNestedProps) {
    const location = useLocation();
    const { AbilityManuals } = useAbilityManuals();
    const [themeSettingsOpened, setThemeSettingsOpened] = useState(false);
    const path = location.pathname;
    const navRef = useRef<HTMLElement>(null);

    // Set up keyboard focus trap for accessibility
    useEffect(() => {
        if (!opened || !navRef.current) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // Typically would close the navbar here, but that's handled by App component
                document.getElementById('main-content')?.focus();
            }
        };

        navRef.current.addEventListener('keydown', handleKeyDown);
        return () => {
            navRef.current?.removeEventListener('keydown', handleKeyDown);
        };
    }, [opened]);

    // Enhance the mockdata with dynamic links for ability manuals
    const links = mockdata.map((item) => {
        if (item.isManuals) {
            const manualLinks = AbilityManuals.map((manual) => ({
                label: manual.name,
                link: `/AbilityManuals/${manual.id}`,
                exact: false
            }));

            return {
                ...item,
                links: [
                    { label: 'All Manuals', link: '/AbilityManuals', exact: true },
                    ...manualLinks
                ]
            };
        }
        return item;
    });

    const items = links.map((item) => (
        <LinksGroup
            {...item}
            key={item.label}
            activePath={path}
        />
    ));    // Apply conditional classes based on the opened state
    const navbarClassName = opened ? classes.navbar : `${classes.navbar} ${classes.closed}`; return (
        <nav
            className={navbarClassName}
            ref={navRef}
            style={customStyle}
            role="navigation"
            aria-label="Main Navigation"
            tabIndex={-1}
        >
            {headerComponent && (
                <div className={classes.header}>
                    {headerComponent}
                </div>
            )}
            <ScrollArea className={classes.links} scrollbarSize={6}>
                <div className={classes.linksInner} role="tree" aria-label="Navigation Menu">{items}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <div className={classes.footerContainer}>
                    <div className={classes.footerLeft}>
                        {footerComponent || (showUserInfo && <UserButton />)}
                    </div>
                    <div className={classes.footerRight}>
                        <ThemeCustomizer opened={themeSettingsOpened} />
                        <ThemeToggle onToggle={() => setThemeSettingsOpened(!themeSettingsOpened)} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
