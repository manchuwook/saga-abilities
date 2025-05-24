import React, { useState } from 'react';
import { 
  Button, 
  Stack, 
  Title, 
  Group,
  Paper,
  Accordion,
  Switch,
  Slider,
  SegmentedControl,
  useMantineColorScheme,
  Select
} from '@mantine/core';
import { useTheme } from '../context/ThemeContext';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

interface ThemeCustomizerProps {
  opened: boolean;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ opened }) => {
  const { colors, updateTheme, resetTheme } = useTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // Create a form state that mirrors the current theme
  const [formValues, setFormValues] = useState({
    primaryColor: colors.primaryColor,
    accentColor: colors.accentColor,
    borderRadius: colors.borderRadius,
    fontScale: colors.fontScale,
    imageEnabled: colors.imageEnabled
  });

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateTheme(formValues);
  };

  const primaryColorOptions = [
    { value: 'blue.6', label: 'Blue' },
    { value: 'teal.6', label: 'Teal' },
    { value: 'green.6', label: 'Green' },
    { value: 'brown.5', label: 'Brown' },
    { value: 'amber.6', label: 'Amber' },
    { value: 'red.6', label: 'Red' },
    { value: 'pink.6', label: 'Pink' },
    { value: 'purple.6', label: 'Purple' }
  ];

  return (
    <Paper 
      p="md" 
      withBorder 
      shadow="sm" 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000, 
        maxWidth: '400px',
        display: opened ? 'block' : 'none'
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={4}>Theme Settings</Title>
        <Group>
          <Switch 
            checked={colorScheme === 'dark'}
            onChange={() => toggleColorScheme()}
            size="md"
            onLabel={<IconMoonStars size={16} />}
            offLabel={<IconSun size={16} />}
          />
          <Button onClick={resetTheme} color="red" variant="outline" size="xs">
            Reset
          </Button>
        </Group>
      </Group>

      <Stack gap="md">
        <Accordion defaultValue="colors">
          <Accordion.Item value="colors">
            <Accordion.Control>Colors</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">                  
                <Select
                  label="Primary Color"
                  value={formValues.primaryColor}
                  onChange={(value) => handleChange('primaryColor', value ?? 'blue.6')}
                  data={primaryColorOptions}
                />
                
                <Select
                  label="Accent Color"
                  value={formValues.accentColor}
                  onChange={(value) => handleChange('accentColor', value ?? 'blue.6')}
                  data={primaryColorOptions}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="appearance">
            <Accordion.Control>Appearance</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <SegmentedControl
                  value={formValues.imageEnabled ? 'enabled' : 'disabled'}
                  onChange={(value) => handleChange('imageEnabled', value === 'enabled')}
                  data={[
                    { label: 'No background image', value: 'disabled' },
                    { label: 'Parchment background', value: 'enabled' },
                  ]}
                  fullWidth
                />
                
                <div>
                  <p>Border Radius</p>
                  <Slider
                    value={formValues.borderRadius}
                    onChange={(value) => handleChange('borderRadius', value)}
                    min={0}
                    max={8}
                    step={1}
                    label={(value) => `${value}px`}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 4, label: '4' },
                      { value: 8, label: '8' },
                    ]}
                  />
                </div>
                
                <div>
                  <p>Font Size</p>
                  <Slider
                    value={formValues.fontScale}
                    onChange={(value) => handleChange('fontScale', value)}
                    min={0.8}
                    max={1.2}
                    step={0.05}
                    label={(value) => `${value}x`}
                    marks={[
                      { value: 0.8, label: 'S' },
                      { value: 1, label: 'M' },
                      { value: 1.2, label: 'L' },
                    ]}
                  />
                </div>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        
        <Button onClick={handleSave} mt="md">
          Apply Changes
        </Button>
      </Stack>
    </Paper>
  );
};
