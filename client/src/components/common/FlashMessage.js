import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const FlashMessage = ({ message, variant, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      onClose && onClose();
    }, 1000); 

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <Alert variant={variant} show={show} onClose={() => setShow(false)} dismissible>
      {message}
    </Alert>
  );
};

export default FlashMessage;