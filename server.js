const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* =========================
   DIABETES PREDICTION
========================= */

app.post("/predict", (req, res) => {

  const { age, glucose, bmi } = req.body;

  if (age == null || glucose == null || bmi == null) {
    return res.status(400).json({
      error: "Age, Glucose and BMI are required"
    });
  }

  let score = 0;

  /* Glucose scoring (realistic medical ranges) */

  if (glucose >= 200) score += 5;         // Severe diabetes risk
  else if (glucose >= 126) score += 4;    // Diabetes level
  else if (glucose >= 110) score += 2;    // Prediabetes
  else if (glucose >= 100) score += 1;    // Slight risk

  /* BMI scoring */

  if (bmi >= 30) score += 3;              // Obese
  else if (bmi >= 25) score += 2;         // Overweight
  else if (bmi >= 23) score += 1;         // Slight risk (Asian standard)

  /* Age scoring */

  if (age >= 60) score += 3;
  else if (age >= 45) score += 2;
  else if (age >= 30) score += 1;

  let riskLevel = "";
  let diagnosis = "";
  let advice = "";

  /* Risk classification */

  if (score >= 8) {
    riskLevel = "High";
    diagnosis = "Diabetes Very Likely";
    advice = "Very high risk detected. Please consult a doctor and perform fasting blood sugar test.";
  }

  else if (score >= 4) {
    riskLevel = "Medium";
    diagnosis = "Prediabetes Risk";
    advice = "Moderate risk. Maintain healthy diet, exercise regularly, and monitor blood sugar.";
  }

  else {
    riskLevel = "Low";
    diagnosis = "Low Diabetes Risk";
    advice = "Low risk. Maintain healthy lifestyle and regular health checkups.";
  }

  res.json({
    riskLevel,
    diagnosis,
    score,
    recommendations: advice,
    inputData: { age, glucose, bmi }
  });

});


/* =========================
   HEART ATTACK PREDICTION
========================= */

app.post("/heart-predict", (req, res) => {

  const { age, gender, glucose, bmi, bloodPressure } = req.body;

  if (
    age == null ||
    gender == null ||
    glucose == null ||
    bmi == null ||
    bloodPressure == null
  ) {
    return res.status(400).json({
      error: "Age, Gender, Glucose, BMI and Blood Pressure are required"
    });
  }

  let heartScore = 0;

  /* Age */

  if (age >= 60) heartScore += 3;
  else if (age >= 45) heartScore += 2;
  else if (age >= 35) heartScore += 1;

  /* BMI */

  if (bmi >= 30) heartScore += 2;
  else if (bmi >= 25) heartScore += 1;

  /* Glucose */

  if (glucose >= 126) heartScore += 2;
  else if (glucose >= 100) heartScore += 1;

  /* Blood Pressure */

  if (bloodPressure >= 140) heartScore += 2;     // Hypertension
  else if (bloodPressure >= 120) heartScore += 1;

  /* Gender */

  if (gender.toLowerCase() === "male") heartScore += 1;

  let riskLevel = "";
  let advice = "";

  if (heartScore >= 7) {
    riskLevel = "High";
    advice = "High heart attack risk. Consult a cardiologist immediately.";
  }

  else if (heartScore >= 4) {
    riskLevel = "Medium";
    advice = "Moderate risk. Maintain healthy diet, exercise, and monitor blood pressure.";
  }

  else {
    riskLevel = "Low";
    advice = "Low risk. Continue healthy lifestyle habits.";
  }

  res.json({
    riskLevel,
    score: heartScore,
    recommendations: advice,
    inputData: {
      age,
      gender,
      glucose,
      bmi,
      bloodPressure
    }
  });

});


/* =========================
   SERVER START
========================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});