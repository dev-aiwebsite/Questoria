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
        description: "Who joins you in this grand adventure?",
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
        description: "Who joins you in this grand adventure?",
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