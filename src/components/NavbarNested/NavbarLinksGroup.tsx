import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './NavbarLinksGroup.module.css';

/**
 * Properties for links that are displayed within a LinksGroup
 * @interface LinkItem
 */
interface LinkItem {
    /** Display text for the link */
    label: string;
    /** URL the link points to */
    link: string;
    /** Whether the link should match the route exactly or use startsWith */
    exact: boolean;
    /** Optional icon for the link */
    icon?: React.FC<any>;
    /** Optional description for the link (for accessibility) */
    description?: string;
}

/**
 * Properties for the LinksGroup component
 * @interface LinksGroupProps
 */
interface LinksGroupProps {
    /** Icon component to display with the group label */
    icon: React.FC<any>;
    /** Display text for the group */
    label: string;
    /** Whether the group should start open */
    initiallyOpened?: boolean;
    /** Flag to indicate if this is the manuals section */
    isManuals?: boolean;
    /** Array of link items contained in this group */
    links?: LinkItem[];
    /** Optional direct link for the group itself (makes it clickable) */
    link?: string;
    /** Whether the active path should match exactly */
    exact?: boolean;
    /** Current active path from router */
    activePath: string;
    /** Custom color for the icon (defaults to theme primary color) */
    iconColor?: string;
    /** ARIA label for improved accessibility */
    ariaLabel?: string;
}

/**
 * LinksGroup component that displays a collapsible group of navigation links
 * @param props - Component props 
 * @returns React component
 */
export function LinksGroup({
    icon: Icon,
    label,
    initiallyOpened,
    links,
    link,
    exact,
    activePath,
    iconColor,
    ariaLabel
}: LinksGroupProps) {
    const [opened, setOpened] = useState(initiallyOpened || false);
    const hasLinks = Array.isArray(links) && links.length > 0;
    const isActiveMain = link && (exact ? activePath === link : activePath.startsWith(link));
    const isActiveGroup = hasLinks && links.some(item =>
        item.exact ? activePath === item.link : activePath.startsWith(item.link)
    );

    // Determine if group or link is active
    const isActive = link ? isActiveMain : isActiveGroup;

    const ChevronIcon = opened ? IconChevronDown : IconChevronRight;

    // Handle keyboard navigation for accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Toggle group on Space or Enter
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            setOpened((o) => !o);
        }
    };

    const items = (hasLinks ? links : []).map((linkItem) => {
        const isChildActive = linkItem.exact
            ? activePath === linkItem.link
            : activePath.startsWith(linkItem.link);

        return (
            <Link
                className={classes.link}
                to={linkItem.link}
                key={linkItem.label}
                data-active={isChildActive || undefined} aria-label={linkItem.description || linkItem.label}
            >
                {linkItem.icon && (
                    <Icon
                        style={{ width: rem(16), height: rem(16), marginRight: rem(8) }}
                        stroke={1.5}
                    />
                )}
                <Text
                    component="span"
                    className={classes.linkLabel}
                    fw={isChildActive ? 600 : undefined}
                >
                    {linkItem.label}
                </Text>
            </Link>
        );
    }); return (
        <>
            {hasLinks ? (<UnstyledButton
                onClick={() => setOpened((o) => !o)}
                onKeyDown={handleKeyDown}
                className={classes.control}
                data-active={isActiveGroup || undefined}
                aria-label={ariaLabel || `Toggle ${label} navigation group`}
                aria-expanded={opened}
                aria-controls={`links-group-${label.replace(/\s+/g, '-').toLowerCase()}`}
                role="button"
                tabIndex={0}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon
                            variant="light"
                            size={28}
                            className={classes.icon}
                            color={iconColor}
                        >
                            <Icon style={{ width: rem(16), height: rem(16) }} />
                        </ThemeIcon>
                        <Text fw={isActiveGroup ? 600 : 400} className={classes.label} id={`${label.replace(/\s+/g, '-').toLowerCase()}-heading`}>{label}</Text>
                    </Box>
                    {hasLinks && (
                        <ChevronIcon
                            className={classes.chevron}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(0deg)' : 'rotate(-90deg)'
                            }}
                            stroke={1.5}
                        />
                    )}
                </Group>
            </UnstyledButton>
            ) : (
                <Link
                    to={link || '#'}
                    className={classes.control}
                    data-active={isActive || undefined}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={ariaLabel || label}
                >
                    <Group justify="space-between" gap={0}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                            <ThemeIcon
                                variant="light"
                                size={28}
                                className={classes.icon}
                                color={iconColor}
                            >
                                <Icon style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                            <Text fw={isActive ? 600 : 400} className={classes.label}>{label}</Text>
                        </Box>
                    </Group>
                </Link>
            )}
            {hasLinks && (
                <Collapse in={opened}>                    <div
                    className={classes.links}
                    id={`links-group-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    role="group"
                    aria-labelledby={`${label.replace(/\s+/g, '-').toLowerCase()}-heading`}
                >
                    {items}
                </div>
                </Collapse>
            )}
        </>
    );
}
