import { IonLoading } from '@ionic/react';

function Loading({ showSpinner }) {
  return (
    <>
      <IonLoading
        isOpen={showSpinner}
        trigger="open-loading"
        spinner="dots"
      />
    </>
  );
}

export default Loading;
