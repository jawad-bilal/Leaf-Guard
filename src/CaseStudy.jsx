const METRICS = [
  { value: "97.3%", label: "Test accuracy" },
  { value: "2,152", label: "Leaf images" },
  { value: "50", label: "Training epochs" },
  { value: "183k", label: "Trainable params" },
];

const CLASSES = [
  {
    name: "Early Blight",
    id: "Potato___Early_blight",
    note: "Concentric brown rings on older leaves. Spreads in warm, humid weather.",
  },
  {
    name: "Late Blight",
    id: "Potato___Late_blight",
    note: "Water-soaked lesions that move fast in cool, wet conditions.",
  },
  {
    name: "Healthy",
    id: "Potato___healthy",
    note: "Clear leaf tissue with no blight pattern. The control class.",
  },
];

const LAYERS = [
  { name: "Resize + rescale", detail: "256x256 RGB, pixels / 255" },
  { name: "Conv 32 + pool", detail: "3x3 ReLU, then 2x2 max pool" },
  { name: "5x Conv 64 + pool", detail: "Deeper spatial features" },
  { name: "Flatten + Dense 64", detail: "ReLU bottleneck" },
  { name: "Softmax 3", detail: "Early, Late, Healthy" },
];

const PIPELINE = [
  { step: "01", title: "Train", text: "Keras CNN on PlantVillage potato leaves, 80 / 10 / 10 split, augmentation on train." },
  { step: "02", title: "Export", text: "Saved model converted to TFLite (~743 KB) so Vercel can run inference without full TensorFlow." },
  { step: "03", title: "Serve", text: "FastAPI loads the interpreter once, accepts an image, returns class + confidence." },
  { step: "04", title: "Use", text: "AetherLeaf uploads a photo from the browser and shows the diagnosis in seconds." },
];

export default function CaseStudy() {
  return (
    <article className="case-study">
      <header className="case-hero">
        <p className="eyebrow">Deep learning case study</p>
        <h1>From a leaf photo to a blight diagnosis</h1>
        <p className="case-lede">
          AetherLeaf is a custom convolutional network trained to tell Early Blight, Late Blight,
          and Healthy potato leaves apart, then shipped as a live web tool.
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

      <section className="case-block">
        <p className="case-kicker">The problem</p>
        <h2>Blight can ruin a crop before an expert reaches the field</h2>
        <p>
          Potato is a staple crop, but Early Blight and Late Blight can spread in days. Diagnosis
          still often means a person looking at a leaf. That is slow, uneven, and hard to scale
          across many farms.
        </p>
        <p>
          The project question was simple: can a CNN read a close-up leaf photo well enough to
          support classroom demos and everyday checks, without a laptop full of ML software?
        </p>
      </section>

      <section className="case-block">
        <p className="case-kicker">Dataset</p>
        <h2>PlantVillage potato subset</h2>
        <p>
          2,152 labeled RGB images, loaded with TensorFlow image_dataset_from_directory. Every
          image is resized to 256x256. Batch size is 32. The split is about 80% train, 10%
          validation, and 10% test, shuffled so evaluation is not just a lucky batch.
        </p>
        <ul className="case-classes">
          {CLASSES.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-block">
        <p className="case-kicker">Architecture</p>
        <h2>A small CNN built for this task</h2>
        <p>
          Not a giant pretrained backbone. A Sequential Keras model with resize and rescale inside
          the graph, six convolution blocks, then a 3-way softmax. Trainable size: 183,747
          parameters. Training used random flip and rotation, Sparse Categorical Crossentropy, and
          50 epochs.
        </p>
        <ol className="case-layers">
          {LAYERS.map((layer) => (
            <li key={layer.name}>
              <strong>{layer.name}</strong>
              <span>{layer.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-block">
        <p className="case-kicker">Training</p>
        <h2>From coin-flip to 97% on held-out leaves</h2>
        <p>
          Epoch 1 sat near 53% accuracy, barely above chance for three classes. By epoch 3
          validation was already above 92%. Late training peaked at 99.5% on validation. On the
          held-out test set the model scored 97.3% accuracy with a loss of 0.069.
        </p>
        <ul className="case-train">
          <li>
            <strong>53%</strong>
            <span>Epoch 1 accuracy</span>
          </li>
          <li>
            <strong>99.5%</strong>
            <span>Best validation</span>
          </li>
          <li>
            <strong>97.3%</strong>
            <span>Test accuracy</span>
          </li>
        </ul>
      </section>

      <section className="case-block">
        <p className="case-kicker">Product</p>
        <h2>Notebook to production</h2>
        <p>
          Full TensorFlow is too large for Vercel. The trained Keras model was exported to TFLite
          with a single-image input of 256x256. The API resizes uploads to that size, keeps pixels
          in 0-255, and lets the model rescale internally, matching training.
        </p>
        <ol className="case-pipe">
          {PIPELINE.map((item) => (
            <li key={item.step}>
              <em>{item.step}</em>
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-block">
        <p className="case-kicker">Limits</p>
        <h2>Where it is strong, and where it is not</h2>
        <p>
          Clear, close-up potato leaves similar to PlantVillage usually come back with very high
          confidence. Blurry shots, mixed plants, extreme lighting, or unrelated photos can still
          get a label. The model always picks one of the three classes. Low confidence should be
          treated as uncertain, not as a farm decision.
        </p>
      </section>

      <section className="case-block">
        <p className="case-kicker">Next</p>
        <h2>What we would add next</h2>
        <ul className="case-next">
          <li>An uncertain band when no class is clearly ahead</li>
          <li>Grad-CAM style maps so the user can see which spots the CNN used</li>
          <li>More crops and diseases beyond this potato subset</li>
          <li>A field-photo test set, not only PlantVillage studio-style leaves</li>
        </ul>
      </section>
    </article>
  );
}
