import { useLocation } from "react-router-dom";

export default function Placeholder() {
  const location = useLocation();
  return (
    <div className="container" style={{ padding: '4rem 0', minHeight: '60vh' }}>
      <h1>{location.pathname}</h1>
      <p>This page is currently being migrated to React.</p>
    </div>
  );
}
