import React from 'react';
import environment from '../../constants/environment';
import ProtectedWebView from './ProtectedWebView';
const url = `${environment.FRONTEND_URL}/mockinterview`;

const MockInterview = () => {
  return (
    <>
      <ProtectedWebView url={url} />
    </>
  );
};

export default MockInterview;
