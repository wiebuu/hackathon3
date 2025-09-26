declare module 'react-qr-reader' {
    import * as React from 'react';
  
    interface QrReaderProps {
      delay?: number | false;
      onError?: (error: any) => void;
      onScan?: (data: string | null) => void;
      style?: React.CSSProperties;
      facingMode?: 'user' | 'environment';
    }
  
    export default class QrReader extends React.Component<QrReaderProps> {}
  }
  