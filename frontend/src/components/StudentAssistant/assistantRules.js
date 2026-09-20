// Predefined Help Rules, Context Prompts, and Tour Steps for Student Assistant Guide

export const TOUR_STEPS = [
  {
    step: 1,
    title: "Step 1: Upload Notes",
    description: "Start by uploading your lecture notes, textbook chapters, or study PDFs in the 'Upload Notes' tab. Supported formats are PDF (.pdf) and plain text (.txt).",
    tab: "upload",
    buttonText: "Go to Upload Notes →"
  },
  {
    step: 2,
    title: "Step 2: Important Topics",
    description: "After processing, the system extracts important topics with summaries, simple explanations, detailed technical breakdowns, practical examples, key points, and exam tips.",
    tab: "topics",
    buttonText: "View Topics →"
  },
  {
    step: 3,
    title: "Step 3: Study Flashcards",
    description: "Master concepts using active recall flashcards. Choose your preferred count (5, 10, 15, 20, or Custom up to 500) and difficulty level, then flip cards and rate your mastery.",
    tab: "flashcards",
    buttonText: "Open Flashcards →"
  },
  {
    step: 4,
    title: "Step 4: Take Practice Quiz",
    description: "Test your comprehension with multiple-choice questions. Select question count and difficulty, answer MCQs, submit your quiz, and get instant score feedback with explanations.",
    tab: "quiz",
    buttonText: "Take Practice Quiz →"
  },
  {
    step: 5,
    title: "Step 5: View Performance & Analytics",
    description: "Track your quiz score percentage, review correct vs. incorrect answers, and view transparent topic-level performance metrics.",
    tab: "weak-topics",
    buttonText: "View Performance →"
  },
  {
    step: 6,
    title: "Step 6: Revision Plan",
    description: "Topics scoring below 60% accuracy are automatically flagged as 'Weak Topics' and given priority revision recommendations so you focus study time efficiently.",
    tab: "weak-topics",
    buttonText: "Open Revision Plan →"
  },
  {
    step: 7,
    title: "Step 7: Dashboard Overview",
    description: "Your personalized Dashboard gives a real-time summary of all your uploaded documents, available flashcards, quiz questions, and latest scores.",
    tab: "dashboard",
    buttonText: "Back to Dashboard →"
  }
];

export const CONTEXT_HELP = {
  dashboard: {
    greeting: "You're on the Dashboard! 👋 Here you can see your learning stats, uploaded documents, and quick study shortcuts.",
    options: [
      { id: "tour", label: "🚩 Take a Quick Tour" },
      { id: "upload", label: "📄 How to Upload Notes" },
      { id: "topics", label: "📚 How Topics Work" },
      { id: "flashcards", label: "🧠 Flashcards Guide" },
      { id: "quiz", label: "📝 Quiz Guide" }
    ]
  },
  upload: {
    greeting: "You're in Notes & Upload! 📄 Here you can convert PDF notes into structured study materials.",
    options: [
      { id: "upload", label: "Supported File Types" },
      { id: "upload_process", label: "What happens after upload?" },
      { id: "topics", label: "Where do my topics go?" }
    ]
  },
  topics: {
    greeting: "You're viewing Important Topics! 📚 Click any topic card for simple explanations, examples, and exam tips.",
    options: [
      { id: "topics", label: "What are Important Topics?" },
      { id: "topic_study", label: "How should I study a topic?" },
      { id: "flashcards", label: "Practice with Flashcards" }
    ]
  },
  flashcards: {
    greeting: "You're in Flashcards! 🧠 Choose how many cards to study (5, 10, 15, 20, or Custom) and test your recall.",
    options: [
      { id: "flashcards", label: "How Flashcards Work" },
      { id: "flashcards_count", label: "How card selection works" },
      { id: "flashcards_status", label: "Rating your cards" }
    ]
  },
  quiz: {
    greeting: "You're in Practice Quiz! 📝 Configure your question count & difficulty, answer MCQs, and submit for instant feedback.",
    options: [
      { id: "quiz", label: "How Quiz Works" },
      { id: "quiz_scoring", label: "How is score calculated?" },
      { id: "weak_topics", label: "Weak Topics & Revision" }
    ]
  },
  "weak-topics": {
    greeting: "You're in Weak Topics & Revision! 📊 Topics scoring <60% accuracy are automatically flagged for targeted review.",
    options: [
      { id: "weak_topics", label: "How Weak Topics work" },
      { id: "performance", label: "Understanding Performance" },
      { id: "quiz", label: "Take another Quiz" }
    ]
  }
};

