import Confetti from 'react-confetti';

const DEVICE_WIDTH = window.innerWidth;
const DEVICE_HEIGHT = window.innerHeight;

function ConfettiContainer({ showConfetti, setShowConfetti }) {
  return (
    <>
      {showConfetti && (
        <Confetti
          width={DEVICE_WIDTH}
          numberOfPieces={2000}
          height={DEVICE_HEIGHT}
          tweenDuration={1000}
          recycle={false}
        />
      )}
    </>
  );
}

export default ConfettiContainer;
