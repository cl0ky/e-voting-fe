import { useCallback, useImperativeHandle, useRef, useState } from 'react';

export interface DialogRef<T> {
  open: (arg?: Partial<T>) => void;
  close: () => void;
}

export type UseHandleDialogRefProps<T> = T;

const useHandleDialogRef = <T,>({ defaultProps }: { defaultProps: UseHandleDialogRefProps<T> }) => {
  const [state, setState] = useState<UseHandleDialogRefProps<T>>(defaultProps);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<DialogRef<T>>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setState(defaultProps);
    }, 225);
  }, [defaultProps]);

  useImperativeHandle(
    ref,
    () => ({
      open(arg) {
        setState((prev) => ({ ...prev, ...(arg || {}) }));
        setOpen(true);
      },
      close() {
        handleClose();
      },
    }),
    [handleClose],
  );

  return { ref, handleClose, state, setState, open };
};

export default useHandleDialogRef;

export const DialogController = <T,>() =>
  class DialogController {
    static dialogRef: React.RefObject<DialogRef<Partial<Omit<T, 'open'>>>>;
    static setDialogRef = (ref: React.RefObject<DialogRef<Partial<Omit<T, 'open'>>>>) => {
      this.dialogRef = ref;
    };

    static open = (arg?: Partial<Omit<T, 'open'>>) => {
      this.dialogRef.current?.open(arg);
    };

    static close = () => {
      this.dialogRef.current?.close();
    };
  };