export const PREDEFINED_HELP = {
  upload: {
    title: "Upload Notes & File Support",
    text: "You can upload PDF (.pdf) or text (.txt) files up to multi-page lecture notes. Once uploaded, text is extracted, split into manageable chunks, and automatically processed to generate Important Topics, Flashcards, and Quiz Questions.",
    actionTab: "upload",
    actionLabel: "Go to Upload Notes →"
  },
  upload_process: {
    title: "Processing & Extraction Workflow",
    text: "When you upload a file, the application parses the text, splits long content into structured chunks, extracts key concepts into 'Important Topics' with simple and detailed explanations, builds active recall Flashcards, and creates Multiple Choice Quiz Questions.",
    actionTab: "upload",
    actionLabel: "Upload Notes Now →"
  },
  topics: {
    title: "Important Topics & Detailed Breakdown",
    text: "Topics are extracted directly from your uploaded study material. Clicking any topic opens a dedicated explanation page containing:\n• Title & Summary\n• Simple Beginner Explanation\n• Detailed Technical Breakdown\n• Practical Example\n• Key Bullet Points\n• Exam & Memory Tips",
    actionTab: "topics",
    actionLabel: "View Important Topics →"
  },
  topic_study: {
    title: "How to Study Topics Effectively",
    text: "We recommend reading the 'Simple Explanation' first to grasp core concepts, then reviewing the 'Detailed Explanation' and 'Key Points'. Use the 'Memory Tip' mnemonic before taking practice quizzes.",
    actionTab: "topics",
    actionLabel: "Open Topics List →"
  },
  flashcards: {
    title: "Study Flashcards Guide",
    text: "Flashcards allow active recall practice. You can select 5, 10, 15, 20, or a Custom card count (up to 500 cards) along with difficulty levels (Easy, Medium, Hard, Mixed). Clicking a card flips it between Question and Answer. Mark cards as 'I Know This' or 'Review Again' to track progress.",
    actionTab: "flashcards",
    actionLabel: "Open Flashcards →"
  },
  flashcards_count: {
    title: "Flashcard Count & Database Sampling",
    text: "Selecting a count (e.g. 10 cards) retrieves 10 existing flashcards randomly sampled from your available notes in the database. If you request more cards than available (e.g. 250 cards when 205 exist), the app shows all 205 available cards with a helpful notice.",
    actionTab: "flashcards",
    actionLabel: "Start Flashcard Session →"
  },
  flashcards_status: {
    title: "Card Review & Shuffle",
    text: "Use 'I Know This' to mark cards you've mastered, or 'Review Again' to flag cards needing review. Use the 'Shuffle' button anytime to randomize card order for fresh practice.",
    actionTab: "flashcards",
    actionLabel: "Go to Flashcards →"
  },
  quiz: {
    title: "Practice Quiz & MCQs",
    text: "Practice Quizzes test your knowledge with multiple-choice questions. Select 5, 10, 15, 20, or a Custom question count and difficulty (Easy, Medium, Hard, Mixed). Click option A/B/C/D to answer each question, then submit to see your total score.",
    actionTab: "quiz",
    actionLabel: "Take Practice Quiz →"
  },
  quiz_scoring: {
    title: "Score Calculation & Evaluation",
    text: "Your score percentage is calculated as: (Correct Answers / Total Questions) × 100%. After submitting, a detailed Score Modal displays your score percentage, topic-by-topic breakdown, and specific explanations for each correct answer.",
    actionTab: "quiz",
    actionLabel: "Start a Quiz →"
  },
  performance: {
    title: "Performance & Learning Analytics",
    text: "The application tracks your latest quiz score, overall question count, and topic accuracy breakdown. You can review your quiz performance anytime to measure your progress.",
    actionTab: "weak-topics",
    actionLabel: "View Performance →"
  },
  weak_topics: {
    title: "Weak Topics & Targeted Revision",
    text: "Transparent Rule: Any topic where your quiz accuracy is below 60% is automatically classified as a 'Weak Topic'. The system generates targeted revision recommendations urging you to review core definitions and practice related flashcards.",
    actionTab: "weak-topics",
    actionLabel: "Open Revision Plan →"
  },
  dashboard: {
    title: "Dashboard Overview",
    text: "The Dashboard is your main learning hub. It displays current metrics (Documents count, Topics count, Flashcards count, Quiz questions count, Latest Score), recent uploaded files, and fast action shortcuts.",
    actionTab: "dashboard",
    actionLabel: "Go to Dashboard →"
  },
  account: {
    title: "Student Account & Authentication",
    text: "Your study materials, flashcards, quiz attempts, and performance stats are securely isolated under your registered student account. You can log out anytime from the sidebar.",
    actionTab: "dashboard",
    actionLabel: "View Account Info →"
  }
};

export function matchUserKeyword(input) {
  if (!input || typeof input !== 'string') return null;
  const q = input.toLowerCase().trim();

  if (q.includes("tour") || q.includes("guide") || q.includes("show me") || q.includes("around")) {
    return { type: "tour" };
  }
  if (q.includes("upload") || q.includes("pdf") || q.includes("txt") || q.includes("file") || q.includes("note")) {
    return { type: "help", key: "upload" };
  }
  if (q.includes("flashcard") || q.includes("card") || q.includes("flip") || q.includes("recall")) {
    return { type: "help", key: "flashcards" };
  }
  if (q.includes("quiz") || q.includes("test") || q.includes("mcq") || q.includes("question")) {
    return { type: "help", key: "quiz" };
  }
  if (q.includes("topic") || q.includes("concept") || q.includes("explanation") || q.includes("example")) {
    return { type: "help", key: "topics" };
  }
  if (q.includes("score") || q.includes("percent") || q.includes("grade") || q.includes("result") || q.includes("perform")) {
    return { type: "help", key: "quiz_scoring" };
  }
  if (q.includes("weak") || q.includes("revise") || q.includes("revision") || q.includes("recommend")) {
    return { type: "help", key: "weak_topics" };
  }
  if (q.includes("dash") || q.includes("home") || q.includes("stat")) {
    return { type: "help", key: "dashboard" };
  }
  if (q.includes("account") || q.includes("login") || q.includes("signup") || q.includes("user")) {
    return { type: "help", key: "account" };
  }

  return null;
}
