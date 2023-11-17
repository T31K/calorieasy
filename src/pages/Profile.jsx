import { useAuth0 } from '@auth0/auth0-react';
import { IonPage } from '@ionic/react';
import { IonBadge, IonItem, IonLabel } from '@ionic/react';

const Profile = ({ userData }) => {
  const { user } = useAuth0();
  return (
    <IonPage>
      <div className="container h-[90vh] pt-12 pb-6 flex flex-col justify-start gap-4">
        <div className="flex gap-2 items-center">
          <img
            src={user.picture}
            className="rounded-full w-[30px]"
          />
          <div className="font-semibold tracking-tight font-xl">{user.name}</div>
        </div>
        <div className="flex gap-2 items-center">
          Premium:
          <IonBadge color={userData?.premium ? 'success' : 'danger'}>{userData?.premium ? 'True' : 'False'}</IonBadge>
        </div>
        <div>Upgrade to premium!</div>
      </div>
    </IonPage>
  );
};

export default Profile;
