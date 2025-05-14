import { useParams } from "react-router-dom";
import CertificateView from "./CertificateView";

const CertificateViewWrapper = () => {
  const { id } = useParams();
  return <CertificateView certificateId={id} />;
};

export default CertificateViewWrapper;