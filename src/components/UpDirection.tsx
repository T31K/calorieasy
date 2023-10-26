import * as React from 'react';
import { Range, Direction, getTrackBackground } from 'react-range';

const STEP = 0.1;
const MIN = 0;
const MAX = 100;

interface UpDirectionProps {
  rtl: boolean;
  color: string,
  values: Array<any>; // Replace any with the correct type of values in the array
  setValues: (values: Array<any>) => void; // Replace any with the correct type
}

const UpDirection: React.FC<UpDirectionProps> = ({ rtl, values, setValues, color }) => {
  
  return (
    <div
      style={{
        height: '100%',
        width: '14px',
      }}
    >
      <Range
        direction={Direction.Up}
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              flexGrow: 1,
              width: '5px',
              display: 'flex',
              height: '50px'
            }}
          >
            <div
              ref={props.ref}
              style={{
                width: '5px',
                height: '50px',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: [`${color ? color : '#b51351'}`, '#ccc'],
                  min: MIN,
                  max: MAX,
                  direction: Direction.Up,
                  rtl
                }),
                alignSelf: 'center'
              }}
            >
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
         <div></div>
        )}
      />

    </div>
  );
};

export default UpDirection;
