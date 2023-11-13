function calculateTdee(obj) {
  if (!obj) return;
  let age = parseInt(obj.age, 10);
  let weight = parseInt(obj.weight, 10);
  let height = parseInt(obj.height, 10);
  let bmr = 0;

  // Convert imperial to metric if necessary
  if (obj.system === 'imperial') {
    // Convert height: assuming height is in the format "Xft Yin"
    let [feet, inches] = obj.height.split('ft ');
    inches = inches.replace('in', '');
    height = parseInt(feet, 10) * 30.48 + parseInt(inches, 10) * 2.54; // Convert feet and inches to cm

    // Convert weight from pounds to kg
    weight = weight * 0.453592;
  }

  // BMR Calculation
  if (obj.gender === 'male') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else if (obj.gender === 'female') {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  } else {
    // For 'other' gender
    let maleBMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    let femaleBMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    bmr = (maleBMR + femaleBMR) / 2; // Average of male and female BMR
  }

  // Activity level factors
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
  };

  return Math.round(bmr * activityFactors[obj.activity]);
}

export { calculateTdee };
