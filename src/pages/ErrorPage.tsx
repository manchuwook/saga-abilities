import { Container, Title, Text, Button, Group, useMantineColorScheme, Paper } from '@mantine/core';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  let errorMessage = 'An unexpected error has occurred.';
    if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText ?? 'Unknown error';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return (
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
            onClick={() => navigate('/')} 
            color={isDark ? 'blue.4' : 'blue.6'}
          >
            Back to Home
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
