import { AppProvider } from './context/AppContext';
import { useHeartsCanvas } from './hooks/useHeartsCanvas';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import Controls      from './components/Controls';
import Grid          from './components/Grid';
import FAB           from './components/FAB';
import AddModal      from './components/AddModal';
import DetailModal   from './components/DetailModal';
import PasswordModal from './components/PasswordModal';
import Toast         from './components/Toast';

function AppInner() {
  const canvasRef = useHeartsCanvas();
  return (
    <>
      <canvas id="hc" ref={canvasRef}></canvas>
      <Navbar />
      <Hero />
      <Controls />
      <Grid />
      <FAB />
      <AddModal />
      <DetailModal />
      <PasswordModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
