import { IonPage, IonContent, IonToolbar, IonTitle, IonSkeletonText, IonHeader } from '@ionic/react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Home = ({ userData, setPaywallOpen }) => {
  const countPathColor = () => {
    if (!userData?.total_calories) return '58F168';

    let val = (userData?.current_calories / userData?.total_calories) * 100;

    if (val >= 0 && val <= 50) {
      return '#58F168';
    } else if (val > 50 && val <= 80) {
      return '#f5b041';
    } else if (val > 80 && val <= 100) {
      return '#F17C7C';
    } else {
      return '#58F168';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-3 flex items-center justify-between px-3">
          <IonTitle>
            <div
              className={`bg-[#58F168] mx-auto h-[35px] rounded-full flex items-center justify-center ${
                userData?.premium || !userData?.show_paywall ? 'invisible' : null
              }`}
              onClick={() => setPaywallOpen(true)}
            >
              Upgrade for more scans
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="py-6 px-4 flex flex-col justify-start gap-4">
          <div className="flex gap-2 pl-5">
            <h1 className="text-left text-xl font-semibold">
              {userData?.name ? `Welcome back, ${userData?.name}! 👋` : null}
            </h1>
          </div>

          <div className="flex justify-center ">
            <CircularProgressbarWithChildren
              value={(userData?.current_calories / (userData?.total_calories ? userData?.total_calories : 4000)) * 100}
              styles={buildStyles({
                pathColor: countPathColor(),
                trailColor: '#E7FDE8',
                strokeWidth: 10,
              })}
            >
              <div className="text-xl font-semibold">
                {userData?.total_calories ? `Goal ${userData?.total_calories}` : null}
              </div>
              {userData ? (
                <>
                  <div className="text-6xl font-bold my-2">{userData?.current_calories}</div>
                  <div className="text-2xl mt-[-5px] font-medium  text-gray-700 dark:text-stone-400">calories</div>
                </>
              ) : (
                <IonSkeletonText
                  animated={true}
                  className="w-[180px] !h-[180px] rounded-full"
                ></IonSkeletonText>
              )}
            </CircularProgressbarWithChildren>
          </div>

          <div className="w-full px-6">
            <div className="flex items-center gap-3 justify-between px-4 my-7">
              <div>
                <div className="text-left text-md text-gray-700 dark:text-stone-400">Protein</div>
                <div className="text-left text-xl font-bold">
                  {userData?.current_protein}
                  {userData?.total_protein ? `/${userData?.total_protein}g` : 'g'}
                </div>
              </div>
              <div className="w-[200px] bg-[#ADC1FF] h-[6px] rounded-[3px] relative">
                <div
                  style={{
                    width: `${(userData?.current_protein / userData?.total_protein) * 200}px`,
                    maxWidth: '200px',

                    backgroundColor: '#7C8EF1',
                    height: '6px',
                    borderRadius: '3px',
                  }}
                  className="absolute"
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between px-4 my-7">
              <div>
                <div className="text-left text-md text-gray-700 dark:text-stone-400">Carbs</div>
                <div className="text-left text-xl font-bold">
                  {userData?.current_carbs}
                  {userData?.total_carbs ? `/${userData?.total_carbs}g` : 'g'}
                </div>
              </div>
              <div className="w-[200px] bg-[#ffffa4] h-[6px] rounded-[3px] relative">
                <div
                  style={{
                    width: `${(userData?.current_carbs / userData?.total_carbs) * 200}px`,
                    maxWidth: '200px',

                    backgroundColor: '#F1F17C',
                    height: '6px',
                    borderRadius: '3px',
                  }}
                  className="absolute"
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between px-4 my-7">
              <div>
                <div className="text-left text-md text-gray-700 dark:text-stone-400">Fat</div>
                <div className="text-left text-xl font-bold">
                  {userData?.current_fat}
                  {userData?.total_fat ? `/${userData?.total_fat}g` : 'g'}
                </div>
              </div>
              <div className="w-[200px] bg-[#ed9c9c] h-[6px] rounded-[3px] relative">
                <div
                  style={{
                    width: `${(userData?.current_fat / userData?.total_fat) * 200}px`,
                    maxWidth: '200px',
                    backgroundColor: '#F17C7C',
                    height: '6px',
                    borderRadius: '3px',
                  }}
                  className="absolute"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
