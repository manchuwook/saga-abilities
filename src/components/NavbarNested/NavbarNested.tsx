import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@mantine/core';
import { IconNotes, IconBook } from '@tabler/icons-react';
import classes from './NavbarNested.module.css';
import { LinksGroup } from './NavbarLinksGroup';
import { UserButton } from './UserButton';
import { useLocation } from 'react-router-dom';
import { useAbilityManuals } from '../../hooks/useAbilityManuals';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeCustomizer } from '../ThemeCustomizer';

const NAV_ITEMS = [
    {
        label: 'Abilities Library',
        icon: IconNotes,
        link: '/',
        exact: true,
        ariaLabel: 'Go to Abilities Library',
    },
    {
        label: 'Ability Manuals',
        icon: IconBook,
        initiallyOpened: true,
        isManuals: true,
        ariaLabel: 'Ability Manuals navigation group',
    },
];

export interface NavbarNestedProps {
    opened: boolean;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    showUserInfo?: boolean;
}

export function NavbarNested({
    opened = true,
    headerComponent,
    footerComponent,
    showUserInfo = true,
}: NavbarNestedProps) {
    const location = useLocation();
    const { AbilityManuals } = useAbilityManuals();
    const [themeSettingsOpened, setThemeSettingsOpened] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    // Accessibility: focus trap
    useEffect(() => {
        if (!opened || !navRef.current) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                document.getElementById('main-content')?.focus();
            }
        };
        navRef.current.addEventListener('keydown', handleKeyDown);
        return () => {
            navRef.current?.removeEventListener('keydown', handleKeyDown);
        };
    }, [opened]);

    // Build navigation links
    const links = NAV_ITEMS.map((item) => {
        if (item.isManuals) {
            const manualLinks = AbilityManuals.map((manual) => ({
                label: manual.name,
                link: `/AbilityManuals/${manual.id}`,
                exact: false,
            }));
            return {
                ...item,
                links: [
                    { label: 'All Manuals', link: '/AbilityManuals', exact: true },
                    ...manualLinks,
                ],
            };
        }
        return item;
    });

    const items = links.map((item) => (
        <LinksGroup
            {...item}
            key={item.label}
            activePath={location.pathname}
        />
    ));

    const navbarClassName = opened ? classes.navbar : `${classes.navbar} ${classes.closed}`;

    return (
        <nav
            className={navbarClassName}
            ref={navRef}
            role="navigation"
            aria-label="Main Navigation"
            tabIndex={-1}
        >
            {headerComponent && <div className={classes.header}>{headerComponent}</div>}
            <ScrollArea className={classes.links} scrollbarSize={6}>
                <div className={classes.linksInner} aria-label="Navigation Menu">
                    {items}
                </div>
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
