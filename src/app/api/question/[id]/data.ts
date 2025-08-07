const formData = {
    id: "1753686332583",
    title: "Form title",
    description:
        "User Registration Form: Please fill out the details below to create your account.",
    cover: "[path for cover image]",
    logo: "https://avatars.githubusercontent.com/u/124599?v=4",
    questions: [
        {
            id: "1753686006767",
            type: "short-text",
            order: 1,
            title: "What is you name",
            options: [],
            required: true,
        },
        {
            id: "1753686018472",
            type: "long-text",
            order: 2,
            title: "Tell me bit about yourself?",
            options: [],
            required: false,
        },
        {
            id: "1753686028788",
            type: "multiple-choice",
            order: 3,
            title: "Choose your t-shirt",
            options: ["S", "M", "L"],
            required: true,
        },
        {
            id: "1753686065232",
            type: "dropdown",
            order: 4,
            title: "Select you nationality",
            options: ["India ", "Pakistan", "UK", "US"],
            required: true,
        },
        {
            id: "1753686144030",
            type: "checkbox",
            order: 5,
            title: "How did you find about us",
            options: ["Social media", "Refernce", "Career site"],
            required: true,
        },
    ],
    theme: "white",
    createdAt: "2025-07-28T07:05:32.583Z",
};
export { formData };