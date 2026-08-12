import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveFloorMap } from './InteractiveFloorMap';
import { useArena } from '../../context/ArenaContext';

interface Scene3DProps {
  onRoomSelect?: (roomId: string) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ onRoomSelect }) => {
  const { selectRoom, setShowExitModal } = useArena();
  const navigate = useNavigate();

  const handleSelectRoom = (roomId: string) => {
    if (onRoomSelect) {
      onRoomSelect(roomId);
      return;
    }
    selectRoom(roomId);
    if (roomId === 'entry') {
      setShowExitModal(true);
    } else if (roomId === 'kitchen') {
      navigate('/kitchen');
    } else if (roomId === 'reception') {
      navigate('/reception');
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  return <InteractiveFloorMap onSelectRoom={handleSelectRoom} />;
};
