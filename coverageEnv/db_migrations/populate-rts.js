const DB = require('../api/Database');

console.log('POPULATING research_target TABLE...');

const rts = [
  {
    links:
      'https://en.wikipedia.org/wiki/Cancer\nhttps://www.cancertutor.com/cancer-myths/',
    name: 'Cure for Cancer',
    video: 'https://www.youtube.com/watch?v=h8X8beT44iQ',
    picture:
      'https://d26dzxoao6i3hh.cloudfront.net/items/2n070s26111v2Y3G1C0G/Screen%20Shot%202017-11-16%20at%2015.07.58.2M3c3D1c1t1g.png',
    author: 'John Doe',
    description:
      'We are closer to a cure for cancer in 2017 than one or two decades ago, but we need to get away from using radiotherapy and chemotherapy, because the cancer stem cells are resistant to these treatment modalities.\n\nIf you want to cure cancer, you need to know about cancer stem cells. In my opinion, the most important breakthrough in cancer research in the last decade has been the realization that standard cancer treatment protocols don’t work very well. They consisted of using surgery, radiotherapy and chemotherapy. Surgery is effective for early cancer. But radiotherapy and chemotherapy have been disappointing. Instead, cancer immunotherapy has emerged as the missing link in the last ten years. The full truth about cancer can only be understood, when we realize that most, if not all solid tumors are having their own cancer stem cells (CSC). Cancer Stem Cells - Medical Articles by Dr. Ray.\n\nThere are new attempts to cure cancer with low dose laser methods. Twenty patients with prostate cancer were treated with photo dynamic therapy (PDT) between May and September 2014. 20% of them had a complete remission of their cancers. 35% experienced a partial remission; another 35% had no further tumor progression. In 10% the tumors progressed. These patients were given the following photosensitizers: 80 mg Chlorin E6, 10 mg Hypericin and 150 mg Curcumin intravenously. Three hours after the intravenous photosensitizers had been given, photodynamic laser therapy (PDT) was administered through a transparent, permanent catheter that allowed admission of the laser instrument up to the level of the prostate. With this approach the low-dose laser light penetrated the entire prostate gland. Three frequencies were employed that corresponded to the absorption peaks of the three photosensitizers, red light (658 nm) to activate Chlorin E6, yellow light (589 nm) to activate Hypericin and blue light (405 nm) to activate Curcumin. Can Cancer Be Beaten? - Medical Articles by Dr. Ray.\n\nConclusion\n\nWe are close to curing cancer in 2017. But we are not there yet. We are learning that immunotherapy will become more important to remove the last cancer stem cell. This way the cancer cannot regrow. Whether or not Dr. Weber’s low dose laser therapy as described above will help is not yet determined, but it looks somewhat promising. Hopefully other non-toxic methods will be added to the cancer treatment armamentarium.',
  },
  {
    links:
      'https://en.wikipedia.org/wiki/Cancer\nhttps://www.cancertutor.com/cancer-myths/',
    name: "Alzehimer's Cure",
    video: 'https://www.youtube.com/watch?v=h8X8beT44iQ',
    picture:
      'http://www.getmedurgentcare.com/wp-content/uploads/2016/11/alzehimer.jpg',
    author: 'John Doe',
    description:
      "Currently, there is no cure for Alzheimer's. But drug and non-drug treatments may help with both cognitive and behavioral symptoms.\n\nResearchers are looking for new treatments to alter the course of the disease and improve the quality of life for people with dementia.",
  },
  {
    links:
      'https://en.wikipedia.org/wiki/Cancer\nhttps://www.cancertutor.com/cancer-myths/',
    name: 'Treatment for MS',
    video: 'https://www.youtube.com/watch?v=h8X8beT44iQ',
    picture:
      'http://www.newslodi.com/wp-content/uploads/2016/05/multiple-sclerosis-1120x680.jpg',
    author: 'John Doe',
    description:
      'Multiple sclerosis (MS) is a potentially disabling disease that affects the brain and spinal cord. Around 400,000 people are living with MS in the United States and approximately 2.1 million individuals have the condition worldwide.\n\nThe exact mechanism that drives MS is not entirely understood. However, many researchers suggest that the condition is an autoimmune disease that attacks the myelin sheath - that is, the protective layer surrounding the nerves that help electrical signals to travel from the brain to the rest of the body - in the brain and spinal cord.\n\nOver time, the disease can deteriorate or permanently damage the nerves. Symptoms tend to vary depending on the nerves affected and the damage caused. While some people may lose the ability to walk, others experience extended periods of remission.\n',
  },
];

rts.forEach(rt => {
  DB.insert('research_target', rt);
});

console.log('DONE');
