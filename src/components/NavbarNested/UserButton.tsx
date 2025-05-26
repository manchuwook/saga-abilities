import { UnstyledButton, Group, Avatar, Text, Badge, rem } from '@mantine/core';
import classes from './UserButton.module.css';
import { useMantineColorScheme } from '@mantine/core';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeCustomizer } from '../ThemeCustomizer';
import { useState } from 'react';


/**
 * Props for the UserButton component
 * @interface UserButtonProps
 */
interface UserButtonProps {
    /** Main name or title to display */
    name?: string;
    /** Secondary description text */
    description?: string;
    /** Avatar image URL */
    avatarUrl?: string;
    /** Initials to show when no avatar image is available */
    initials?: string;
    /** Version badge text */
    version?: string;
    /** Custom action when the button is clicked */
    onClick?: () => void;
    /** Custom style to apply to the component */
    style?: React.CSSProperties;
}

/**
 * UserButton displays user information at the bottom of the navbar
 * @param props - Component properties
 * @returns React component
 */
export function UserButton({
    name = 'SAGA Abilities',
    description = 'Tabletop RPG Manager',
    avatarUrl,
    initials = 'SA',
    version = 'v1.0.0',
    onClick,
    style
}: UserButtonProps = {}) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const { colors } = useTheme();
    const [themeSettingsOpened, setThemeSettingsOpened] = useState(false);

    // Use the accent color from theme
    const accentColor = colors?.accentColor || (isDark ? 'blue.4' : 'blue.6');

    return (
        <UnstyledButton
            className={classes.user}
            onClick={onClick}
            style={style}
            aria-label={`User information: ${name}`}
        >
            <Group>
                <Avatar
                    src={avatarUrl}
                    radius="xl"
                    color={accentColor}
                    alt={`${name} avatar`}
                >
                    {initials}
                </Avatar>
                <div style={{ flex: 1 }}>
                    <Group justify="space-between" wrap="nowrap" gap="xs">
                        <Text size="sm" fw={500}>
                            {name}
                        </Text>
                        {version && (
                            <Badge size="sm" variant="light" color={accentColor}>
                                {version}
                            </Badge>
                        )}
                    </Group>

                    {description && (
                        <Text c="dimmed" size="xs">
                            {description}
                        </Text>
                    )}
                </div>
            </Group>
        </UnstyledButton>
    );
}
