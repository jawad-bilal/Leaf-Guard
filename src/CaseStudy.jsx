const SECTIONS = [
  {
    id: "problem",
    title: "1. Problem",
    body: [
      "Potato is a staple crop worldwide, yet foliar diseases such as Early Blight and Late Blight can destroy yield within days if they go unnoticed. Field diagnosis usually depends on expert visual inspection, which is slow, uneven across farms, and hard to scale.",
      "AetherLeaf asks a practical question: can a convolutional neural network classify a potato leaf photo into Early Blight, Late Blight, or Healthy fast enough to support everyday farm and classroom use?",
    ],
  },
  {
    id: "dataset",
    title: "2. Dataset",
    body: [
      "Training used the PlantVillage potato subset: 2,152 labeled RGB images across three classes: Potato___Early_blight, Potato___Late_blight, and Potato___healthy.",
      "Images were loaded with TensorFlow's image_dataset_from_directory, resized to 256x256, and batched at size 32. The dataset was split into train / validation / test (approximately 80% / 10% / 10%) with shuffling for a fair evaluation.",
    ],
  },
  {
    id: "model",
    title: "3. Model architecture",
    body: [
      "We built a custom CNN in Keras (Sequential). The first stage resizes inputs and rescales pixels to [0, 1]. Six Conv2D + MaxPooling blocks extract spatial disease patterns, followed by Flatten, a Dense(64, ReLU) layer, and a Dense(3, Softmax) classifier.",
      "Data augmentation (random flip and rotation) was applied on the training pipeline to reduce overfitting on limited leaf photos. Loss was Sparse Categorical Crossentropy; the network was trained for up to 50 epochs.",
    ],
  },
  {
    id: "pipeline",
    title: "4. From notebook to product",
    body: [
      "After training, the Keras model was exported to TensorFlow Lite so inference stays light enough for serverless hosting. The production API (FastAPI on Vercel) accepts a leaf image, runs TFLite inference, and returns the predicted class with confidence scores.",
      "The React frontend (AetherLeaf) lets users upload camera photos or files from the browser. Preprocessing matches training: RGB conversion and 256x256 resize before the model's internal rescaling.",
    ],
  },
  {
    id: "results",
    title: "5. Results and observations",
    body: [
      "On held-out PlantVillage-style leaf images, the deployed model typically returns high-confidence predictions for the correct class (often above 99% on clear samples).",
      "Performance is strongest on close-up, well-lit leaf photos similar to the training distribution. Unrelated images, heavy blur, or extreme lighting can still receive a label; confidence should be read carefully in those cases.",
    ],
  },
  {
    id: "impact",
    title: "6. Impact and next steps",
    body: [
      "AetherLeaf turns a classroom deep-learning experiment into a usable web tool: farmers, students, and agronomy learners can test a leaf photo in seconds without installing ML software.",
      "Natural extensions include more crop diseases, mobile capture guidance, confidence thresholds with uncertain handling, explainability heatmaps, and continuous evaluation on real field photos beyond PlantVillage.",
    ],
  },
];

const METRICS = [
  { label: "Classes", value: "3" },
  { label: "Images", value: "2,152" },
  { label: "Input size", value: "256x256" },
  { label: "Stack", value: "CNN, TFLite, FastAPI" },
];

export default function CaseStudy() {
  return (
    <article className="case-study">
      <header className="case-hero">
        <p className="eyebrow">Deep learning case study</p>
        <h1>Potato leaf disease classification with CNNs</h1>
        <p className="case-lede">
          How AetherLeaf was built from PlantVillage images and a Keras CNN to a live web
          classifier for Early Blight, Late Blight, and Healthy leaves.
        </p>
      </header>

      <ul className="case-metrics">
        {METRICS.map((item) => (
          <li key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="case-sections">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="case-block">
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
