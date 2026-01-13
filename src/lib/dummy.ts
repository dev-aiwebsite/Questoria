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


export type Checkpoints = {
    id: string;
    map_id: string;
    title: string;
    subtitle: string;
    pretext: string;
    image: string;
    description: string;
    challenges: checkpointChallenges[];
    is_visited: boolean;
    order: number;
}
export const checkpoints: Checkpoints[] = [
  {
    id: "234jfgfg1",
    map_id: "234j3h4j3",
    title: "Always start here - The Visitor Centre",
    subtitle: "Starting point",
    pretext: "The quest awaits! Make your way to The Visitor Centre to begin your adventure.",
    image: "/images/maps/map1-checkpoint-1.jpg",
    description: `<p><strong>Did you know?</strong> The stunning gardens you will be exploring began as a bold vision back in 1846, when land beside the Yarra River was set aside to create a botanical haven, making these gardens one of Victoria’s oldest and most cherished green treasures with nearly 180 years of plant-loving history!</p>

<p>Over the decades, legendary botanists like <strong>Ferdinand von Mueller</strong> expanded the Garden’s scientific reach, building one of Australia’s most important plant collections and establishing the National Herbarium of Victoria, which now houses more than a million plant specimens!</p>

<p>The Visitor Centre you see today stands amid this legacy of exploration, discovery, science, conservation and culture — welcoming over two million visitors each year to learn, wander and connect with nature and history alike.</p>
`,
    is_visited: true,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of the Visitor Centre. <strong>(Earn 1 Quest Gem)</strong>" },
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
      { title: "happiness", description: "Tell us what you feel about the Visitor Centre <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 1,
  },
  {
    id: "234jfgfb2",
    map_id: "234j3h4j3",
    title: "Ironbark Garden",
    subtitle: "Ironbark Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Ironbark trees have incredibly hard bark that helps protect them from bushfires.</p>`,
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
  },
  {
    id: "234jfgfb3",
    map_id: "234j3h4j3",
    title: "Box Garden",
    subtitle: "Box Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Box trees are often used in formal gardens because they can be trimmed into neat shapes that last for decades.</p>`,
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
  },
  {
    id: "234jfgfg4",
    map_id: "234j3h4j3",
    title: "Peppermint Garden",
    subtitle: "Peppermint Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Australian native peppermint trees have leaves that smell minty and can repel insects.</p>`,
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
  },
  {
    id: "234jfgfb5",
    map_id: "234j3h4j3",
    title: "Bloodwood Garden",
    subtitle: "Bloodwood Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Bloodwood trees are named for their red sap, which was traditionally used by Aboriginal people for medicine and art.</p>`,
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
  },
  {
    id: "234jfgfb6",
    map_id: "234j3h4j3",
    title: "Stringbark Garden",
    subtitle: "Stringbark Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Stringbark trees have long, fibrous bark that peels off in strings, giving the garden its name.</p>`,
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
  },
  {
    id: "234jfgfb7",
    map_id: "234j3h4j3",
    title: "Arid Garden",
    subtitle: "Arid Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Plants in the Arid Garden survive with very little water by storing moisture in their leaves, stems, or roots.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Arid Garden. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "How do arid plants survive?",
        choices: [
          { id: "c1", text: "They grow very fast" },
          { id: "c2", text: "They store water in their leaves, stems, or roots" },
          { id: "c3", text: "They attract rain" },
          { id: "c4", text: "They only grow at night" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Arid Garden <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 7,
  },
  {
    id: "234jfgfb8",
    map_id: "234j3h4j3",
    title: "Desert Discovery Camp",
    subtitle: "Desert Discovery Camp",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> The Desert Discovery Camp shows plants that thrive in harsh, dry conditions, teaching us how to adapt to extreme climates.</p>`,
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
    order: 8,
  },
  {
    id: "234jfgfb4",
    map_id: "234j3h4j3",
    title: "Forest Clearing",
    subtitle: "Forest Clearing",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Forest clearings are important for wildlife, providing sunny spots where plants and insects can thrive.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Forest Clearing. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "Why are forest clearings important?",
        choices: [
          { id: "c1", text: "They provide sunny spots for plants and insects" },
          { id: "c2", text: "They prevent trees from growing" },
          { id: "c3", text: "They are used for camping only" },
          { id: "c4", text: "They hold water underground" },
        ],
        correct_answer: "c1",
      },
      { title: "happiness", description: "Tell us what you feel about Forest Clearing <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 9,
  },
  {
    id: "234jfgfb9",
    map_id: "234j3h4j3",
    title: "Scribbly Path",
    subtitle: "Scribbly Path",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> The Scribbly Path is named for the patterns scribbled into tree bark by moth larvae as they tunnel through.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Scribbly Path. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What creates the “scribbles” on the trees?",
        choices: [
          { id: "c1", text: "Birds carving into bark" },
          { id: "c2", text: "Moth larvae tunneling" },
          { id: "c3", text: "Falling branches" },
          { id: "c4", text: "Tree growth patterns" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Scribbly Path <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 10,
  },
  {
    id: "234jfgfb10",
    map_id: "234j3h4j3",
    title: "Forest Garden",
    subtitle: "Forest Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> Forest Gardens show layers of vegetation from ground cover to tall canopy trees, mimicking natural forests.</p>`,
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
    order: 11,
  },
  {
    id: "234jfgfb11",
    map_id: "234j3h4j3",
    title: "Rift Path",
    subtitle: "Rift Path",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> The Rift Path winds through rocky terrain, where you can see how plants adapt to thin soils and cracks in rocks.</p>`,
    is_visited: false,
    challenges: [
      { title: "selfie", description: "Snap a magical moment! Capture a selfie or photo of Rift Path. <strong>(Earn 1 Quest Gem)</strong>" },
      {
        title: "quiz",
        description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
        question: "What is unique about the plants along Rift Path?",
        choices: [
          { id: "c1", text: "They float on water" },
          { id: "c2", text: "They grow in thin soils and cracks" },
          { id: "c3", text: "They change color seasonally" },
          { id: "c4", text: "They grow taller than trees" },
        ],
        correct_answer: "c2",
      },
      { title: "happiness", description: "Tell us what you feel about Rift Path <strong>(Earn 1 Quest Gem)</strong>" },
    ],
    order: 12,
  },
  {
    id: "234jfgfb12",
    map_id: "234j3h4j3",
    title: "Gondwana Garden",
    subtitle: "Gondwana Garden",
    pretext: "",
    image: "",
    description: `<p><strong>Did you know?</strong> The Gondwana Garden features ancient plant lineages that have been around since the supercontinent Gondwana existed millions of years ago.</p>`,
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
    order: 13,
  },
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
        id: "question1",
        question: "Fill in Your Party and Origins Before You Wander",
        description: "Who joins you in this grand adventure?",
        type: "radio",
        cta: {
            idle: "Choose your party",
            active: "Continue",
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
        id: "question2",
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
    },
    {
        id: "question3",
        question: "From where does your journey begin?",
        description: "From which land do you hail?",
        type: "radio",
        cta: {
            idle: "Choose a location",
            active: "Start journey",
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
]



export type User=  {
    id: string;
    name: string;
    avatar: string;
    onboarding: boolean;
    xp: number;
}

export const users:User[] = [
  {
    id: "a9f3k2",
    name: "Liam Carter",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "q7m2x9",
    name: "Sofia Ramirez",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "w8c5d1",
    name: "Ethan Brooks",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "r4t6p0",
    name: "Ava Nguyen",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "m2z9l7",
    name: "Noah Peterson",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "k8y3n5",
   
    name: "Isabella Hughes",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "f6v1b4",
    name: "Lucas Bennett",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "h3q7r2",
    name: "Mia Sullivan",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "p5w8x0",
    name: "Oliver Diaz",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
  {
    id: "t9k4m6",
    name: "Emma Foster",
    avatar: "https://ucarecdn.com/dece9b56-f8b8-4bda-aeeb-1bf2614c1f73/-/preview/286x479/",
    onboarding: true,
    xp: 8080,
  },
];
