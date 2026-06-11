declare module 'clipboard-event' {
  interface ClipboardListener {
    startListening(): void;
    stopListening(): void;
    on(event: 'change', callback: (value: string) => void): void;
  }

  const clipboardListener: ClipboardListener;
  export default clipboardListener;
}