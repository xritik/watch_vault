import { useApp } from '../context/AppContext';

export default function FAB() {
  const { setShowAddModal, setEditItem } = useApp();

  const open = () => {
    setEditItem(null);
    setShowAddModal(true);
  };

  return (
    <button className="fab" id="fabBtn" title="Add title" onClick={open}>＋</button>
  );
}
