import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import { IonIcon } from '@ionic/react';
import { closeCircleOutline, star } from 'ionicons/icons';

function ReviewBlocks() {
  return (
    <Swiper
      modules={[EffectFade, Navigation]}
      draggable={false}
      navigation={true}
      spaceBetween={50}
      className="px-3 mt-4"
    >
      <SwiperSlide className="flex flex-col items-center justify-center">
        <div
          className={`w-full px-6 py-3 h-[150px] rounded-2xl flex items- flex-col relative text-black dark:text-white border-[3px] border-green-200`}
        >
          <div className="flex gap-1 mb-1 items-center justify-between">
            <div className="text-sm font-semibold ">Anita G.</div>
            <div className="flex gap-1 mr-3">
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />
            </div>
          </div>
          I've tried several calorie-counting apps, but this is by far the most innovative. The AI technology is
          impressive; it recognizes almost every dish I've snapped so far.{' '}
        </div>
      </SwiperSlide>
      <SwiperSlide className="flex flex-col items-center justify-center">
        <div
          className={`w-full px-6 py-3 h-[150px] rounded-2xl flex items- flex-col relative text-black dark:text-white border-[3px] border-green-200`}
        >
          <div className="flex gap-1 mb-1 items-center justify-between">
            <div className="text-sm font-semibold ">Jessica H.</div>
            <div className="flex gap-1 mr-3">
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />
            </div>
          </div>
          I've been using this AI calorie tracker for a abit now, and it's been an absolute game-changer for me. The
          simplicity of just taking a picture is beautiful! There were some problems but I sent an email and instantly
          got help.
        </div>
      </SwiperSlide>
      <SwiperSlide className="flex flex-col items-center justify-center">
        <div
          className={`w-full px-6 py-3 h-[150px] rounded-2xl flex items- flex-col relative text-black dark:text-white border-[3px] border-green-200`}
        >
          <div className="flex gap-1 mb-1 items-center justify-between">
            <div className="text-sm font-semibold ">Marcus T.</div>
            <div className="flex gap-1 mr-3">
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-500"
                icon={star}
              />{' '}
              <IonIcon
                class="text-green-200"
                icon={star}
              />
            </div>
          </div>
          Never thought I'd say this, but tracking calories is kinda fun now, good job!
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

export default ReviewBlocks;
