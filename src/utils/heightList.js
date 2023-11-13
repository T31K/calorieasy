export const generateHeights = () => {
  let heights = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 4 && inches < 5) {
        continue; // Skip inches less than 5 for 4 feet
      }
      heights.push(`${feet}ft ${inches}in`);
      if (feet === 7 && inches === 0) {
        break; // Stop at 7 feet 0 inches
      }
    }
  }
  return heights;
};

export const heightList = generateHeights();
