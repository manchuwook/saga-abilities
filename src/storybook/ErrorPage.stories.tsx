import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';
import { expect } from '@storybook/test';
import { Container, Title, Text, Button, Group, Paper, MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { baseTheme } from '../theme/mantineTheme';

// Create a color scheme manager for Storybook
const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-abilities-storybook-color-scheme' });

// Interface for our Story component
interface ErrorPageStoryProps {
  isDark?: boolean;
}

// Instead of using the actual ErrorPage component which depends on React Router,
// let's create a simplified version for Storybook that doesn't use router hooks
const ErrorPageStory = ({ isDark = false }: ErrorPageStoryProps) => {
  const errorMessage = 'An unexpected error has occurred.';

  return (
    <MantineProvider theme={baseTheme} defaultColorScheme={isDark ? 'dark' : 'light'} colorSchemeManager={colorSchemeManager}>
      <Container size="md" py="xl">
        <Paper
          p="xl"
          radius="md"
          withBorder
          bg={isDark ? 'dark.6' : 'white'}
          style={{ borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)' }}
        >
          <Title order={1} ta="center" mb="xl" c={isDark ? 'gray.1' : 'dark.8'}>Oops!</Title>
          <Text ta="center" size="lg" mb="xl" c={isDark ? 'gray.2' : 'dark.7'}>Something went wrong.</Text>
          <Text ta="center" c={isDark ? 'gray.5' : 'dimmed'} mb="xl">{errorMessage}</Text>
          <Group justify="center">
            <Button
              onClick={() => console.log('Navigate to home')}
              color={isDark ? 'blue.4' : 'blue.6'}
            >
              Back to Home
            </Button>
          </Group>
        </Paper>
      </Container>
    </MantineProvider>
  );
};

const meta: Meta<typeof ErrorPageStory> = {
  component: ErrorPageStory,
  title: 'Pages/ErrorPage',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isDark: {
      control: 'boolean',
      description: 'Whether to display in dark mode',
    }
  }
};

export default meta;
type Story = StoryObj<typeof ErrorPageStory>;

// Light mode error story
export const Light: Story = {
  args: {
    isDark: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Oops!')).toBeTruthy();
    expect(canvas.getByText('Something went wrong.')).toBeTruthy();
    expect(canvas.getByText('An unexpected error has occurred.')).toBeTruthy();
  },
};

// Dark mode error story
export const Dark: Story = {
  args: {
    isDark: true
  },
  parameters: {
    backgrounds: { default: 'dark' }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Oops!')).toBeTruthy();
    expect(canvas.getByText('Something went wrong.')).toBeTruthy();
    expect(canvas.getByText('An unexpected error has occurred.')).toBeTruthy();
  },
};
