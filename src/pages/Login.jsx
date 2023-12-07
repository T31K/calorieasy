import { useState } from 'react';
import Icon from '../assets/icon.png';
import Loading from '../components/Loading';
import { IonPage, IonContent } from '@ionic/react';

function Login({ createUser, isNew }) {
  const [isCreating, setIsCreating] = useState(false);

  const handleGetStarted = () => {
    setIsCreating(true);
    createUser();
  };

  return (
    <IonPage>
      <IonContent>
        <section className="h-[100vh] py-24 bg-[#EAF0E0]">
          <div className="flex flex-col items-center justify-center pb-20">
            <div className={`${!isNew && 'invisible'} flex flex-col items-center justify-center`}>
              <h1 className="text-4xl font-bold tracking-tight mt-[150px] mb-3 text-stone-900">Welcome!</h1>
              <div className="font-semibold tracking-tight text-xl text-stone-700 mb-4">Track calories in seconds!</div>
            </div>
            <div className="flex flex-col items-center justify-center pb-20 h-[300px]">
              <img
                src={Icon}
                alt=""
                className="w-[220px]"
              />
            </div>
            <div className="text-xl text-center font-medium w-[250px] mt-12 tracking-tight mb-16 text-stone-900">
              <div className={`${!isNew && 'invisible'}`}>
                <button
                  className="bg-gray-300 w-[150px] text-center active:bg-gray-400 font-bold py-2 px-4 rounded-lg"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
          <Loading showSpinner={isCreating} />
        </section>
      </IonContent>
    </IonPage>
  );
}

export default Login;
