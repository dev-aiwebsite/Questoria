import { User } from "@/server-actions/crudUser";

export const currentUserId = "a9f3k2"

export type CheckpointQuizData = {
  title: string;
  description: string;
  question: string;
  choices: {
    id: string;
    text: string;
  }[];
  correct_answer: string;
}

export type checkpointChallenges = ({
  title: string;
  description: string;
} | CheckpointQuizData)

export type Map = {
  id: string;
  released: boolean;
  logo: string;
  featured_image?: string;
  images: string[];
  title: string;
  description: string;
  ratings: string;
  ratings_count: string;
}

export const maps = [
  {
    id: "234j3h4j3",
    released: true,
    logo: "/images/img8.png",
    featured_image: "https://ucarecdn.com/e68719e6-f039-48d5-aa5c-087a14617335/-/preview/1000x562/",
    images: ["/images/img6.jpg", "/images/img7.jpg", "/images/img9.jpg"],
    title: "Royal Botanic Gardens Victoria",
    description: "Royal Botanic Gardens Victoria is one of Australia’s most beloved botanical institutions, comprising two major garden sites, Melbourne Gardens and Cranbourne Gardens, each offering distinct plant experiences and landscapes.",
    ratings: "4.5",
    ratings_count: "1271",
  },
  {
    id: "234j3h4j4",
    released: false,
    logo: "/images/img8.png",
    featured_image: "/images/img10.jpg",
    images: ["/images/img6.jpg", "/images/img7.jpg", "/images/img9.jpg"],
    title: "Map 2",
    description: "Royal Botanic Gardens Victoria is one of Australia’s most beloved botanical institutions, comprising two major garden sites, Melbourne Gardens and Cranbourne Gardens, each offering distinct plant experiences and landscapes.",
    ratings: "4.5",
    ratings_count: "1271",
  },
  {
    id: "234j3h4j5",
    released: false,
    logo: "/images/img8.png",
    featured_image: "/images/img10.jpg",
    images: ["/images/img6.jpg", "/images/img7.jpg", "/images/img9.jpg"],
    title: "Map 3",
    description: "Royal Botanic Gardens Victoria is one of Australia’s most beloved botanical institutions, comprising two major garden sites, Melbourne Gardens and Cranbourne Gardens, each offering distinct plant experiences and landscapes.",
    ratings: "4.5",
    ratings_count: "1271",
  },
]


