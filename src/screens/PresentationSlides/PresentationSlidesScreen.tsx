import React from 'react';
import ProtectedWebView from '../MockInterview/ProtectedWebView';
import {routes} from '../../constants/Routes';

const PresentationSlidesScreen = () => {
  return <ProtectedWebView url={routes.PRESENTATION_SLIDES} />;
};

export default PresentationSlidesScreen;
