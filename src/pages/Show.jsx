import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation, useParams } from 'react-router';
import { chevronBackOutline, trashOutline } from 'ionicons/icons';
import { IonContent, IonIcon, IonHeader, IonTitle, IonToolbar, IonPage, IonAlert } from '@ionic/react';
import Loading from '../components/Loading';
const serverDeleteUrl = import.meta.env.VITE_SERVER_DELETE_URL;

const Logs = ({ foodData }) => {
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (location && foodData) {
      setIsLoading(true);
      const item = findArrayWithId(foodData);
      if (item) {
        setItem(item);
      }
      setIsLoading(false);
    }
  }, [location, foodData]);

  const goBack = () => {
    history.goBack();
  };

  function findArrayWithId(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const array = data[key];
        const foundItem = array.find((obj) => {
          return obj.id == id;
        });
        if (foundItem) return foundItem;
      }
    }
    return null;
  }

  async function deleteEntry() {
    setIsAlert(false);
    setIsLoading(true);
    try {
      if (!id) return;
      const res = await axios.post(`${serverDeleteUrl}`, { id });
      if (res.status === 200) {
        window.location.href = '/logs';
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-3 flex items-center justify-between px-3">
          <IonIcon
            aria-hidden="true"
            className="text-3xl"
            icon={chevronBackOutline}
            onClick={goBack}
          />
          <IonTitle>Food Details</IonTitle>
          <IonIcon
            aria-hidden="true"
            className="text-3xl float-right"
            icon={trashOutline}
            onClick={() => setIsAlert(true)}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent className="dark:bg-black">
        <div className="py-6 px-4 flex flex-col justify-start gap-3">
          <div className="bg-stone-50 dark:bg-black rounded-xl border flex flex-col relative justify-center items-center gap-6 mb-6 py-4">
            <div className="tracking-tight text-5xl font-bold text-center ">{item?.emoji} </div>
            <div className="tracking-tight text-2xl w-[300px] font-bold text-center ">{item?.name} </div>
            <div className="flex gap-3">
              <div>Protein: {item?.protein}g</div>
              <div>Carbs: {item?.carbs}g</div>
              <div>Fat: {item?.fat}g</div>
            </div>
            <div className="tracking-tight text-md font-semibold text-center absolute top-3 rounded-full bg-green-300 px-3 right-3">
              {item?.calories} kcal{' '}
            </div>
          </div>
          {item?.macros?.map((macro, index) => (
            <div
              key={index}
              className="h-[50px] bg-stone-50 dark:bg-stone-900  rounded-xl border flex items-center gap-8"
            >
              <div className="ml-5 text-2xl">{macro?.emoji ? macro.emoji : '👍🏻'}</div>
              <div className="tracking-tight font-semibold w-[40%] whitespace-nowrap capitalize">{macro?.name}</div>
              <div className="tracking-tight font-semibold text-right w-[30%]">{macro?.calories}</div>
            </div>
          ))}
        </div>
      </IonContent>
      <Loading showSpinner={isLoading} />
      <IonAlert
        isOpen={isAlert}
        header="Delete entry?"
        trigger="present-alert"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'confirm',
            handler: () => {
              deleteEntry();
            },
          },
        ]}
      ></IonAlert>
    </IonPage>
  );
};

export default Logs;