export type Checkpoint = {
  id: string;
  map_id: string;
  title: string;
  subtitle: string;
  pretext: string;
  image: string;
  description: string;
  did_you_know: string;
  challenges: checkpointChallenges[];
  is_visited: boolean;
  order: number;
  pos: {
    x: number;
    y: number;
  }
}
export const checkpoints: Checkpoint[] = [
  {
    id: "cp_001",
    map_id: "234j3h4j3",
    title: "Red Sands Garden ",
    subtitle: "Red Sands Garden ",
    pretext: "The quest awaits! Make your way to Red Sands Garden  to begin your adventure.",
    image: "/images/maps/map1-checkpoint-1.jpg",
    description:
      "Inspired by Australia’s Red Centre, this garden echoes desert landscapes with red sand circles and crescent shapes.  ",
    did_you_know: `<p><strong>Did you know?</strong> The stunning gardens you will be exploring began as a bold vision back in 1846, when land beside the Yarra River was set aside to create a botanical haven, making these gardens one of Victoria’s oldest and most cherished green treasures with nearly 180 years of plant-loving history!</p>

<p>Over the decades, legendary botanists like <strong>Ferdinand von Mueller</strong> expanded the Garden’s scientific reach, building one of Australia’s most important plant collections and establishing the National Herbarium of Victoria, which now houses more than a million plant specimens!</p>

<p>Red Sands Garden  you see today stands amid this legacy of exploration, discovery, science, conservation and culture — welcoming over two million visitors each year to learn, wander and connect with nature and history alike.</p>
`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Red Sands Garden  <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "When was the Victoria Botanical Gardens originally founded?",
        choices: [
          { id: "c1", text: "1820" },
          { id: "c2", text: "1846" },
          { id: "c3", text: "1901" },
          { id: "c4", text: "1988" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Red Sands Garden  <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 1,
    pos: { x: 48, y: 75 }
  },
  {
    id: "cp_002",
    map_id: "234j3h4j3",
    title: "Ironbark Garden",
    subtitle: "Ironbark Garden",
    pretext: "",
    image: "",
    description:
      "Tough ironbark trees and hardy plants from some of Australia’s most resilient forests. Quiet, rugged, and built to last. ",
    did_you_know: `<p><strong>Did you know?</strong> Ironbark trees have incredibly hard bark that helps protect them from bushfires.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Ironbark Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the main purpose of the Ironbark’s hard bark?",
        choices: [
          { id: "c1", text: "To store water" },
          { id: "c2", text: "To protect from fire" },
          { id: "c3", text: "To attract birds" },
          { id: "c4", text: "To provide shade" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Ironbark Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 2,
    pos: { x: 34, y: 70 }
  },
  {
    id: "cp_003",
    map_id: "234j3h4j3",
    title: "Box Garden",
    subtitle: "Box Garden",
    pretext: "",
    image: "",
    description:
      "A box eucalypt canopy with plants inspired by the Grampians. Look closely. The smaller details tend to steal the show.",
    did_you_know: `<p><strong>Did you know?</strong> Box trees are often used in formal gardens because they can be trimmed into neat shapes that last for decades.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Box Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "Why are Box trees popular in gardens?",
        choices: [
          { id: "c1", text: "They grow very tall" },
          { id: "c2", text: "They can be trimmed into shapes" },
          { id: "c3", text: "They have colorful flowers" },
          { id: "c4", text: "They repel insects" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Box Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 3,
    pos: { x: 30.5, y: 65.2 }
  },
  {
    id: "cp_004",
    map_id: "234j3h4j3",
    title: "Peppermint Garden",
    subtitle: "Peppermint Garden",
    pretext: "",
    image: "",
    description:
      "Take a deep breath—this garden smells fresh and minty! The trees here make the air feel cool and calm.",
    did_you_know: `<p><strong>Did you know?</strong> Australian native peppermint trees have leaves that smell minty and can repel insects.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Peppermint Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is a natural benefit of Peppermint tree leaves?",
        choices: [
          { id: "c1", text: "They attract bees" },
          { id: "c2", text: "They smell minty and repel insects" },
          { id: "c3", text: "They can be eaten raw" },
          { id: "c4", text: "They grow underground" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Peppermint Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 4,
    pos: { x: 27, y: 61 }
  },
  {
    id: "cp_005",
    map_id: "234j3h4j3",
    title: "Bloodwood Garden",
    subtitle: "Bloodwood Garden",
    pretext: "",
    image: "",
    description:
      "Tall trees with dark, dramatic bark make this garden feel a little mysterious. Look closely and imagine ancient trees whispering stories from long ago.",
    did_you_know: `<p><strong>Did you know?</strong> Bloodwood trees are named for their red sap, which was traditionally used by Aboriginal people for medicine and art.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Bloodwood Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What was the red sap from Bloodwood trees traditionally used for?",
        choices: [
          { id: "c1", text: "Dye and medicine" },
          { id: "c2", text: "Fuel for fires" },
          { id: "c3", text: "Sweetener" },
          { id: "c4", text: "Building material" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Bloodwood Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 5,
    pos: { x: 28, y: 56.8 }
  },
  {
    id: "cp_006",
    map_id: "234j3h4j3",
    title: "Stringybark Garden",
    subtitle: "Stringybark Garden",
    pretext: "",
    image: "",
    description:
      "Plants shaped by fire and recovery. Some survive it, some return stronger. Australia’s flora has learned a few tricks over time.",
    did_you_know: `<p><strong>Did you know?</strong> Stringbark trees have long, fibrous bark that peels off in strings, giving the garden its name.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Stringbark Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "Why is Stringbark Garden called “Stringbark”?",
        choices: [
          { id: "c1", text: "Its trees grow in lines" },
          { id: "c2", text: "Its trees have fibrous peeling bark" },
          { id: "c3", text: "It has long vines" },
          { id: "c4", text: "It’s shaped like a string" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Stringbark Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 6,
    pos: { x: 26.5, y: 51.2 }
  },
  {
    id: "cp_007",
    map_id: "234j3h4j3",
    title: "Dry River Bed",
    subtitle: "Dry River Bed",
    pretext: "",
    image: "",
    description:
      "Inspired by inland river systems that run only after rain. Look for clues in the sand and stones. Water leaves stories behind, even when it’s gone.",
    did_you_know: `<p><strong>Did you know?</strong> Many plants in dry river beds survive long droughts by storing water in roots and stems.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Dry River Bed. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What helps dry river bed plants survive drought?",
        choices: [
          { id: "c1", text: "They store water in roots and stems" },
          { id: "c2", text: "They grow only at night" },
          { id: "c3", text: "They rely on animals" },
          { id: "c4", text: "They avoid sunlight" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Dry River Bed <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 7,
    pos: { x: 36, y: 47.5 }
  },
  {
    id: "cp_008",
    map_id: "234j3h4j3",
    title: "Forest Garden",
    subtitle: "Forest Garden",
    pretext: "",
    image: "",
    description:
      "A winding walk through different forest landscapes, from woodlands to taller eucalypt country. ",
    did_you_know: `<p><strong>Did you know?</strong> Forest Gardens show layers of vegetation from ground cover to tall canopy trees, mimicking natural forests.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Forest Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What does a Forest Garden mimic?",
        choices: [
          { id: "c1", text: "Desert landscapes" },
          { id: "c2", text: "Natural forest layers" },
          { id: "c3", text: "Wetlands" },
          { id: "c4", text: "Grasslands" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Forest Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 8,
    pos: { x: 26, y: 36 }
  },
  {
    id: "cp_009",
    map_id: "234j3h4j3",
    title: "Gondwana Garden",
    subtitle: "Gondwana Garden",
    pretext: "",
    image: "",
    description:
      "Travel back in time to when dinosaurs once roamed the Earth. These ancient-looking plants are living fossils from a very old world.",
    did_you_know: `<p><strong>Did you know?</strong> The Gondwana Garden features ancient plant lineages that have been around since the supercontinent Gondwana existed millions of years ago.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Gondwana Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What makes Gondwana Garden special?",
        choices: [
          { id: "c1", text: "It has tropical flowers" },
          { id: "c2", text: "It has plants from ancient lineages" },
          { id: "c3", text: "It is a desert garden" },
          { id: "c4", text: "It only has edible plants" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Gondwana Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 9,
    pos: { x: 23, y: 31 }
  },
  {
    id: "cp_010",
    map_id: "234j3h4j3",
    title: "Desert Discovery Camp",
    subtitle: "Desert Discovery Camp",
    pretext: "",
    image: "",
    description:
      "A desert-themed stop near the sand gardens, featuring plants from arid Australia. Proof that life finds a way, even when conditions are tough.",
    did_you_know: `<p><strong>Did you know?</strong> The Desert Discovery Camp shows plants that thrive in harsh, dry conditions, teaching us how to adapt to extreme climates.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Desert Discovery Camp. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the focus of the Desert Discovery Camp?",
        choices: [
          { id: "c1", text: "Tropical rainforest plants" },
          { id: "c2", text: "Desert-adapted plants" },
          { id: "c3", text: "Underwater plants" },
          { id: "c4", text: "Alpine flowers" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Desert Discovery Camp <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 10,
    pos: { x: 37, y: 43 }
  },
  {
    id: "cp_011",
    map_id: "234j3h4j3",
    title: "Gondwana Shelter",
    subtitle: "Gondwana Shelter",
    pretext: "",
    image: "",
    description:
      "This cozy shelter is a resting spot in the ancient garden. Pause here and imagine the world as it was millions of years ago.",
    did_you_know: `<p><strong>Did you know?</strong> Gondwana Shelter provides a cool shaded space, designed to feel like a natural ancient refuge.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Gondwana Shelter. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Gondwana Shelter best known for?",
        choices: [
          { id: "c1", text: "A sunny lookout" },
          { id: "c2", text: "A cozy resting spot" },
          { id: "c3", text: "A water feature" },
          { id: "c4", text: "A playground" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Gondwana Shelter <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 11,
    pos: { x: 34, y: 34 }
  },
  {
    id: "cp_012",
    map_id: "234j3h4j3",
    title: "Lilypad Bridge",
    subtitle: "Lilypad Bridge",
    pretext: "",
    image: "",
    description:
      "Hop across the water like a frog on floating leaves. This bridge feels like a fairy path over a magical pond.",
    did_you_know: `<p><strong>Did you know?</strong> Lilypad bridges are designed to look like floating leaves and blend into natural water settings.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Lilypad Bridge. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What makes Lilypad Bridge feel magical?",
        choices: [
          { id: "c1", text: "It glows at night" },
          { id: "c2", text: "It looks like floating leaves" },
          { id: "c3", text: "It is made of glass" },
          { id: "c4", text: "It has flowers on it" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Lilypad Bridge <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 12,
    pos: { x: 32, y: 26 }
  },
  {
    id: "cp_013",
    map_id: "234j3h4j3",
    title: "Ian Potter Lakeside Precinct Lawn",
    subtitle: "Ian Potter Lakeside Precinct Lawn",
    pretext: "",
    image: "",
    description:
      "A wide open grassy space perfect for stretching, resting, or cloud watching. It’s a peaceful spot beside the water.",
    did_you_know: `<p><strong>Did you know?</strong> Lakeside lawns are designed to provide open space for rest and recreation near water.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of the lawn. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is this lawn best used for?",
        choices: [
          { id: "c1", text: "Planting trees" },
          { id: "c2", text: "Relaxing and cloud watching" },
          { id: "c3", text: "Playing sports only" },
          { id: "c4", text: "Growing crops" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Ian Potter Lakeside Precinct Lawn <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 13,
    pos: { x: 26, y: 23 }
  },
  {
    id: "cp_014",
    map_id: "234j3h4j3",
    title: "How to Garden",
    subtitle: "How to Garden",
    pretext: "",
    image: "",
    description:
      "This garden shows simple tricks for growing happy plants. It’s like a how-to book made of soil, leaves, and sunshine.",
    did_you_know: `<p><strong>Did you know?</strong> How to Garden is designed to teach practical gardening tips for home gardens.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of How to Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the main purpose of How to Garden?",
        choices: [
          { id: "c1", text: "To show gardening tips" },
          { id: "c2", text: "To show desert plants" },
          { id: "c3", text: "To grow tall trees" },
          { id: "c4", text: "To build a house" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about How to Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 14,
    pos: { x: 39.8, y: 16.8 }
  },
  {
    id: "cp_015",
    map_id: "234j3h4j3",
    title: "Promenade Garden",
    subtitle: "Promenade Garden",
    pretext: "",
    image: "",
    description:
      "Stroll along this long, graceful garden path like royalty on a parade. Every step reveals something new to see.",
    did_you_know: `<p><strong>Did you know?</strong> Promenade Gardens are designed to be long, walkable paths with beautiful views.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Promenade Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What makes Promenade Garden special?",
        choices: [
          { id: "c1", text: "It’s a long graceful path" },
          { id: "c2", text: "It’s a dense forest" },
          { id: "c3", text: "It’s a desert area" },
          { id: "c4", text: "It’s a lake" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Promenade Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 15,
    pos: { x: 39.8, y: 19 }
  },
  {
    id: "cp_016",
    map_id: "234j3h4j3",
    title: "Backyard Garden",
    subtitle: "Backyard Garden",
    pretext: "",
    image: "",
    description:
      "This garden feels just like home, only bigger and greener. It shows how anyone can grow plants in their own space.",
    did_you_know: `<p><strong>Did you know?</strong> Backyard Gardens show how everyday plants can thrive in home spaces.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Backyard Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What does Backyard Garden show?",
        choices: [
          { id: "c1", text: "How to grow plants at home" },
          { id: "c2", text: "How to grow desert plants" },
          { id: "c3", text: "How to build a bridge" },
          { id: "c4", text: "How to build a house" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Backyard Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 16,
    pos: { x: 39.8, y: 21.2 }
  },
  {
    id: "cp_017",
    map_id: "234j3h4j3",
    title: "Lifestyle Garden",
    subtitle: "Lifestyle Garden",
    pretext: "",
    image: "",
    description:
      "Plants and people work together here to make life better. Discover how gardens can be part of everyday living.",
    did_you_know: `<p><strong>Did you know?</strong> Lifestyle Gardens show how gardens can support daily life and wellbeing.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Lifestyle Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the purpose of Lifestyle Garden?",
        choices: [
          { id: "c1", text: "To show gardens in everyday life" },
          { id: "c2", text: "To show desert survival" },
          { id: "c3", text: "To show a lake" },
          { id: "c4", text: "To show mountains" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Lifestyle Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 17,
    pos: { x: 39.8, y: 23.5 }
  },
  {
    id: "cp_018",
    map_id: "234j3h4j3",
    title: "Greening Garden",
    subtitle: "Greening Garden",
    pretext: "",
    image: "",
    description:
      "This garden is all about helping the planet feel healthier. The plants here work hard to clean the air and cool the land.",
    did_you_know: `<p><strong>Did you know?</strong> Greening Gardens help reduce heat and improve air quality in urban spaces.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Greening Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the main purpose of Greening Garden?",
        choices: [
          { id: "c1", text: "To clean air and cool the land" },
          { id: "c2", text: "To grow only flowers" },
          { id: "c3", text: "To build houses" },
          { id: "c4", text: "To build roads" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Greening Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 18,
    pos: { x: 39.8, y: 25.5 }
  },
  {
    id: "cp_019",
    map_id: "234j3h4j3",
    title: "Seaside Garden",
    subtitle: "Seaside Garden",
    pretext: "",
    image: "",
    description:
      "Feel the coastal vibes as plants that love salty air grow here. It’s like a beach holiday made of leaves and flowers.",
    did_you_know: `<p><strong>Did you know?</strong> Seaside gardens feature plants that tolerate salt spray and windy conditions.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Seaside Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is special about Seaside Garden plants?",
        choices: [
          { id: "c1", text: "They tolerate salty air" },
          { id: "c2", text: "They only grow underground" },
          { id: "c3", text: "They only grow in shade" },
          { id: "c4", text: "They hate wind" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Seaside Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 19,
    pos: { x: 42.5, y: 28.5 }
  },
  {
    id: "cp_020",
    map_id: "234j3h4j3",
    title: "Melaleuca Spits",
    subtitle: "Melaleuca Spits",
    pretext: "",
    image: "",
    description:
      "Tall, spiky plants reach out like nature’s fireworks. This garden feels wild, playful, and full of surprises.",
    did_you_know: `<p><strong>Did you know?</strong> Melaleuca plants are known for their spiky leaves and strong, aromatic oils.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Melaleuca Spits. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is special about Melaleuca plants?",
        choices: [
          { id: "c1", text: "They have spiky leaves and aromatic oils" },
          { id: "c2", text: "They grow only in deserts" },
          { id: "c3", text: "They are underwater plants" },
          { id: "c4", text: "They are always red" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Melaleuca Spits <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 20,
    pos: { x: 63.5, y: 50.8 }
  },
  {
    id: "cp_021",
    map_id: "234j3h4j3",
    title: "Weird and Wonderful Garden",
    subtitle: "Weird and Wonderful Garden",
    pretext: "",
    image: "",
    description:
      "Nothing looks normal here—and that’s the fun part! Discover strange shapes, curious plants, and amazing surprises.",
    did_you_know: `<p><strong>Did you know?</strong> Weird and Wonderful Garden features unusual plants with bizarre shapes and textures.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Weird and Wonderful Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What makes this garden unique?",
        choices: [
          { id: "c1", text: "It has strange and unusual plants" },
          { id: "c2", text: "It has only grass" },
          { id: "c3", text: "It has only flowers" },
          { id: "c4", text: "It has no plants" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Weird and Wonderful Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 21,
    pos: { x: 49, y: 37.5 }
  },
  {
    id: "cp_022",
    map_id: "234j3h4j3",
    title: "Gibson Hill",
    subtitle: "Gibson Hill",
    pretext: "",
    image: "",
    description:
      "Climb up for a big view and a sense of adventure. This hill feels like a lookout in a storybook land.",
    did_you_know: `<p><strong>Did you know?</strong> Hills like Gibson Hill provide great viewpoints for seeing the whole garden layout.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Gibson Hill. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "Why is Gibson Hill special?",
        choices: [
          { id: "c1", text: "It offers a great view" },
          { id: "c2", text: "It’s a water garden" },
          { id: "c3", text: "It has no plants" },
          { id: "c4", text: "It’s underground" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Gibson Hill <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 22,
    pos: { x: 46.5, y: 42.5 }
  },
  {
    id: "cp_023",
    map_id: "234j3h4j3",
    title: "Hawson Hill",
    subtitle: "Hawson Hill",
    pretext: "",
    image: "",
    description:
      "A peaceful rise where the garden spreads out below you. It’s a perfect place to pause and feel on top of the world.",
    did_you_know: `<p><strong>Did you know?</strong> Hills like Hawson Hill provide a quiet place to rest and observe the garden.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Hawson Hill. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Hawson Hill best known for?",
        choices: [
          { id: "c1", text: "Peaceful views" },
          { id: "c2", text: "Desert plants" },
          { id: "c3", text: "A river" },
          { id: "c4", text: "A bridge" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Hawson Hill <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 23,
    pos: { x: 67, y: 37 }
  },
  {
    id: "cp_024",
    map_id: "234j3h4j3",
    title: "Arbour Garden",
    subtitle: "Arbour Garden",
    pretext: "",
    image: "",
    description:
      "Walk under leafy tunnels that feel like secret doorways. This garden feels cool, shady, and magical.",
    did_you_know: `<p><strong>Did you know?</strong> Arbour gardens are created using climbing plants over structures to form shaded tunnels.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Arbour Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is an arbour garden known for?",
        choices: [
          { id: "c1", text: "Leafy tunnels" },
          { id: "c2", text: "Sand dunes" },
          { id: "c3", text: "Cactus only" },
          { id: "c4", text: "No plants" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Arbour Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 24,
    pos: { x: 76, y: 31.5 }
  },
  {
    id: "cp_025",
    map_id: "234j3h4j3",
    title: "Woodlots",
    subtitle: "Woodlots",
    pretext: "",
    image: "",
    description:
      "Small forests filled with sturdy trees and rustling leaves. It’s a great place to listen for birds and bugs.",
    did_you_know: `<p><strong>Did you know?</strong> Woodlots are small wooded areas that support wildlife and biodiversity.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Woodlots. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is special about woodlots?",
        choices: [
          { id: "c1", text: "They support wildlife" },
          { id: "c2", text: "They are only for flowers" },
          { id: "c3", text: "They have no trees" },
          { id: "c4", text: "They are made of sand" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Woodlots <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 25,
    pos: { x: 79, y: 40 }
  },
  {
    id: "cp_026",
    map_id: "234j3h4j3",
    title: "Cultivar Garden",
    subtitle: "Cultivar Garden",
    pretext: "",
    image: "",
    description:
      "Meet plants that have been carefully grown by people over time. Each one has a special look or talent.",
    did_you_know: `<p><strong>Did you know?</strong> Cultivar gardens feature plants selected for special traits like colour, shape, or hardiness.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Cultivar Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What are cultivar plants known for?",
        choices: [
          { id: "c1", text: "Special traits selected by people" },
          { id: "c2", text: "Growing only in deserts" },
          { id: "c3", text: "Being underwater plants" },
          { id: "c4", text: "Never blooming" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Cultivar Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 26,
    pos: { x: 71, y: 43 }
  },
  {
    id: "cp_027",
    map_id: "234j3h4j3",
    title: "Research Garden",
    subtitle: "Research Garden",
    pretext: "",
    image: "",
    description:
      "Behind the scenes of the garden, this space is all about learning and care.",
    did_you_know: `<p><strong>Did you know?</strong> Research Gardens help scientists study plant growth, climate response, and biodiversity.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Research Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the purpose of Research Garden?",
        choices: [
          { id: "c1", text: "To study plants and learn new things" },
          { id: "c2", text: "To grow only food crops" },
          { id: "c3", text: "To host concerts only" },
          { id: "c4", text: "To build roads" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Research Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 27,
    pos: { x: 77, y: 43 }
  },
  {
    id: "cp_028",
    map_id: "234j3h4j3",
    title: "Amphitheatre",
    subtitle: "Amphitheatre",
    pretext: "",
    image: "",
    description:
      "A giant outdoor stage made by nature itself. Imagine stories, music, and performances coming alive here.",
    did_you_know: `<p><strong>Did you know?</strong> Amphitheatres use natural slopes to create seating areas and great acoustics.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of the Amphitheatre. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is the Amphitheatre best known for?",
        choices: [
          { id: "c1", text: "Natural outdoor stage" },
          { id: "c2", text: "Desert plants" },
          { id: "c3", text: "A lake" },
          { id: "c4", text: "A bridge" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Amphitheatre <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 28,
    pos: { x: 70, y: 46 }
  },
  {
    id: "cp_029",
    map_id: "234j3h4j3",
    title: "Rockpool Pavilion",
    subtitle: "Rockpool Pavilion",
    pretext: "",
    image: "",
    description:
      "Inspired by rocky pools near the ocean, this spot feels cool and splashy. Look closely and imagine tiny sea creatures nearby.",
    did_you_know: `<p><strong>Did you know?</strong> Rockpool pavilions mimic coastal rock pools, with plants and textures that reflect seaside life.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Rockpool Pavilion. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What does Rockpool Pavilion mimic?",
        choices: [
          { id: "c1", text: "Coastal rock pools" },
          { id: "c2", text: "Desert dunes" },
          { id: "c3", text: "Mountain peaks" },
          { id: "c4", text: "Deep ocean trenches" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Rockpool Pavilion <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 29,
    pos: { x: 50.7, y: 48.8 }
  },
  {
    id: "cp_030",
    map_id: "234j3h4j3",
    title: "Serpentine Path",
    subtitle: "Serpentine Path",
    pretext: "",
    image: "",
    description:
      "A gently winding path through the arid gardens. Follow the curves. Straight lines are overrated here.",
    did_you_know: `<p><strong>Did you know?</strong> Serpentine paths are designed to slow your walk and encourage discovery.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Serpentine Path. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "Why is the Serpentine Path shaped this way?",
        choices: [
          { id: "c1", text: "To slow your walk and encourage discovery" },
          { id: "c2", text: "To make it shorter" },
          { id: "c3", text: "To be a straight line" },
          { id: "c4", text: "To avoid plants" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Serpentine Path <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 30,
    pos: { x: 50.7, y: 48.8 }
  },
  {
    id: "cp_031",
    map_id: "234j3h4j3",
    title: "Kids Backyard",
    subtitle: "Kids Backyard",
    pretext: "",
    image: "",
    description:
      "A playful space under the eucalypts, designed for exploration and learning. Built for curious minds and energetic legs.",
    did_you_know: `<p><strong>Did you know?</strong> Kids Backyards are designed to be interactive and sensory-friendly for children.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Kids Backyard. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Kids Backyard designed for?",
        choices: [
          { id: "c1", text: "Play and discovery" },
          { id: "c2", text: "Only quiet walking" },
          { id: "c3", text: "Only adult gardening" },
          { id: "c4", text: "Only flowers" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Kids Backyard <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 31,
    pos: { x: 63.5, y: 50.8 }
  },
  {
    id: "cp_032",
    map_id: "234j3h4j3",
    title: "Home Garden",
    subtitle: "Home Garden",
    pretext: "",
    image: "",
    description:
      "A stroll through different styles of Australian home gardens from past to present. Like time travel, but with more mulch.",
    did_you_know: `<p><strong>Did you know?</strong> Home Gardens are designed to show real-life gardening ideas for small spaces.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Home Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Home Garden best for?",
        choices: [
          { id: "c1", text: "Small space gardening ideas" },
          { id: "c2", text: "Desert plants only" },
          { id: "c3", text: "Only trees" },
          { id: "c4", text: "Only flowers" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Home Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 32,
    pos: { x: 64, y: 55.5 }
  },
  {
    id: "cp_033",
    map_id: "234j3h4j3",
    title: "Future Garden",
    subtitle: "Future Garden",
    pretext: "",
    image: "",
    description:
      "A semi-enclosed garden that invites you closer to the plants. Those red-and-white poles show how tall things may grow. Patience pays off.",
    did_you_know: `<p><strong>Did you know?</strong> Future Gardens explore innovative gardening ideas like sustainability and new plant varieties.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Future Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Future Garden about?",
        choices: [
          { id: "c1", text: "New and innovative gardening ideas" },
          { id: "c2", text: "Old-fashioned gardening only" },
          { id: "c3", text: "Only trees" },
          { id: "c4", text: "No plants" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Future Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 33,
    pos: { x: 64, y: 60.5 }
  },
  {
    id: "cp_034",
    map_id: "234j3h4j3",
    title: "Rockpool Waterway",
    subtitle: "Rockpool Waterway",
    pretext: "",
    image: "",
    description:
      "Look out for the giant sculptures and cool flowing water as you wander past.",
    did_you_know: `<p><strong>Did you know?</strong> Water Saving Gardens feature plants that thrive with minimal water.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Rockpool Waterway. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is Rockpool Waterway known for?",
        choices: [
          { id: "c1", text: "Plants that thrive with less water" },
          { id: "c2", text: "Plants that need constant water" },
          { id: "c3", text: "No plants" },
          { id: "c4", text: "Only flowers" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Rockpool Waterway <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 34,
    pos: { x: 60, y: 65 }
  },
  {
    id: "cp_035",
    map_id: "234j3h4j3",
    title: "Diversity Garden",
    subtitle: "Diversity Garden",
    pretext: "",
    image: "",
    description:
      "A compact snapshot of Australia’s many bioregions. One small space, a big reminder of just how varied this place really is.",
    did_you_know: `<p><strong>Did you know?</strong> Diversity Gardens show how different plants support each other in ecosystems.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Diversity Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What does Diversity Garden celebrate?",
        choices: [
          { id: "c1", text: "Different plants living together" },
          { id: "c2", text: "Only one type of plant" },
          { id: "c3", text: "No plants" },
          { id: "c4", text: "Only desert plants" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Diversity Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 35,
    pos: { x: 62, y: 69.5 }
  }
];



export type OnboardingQuestionsChoices = {
  id: string;
  text: string;
}
export type OnboardingQuestions = {
  id: string;
  question: string;
  description: string;
  type: "checkbox" | "radio";
  cta: {
    idle: string;
    active: string;
  }
  choices: OnboardingQuestionsChoices[];
}

export const onboardingQuestions: OnboardingQuestions[] = [
    {
    id: "nm439s3",
    question: "From where does your journey begin?",
    description: "From which land do you hail?",
    type: "radio",
    cta: {
      idle: "Choose a location",
      active: "Continue",
    },
    choices: [
      {
        id: "q3c1",
        text: "I’m a local",
      },
      {
        id: "q3c2",
        text: "Melbourne metropolis 🏙️",
      },
      {
        id: "q3c3",
        text: "Regional Victoria 🏞️",
      },
      {
        id: "q3c4",
        text: "From across Australia 🌊",
      },
      {
        id: "q3c5",
        text: "From distant lands afar ✈️",
      }
    ]
  },
  {
    id: "nm439s1",
    question: "Who's adventuring today?",
    description: "So we can shape your future quests!",
    type: "radio",
    cta: {
      idle: "Choose your party",
      active: "Start journey",
    },
    choices: [
      {
        id: "q1c1",
        text: "Just me, the lone wanderer 🧭",
      },
      {
        id: "q1c2",
        text: "A trusty companion or band of friends (how many?) 🏹",
      },
      {
        id: "q1c3",
        text: "Kids, family, or a merry crew of little explorers (how many?) 🐾",
      },
    ]
  },
  {
    id: "nm439s2",
    question: "Your adventurer age band (tick all that apply!)",
    description: "What is your company’s leve of expertise?",
    type: "checkbox",
    cta: {
      idle: "Select age group(s)",
      active: "Next",
    },
    choices: [
      {
        id: "q2c1",
        text: "Tiny traveler: 0–12 🌱",
      },
      {
        id: "q2c2",
        text: "Young squire: 13–17 ⚔️",
      },
      {
        id: "q2c3",
        text: "Bold wanderer: 18–24 🌟",
      },
      {
        id: "q2c4",
        text: "Seasoned explorer: 25–34 🏔️",
      },
      {
        id: "q2c5",
        text: "Veteran voyager: 35–44 🛶",
      },
      {
        id: "q2c6",
        text: "Sage adventurer: 45–54 🗺️",
      },
      {
        id: "q2c7",
        text: "Wise pathfinder: 55–64 🔮",
      },
      {
        id: "q2c8",
        text: "Legendary quester: 65+ 🏰",
      },
    ]
  }
]


export const users: User[] = [
  {
    "id": "a9f3k2",
    "username": "questoria@gmail.com",
    "firstname": "John",
    "lastname": "Doe",
    "email": "questoria@gmail.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "q7m2x9",
    "username": "sofia.ramirez@example.com",
    "firstname": "Sofia",
    "lastname": "Ramirez",
    "email": "sofia.ramirez@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "w8c5d1",
    "username": "ethan.brooks@example.com",
    "firstname": "Ethan",
    "lastname": "Brooks",
    "email": "ethan.brooks@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "r4t6p0",
    "username": "ava.nguyen@example.com",
    "firstname": "Ava",
    "lastname": "Nguyen",
    "email": "ava.nguyen@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "m2z9l7",
    "username": "noah.peterson@example.com",
    "firstname": "Noah",
    "lastname": "Peterson",
    "email": "noah.peterson@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "k8y3n5",
    "username": "isabella.hughes@example.com",
    "firstname": "Isabella",
    "lastname": "Hughes",
    "email": "isabella.hughes@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "f6v1b4",
    "username": "lucas.bennett@example.com",
    "firstname": "Lucas",
    "lastname": "Bennett",
    "email": "lucas.bennett@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "h3q7r2",
    "username": "mia.sullivan@example.com",
    "firstname": "Mia",
    "lastname": "Sullivan",
    "email": "mia.sullivan@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "p5w8x0",
    "username": "oliver.diaz@example.com",
    "firstname": "Oliver",
    "lastname": "Diaz",
    "email": "oliver.diaz@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  },
  {
    "id": "t9k4m6",
    "username": "emma.foster@example.com",
    "firstname": "Emma",
    "lastname": "Foster",
    "email": "emma.foster@example.com",
    "password": "Welcome1!",
    "avatar": "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    "xp": 8080,
    "gems": 0,
    "onboarding": true,
    "created_at": "2026-01-19 14:54:06.195804+00"
  }
]

export type UserMap = {
    id: string;
    user_id: string;
    map_id: string;
    onboarding_questions: {
        nm439s1: string;
        nm439s2: string;
        nm439s3: string;
    };
}
export const user_maps:UserMap[] = [
  {
    id: "6jidlm3",
    user_id: "a9f3k2",
    map_id: "234j3h4j3",
    onboarding_questions: {
      "nm439s1": "",
      "nm439s2": "",
      "nm439s3": "",
    }
  }
]


export type UserCheckpoint = {
    id: string;
    user_id: string;
    checkpoint_id: string;
    is_visited: boolean;
    selfie: string;
    quiz: string;
    happiness: number;
    gems_collected: number;
}
export const user_checkpoints:UserCheckpoint[] = [
  {
    id:"9lpgjma2",
    user_id: "a9f3k2",
    checkpoint_id: "234jfgfg1",
    is_visited: false,
    "selfie": "",
    "quiz": "",
    "happiness": 0,
    gems_collected: 0
  }
]