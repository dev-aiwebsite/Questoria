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
        featured_image: "/images/img10.jpg",
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
            {
                title: "selfie",
                description: "Snap a magical moment! Capture a selfie or photo of the Visitor Centre. <strong>(Earn 1 Quest Gem)</strong>",

            },
            {
                title: "quiz",
                description: "Answer the quiz <strong>(Earn 1 Quest Gem)</strong>",
                question: "When was the Victoria Botanical Gardens originally founded?",
                choices: [
                    { id: "c1", text: "1820" },
                    { id: "c2", text: "1846" },
                    { id: "c3", text: "1901" },
                    { id: "c4", text: "1988" }],
                correct_answer: "c2",
            },
            {
                title: "happiness",
                description: "Tell us what you feel about the Visitor Centre <strong>(Earn 1 Quest Gem)</strong>",
            }
        ],
        order: 1

    },
    {
        id: "234jfgfb2",
        map_id: "234j3h4j3",
        title: "Ironbark Garden",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 2
    },
    {
        id: "234jfgfb3",
        map_id: "234j3h4j3",
        title: "Box Garden",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 3
    },
    {
        id: "234jfgfg4",
        map_id: "234j3h4j3",
        title: "Peppermint Garden",
        subtitle: "Peppermint Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 4
    },
    {
        id: "234jfgfb5",
        map_id: "234j3h4j3",
        title: "Bloodwood Garden",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 5
    },
    {
        id: "234jfgfb6",
        map_id: "234j3h4j3",
        title: "Stringbark Garden",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 6
    },
    {
        id: "234jfgfb7",
        map_id: "234j3h4j3",
        title: "Arid Garden",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 7
    },
    {
        id: "234jfgfb8",
        map_id: "234j3h4j3",
        title: "Desert Discovery Camp",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 8
    },
    {
        id: "234jfgfb4",
        map_id: "234j3h4j3",
        title: "Forest Clearing",
        subtitle: "Ironbark Garden",
        pretext: "",
        image: "",
        description: ``,
        challenges: [],
        is_visited: false,
        order: 9
    },
]

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