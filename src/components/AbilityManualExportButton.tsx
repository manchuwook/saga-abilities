import { Button, Popover, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { IconPrinter, IconDownload } from '@tabler/icons-react';
import { AbilityManual } from '../context/AbilityManualsContext';
import { exportAbilityManualToPDF } from '../lib/pdfExport.enhanced';

interface AbilityManualExportButtonProps {
  AbilityManual: AbilityManual;
  label?: string;
}

export function AbilityManualExportButton({ AbilityManual, label = 'Export' }: AbilityManualExportButtonProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleExportToPDF = () => {
    exportAbilityManualToPDF(AbilityManual);
  };

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          leftSection={<IconPrinter size={16} />}
          variant="outline"
          color={isDark ? 'blue.4' : 'blue.6'}
        >
          {label}
        </Button>
      </Popover.Target>
      <Popover.Dropdown bg={isDark ? 'dark.6' : 'white'}>
        <Stack gap="xs">
          <Text size="sm" fw={500} c={isDark ? 'gray.1' : 'dark.8'}>Export Options</Text>
          <Button 
            variant="light" 
            leftSection={<IconDownload size={16} />}
            onClick={handleExportToPDF}
            color={isDark ? 'blue.4' : 'blue.6'}
            fullWidth
          >
            Export to PDF
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
