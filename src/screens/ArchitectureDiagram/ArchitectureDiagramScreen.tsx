import environment from '../../constants/environment';
import ProtectedWebView from '../MockInterview/ProtectedWebView';
const url = `${environment.FRONTEND_URL}/diagram`;

const ArchitectureDiagramScreen = () => {
  return (
    <>
      <ProtectedWebView url={url} />
    </>
  );
};

export default ArchitectureDiagramScreen;
