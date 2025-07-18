import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import classes from './NavbarLinksGroup.module.css';

/**
 * Properties for links that are displayed within a LinksGroup
 */
interface LinkItem {
    label: string;
    link: string;
    exact: boolean;
    icon?: React.FC<any>;
    description?: string;
}

/**
 * Properties for the LinksGroup component
 */
interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    initiallyOpened?: boolean;
    isManuals?: boolean;
    links?: LinkItem[];
    link?: string;
    exact?: boolean;
    activePath: string;
    iconColor?: string;
    ariaLabel?: string;
}

/**
 * LinksGroup component that displays a collapsible group of navigation links
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
    const isActive = link ? isActiveMain : isActiveGroup;
    const ChevronIcon = opened ? IconChevronDown : IconChevronRight;

    // Keyboard accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            setOpened((o) => !o);
        }
    };

    const items = (hasLinks ? links : []).map((linkItem) => (
        <NavLink
            className={classes.link}
            to={linkItem.link}
            key={linkItem.label}
            aria-label={linkItem.description || linkItem.label}
            end={linkItem.exact}
        >
            {linkItem.icon && (
                <Icon
                    style={{ width: rem(16), height: rem(16), marginRight: rem(8) }}
                    stroke={1.5}
                />
            )}
            <Text component="span" className={classes.linkLabel}>
                {linkItem.label}
            </Text>
        </NavLink>
    ));

    return (
        <>
            {hasLinks ? (
                <UnstyledButton
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
                            <Text fw={isActiveGroup ? 600 : 400} className={classes.label} id={`${label.replace(/\s+/g, '-').toLowerCase()}-heading`}>
                                {label}
                            </Text>
                        </Box>
                        {hasLinks && (
                            <ChevronIcon
                                className={classes.chevron}
                                style={{ width: rem(16), height: rem(16), transform: opened ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                stroke={1.5}
                            />
                        )}
                    </Group>
                </UnstyledButton>
            ) : (
                <NavLink
                    to={link || '#'}
                    className={classes.control}
                    aria-label={ariaLabel || label}
                    end={!!exact}
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
                </NavLink>
            )}
            {hasLinks && (
                <Collapse in={opened}>
                    <div
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
