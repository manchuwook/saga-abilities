import { Modal, ModalProps, useMantineColorScheme } from '@mantine/core';
import { ReactNode } from 'react';
import { useStyles } from '../../hooks/useStyles';

type SafeModalProps<T> = {
  /**
   * The data to be displayed in the modal
   */
  data: T | null;

  /**
   * Whether the modal is opened
   */
  opened: boolean;

  /**
   * Function to close the modal
   */
  onClose: () => void;

  /**
   * Function to render the title of the modal with the data
   */
  title: (data: T) => ReactNode;

  /**
   * Function to render the content of the modal with the data
   * or direct children to be rendered
   */
  children: ((data: T) => ReactNode) | ReactNode;
} & Omit<ModalProps, 'opened' | 'onClose' | 'title' | 'children'>;

/**
 * A wrapper component for modals that handles null data automatically.
 * This ensures the modal is only rendered when data is present.
 */
export function SafeModal<T>({
  data,
  opened,
  onClose,
  title,
  children,
  ...rest
}: SafeModalProps<T>) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { modalStyles } = useStyles();

  // Only render the modal when data is not null and opened is true
  if (!data) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title(data)}
      overlayProps={modalStyles.overlayProps}
      styles={{
        header: modalStyles.header,
        content: modalStyles.content,
        close: modalStyles.close,
        body: modalStyles.body,
      }}
      {...rest}
    >
      {typeof children === 'function' ? children(data) : children}
    </Modal>
  );
}