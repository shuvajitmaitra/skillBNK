import {routes} from '../../constants/Routes';
import ProtectedWebView from '../MockInterview/ProtectedWebView';

const ArchitectureDiagramScreen = () => {
  return (
    <>
      <ProtectedWebView url={routes.ARCHITECTURE_DIAGRAM} />
    </>
  );
};

export default ArchitectureDiagramScreen;
