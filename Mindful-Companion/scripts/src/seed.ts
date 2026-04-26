import {
  db,
  journalEntriesTable,
  moodLogsTable,
  sessionsTable,
  goalsTable,
  exercisesTable,
} from "@workspace/db";

async function main() {
  console.log("Seeding Haven database...");

  // --- Exercises (replace each run so the library stays curated) ---
  await db.delete(exercisesTable);
  await db.insert(exercisesTable).values([
    {
      title: "Box Breathing",
      description:
        "A steadying four-part breath used by athletes and first responders. Use it before something hard, or to come down after.",
      category: "breathing",
      durationMinutes: 4,
      steps: [
        "Sit upright. Let your shoulders drop.",
        "Breathe in slowly through your nose for 4 counts.",
        "Hold the breath gently for 4 counts.",
        "Exhale through your mouth for 4 counts.",
        "Hold empty for 4 counts. Repeat for 4 minutes.",
      ],
    },
    {
      title: "4-7-8 Breath",
      description:
        "A longer exhale than inhale signals safety to your nervous system. Useful at night when your mind won't quiet.",
      category: "breathing",
      durationMinutes: 3,
      steps: [
        "Place the tip of your tongue behind your upper front teeth.",
        "Inhale quietly through the nose for 4 counts.",
        "Hold the breath for 7 counts.",
        "Exhale audibly through the mouth for 8 counts.",
        "Repeat for four cycles.",
      ],
    },
    {
      title: "5-4-3-2-1 Grounding",
      description:
        "Return to the present moment by naming what your senses can find right now.",
      category: "grounding",
      durationMinutes: 3,
      steps: [
        "Name 5 things you can see.",
        "Name 4 things you can feel against your skin.",
        "Name 3 things you can hear.",
        "Name 2 things you can smell, or two scents you like.",
        "Name 1 thing you can taste, or one thing you are grateful for.",
      ],
    },
    {
      title: "Body Scan",
      description:
        "A slow, non-judgmental tour through the body. Notice where you are holding what you are carrying.",
      category: "mindfulness",
      durationMinutes: 8,
      steps: [
        "Lie down or sit comfortably. Close your eyes if it feels safe.",
        "Bring attention to the crown of your head. Notice without changing.",
        "Move slowly to your forehead, jaw, neck, and shoulders.",
        "Travel down through chest, belly, hips, legs, and feet.",
        "Spend a breath with anywhere that asks for one.",
        "Open your eyes when you are ready.",
      ],
    },
    {
      title: "Cognitive Reframe",
      description:
        "Take an automatic thought and look at it from three different angles.",
      category: "cognitive",
      durationMinutes: 6,
      steps: [
        "Write down the thought exactly as it sounded in your head.",
        "Ask: what is the evidence for this thought? What is the evidence against?",
        "Ask: what would I say to a friend who told me this thought?",
        "Write a more balanced version of the thought.",
        "Notice how the new version lands in your body.",
      ],
    },
    {
      title: "Walk Without a Phone",
      description:
        "A short loop outside, no headphones, no scrolling. Movement is medicine for stuck feelings.",
      category: "movement",
      durationMinutes: 15,
      steps: [
        "Leave your phone behind, or put it on Do Not Disturb in your pocket.",
        "Walk at a pace just slightly slower than usual.",
        "Match your steps to your breath for the first minute.",
        "Look up at least three times.",
        "Return when your body feels ready.",
      ],
    },
    {
      title: "Self-Compassion Pause",
      description:
        "Three sentences to soften the inner voice when it has gone sharp.",
      category: "mindfulness",
      durationMinutes: 2,
      steps: [
        "Place a hand over your heart.",
        "Say: this is a moment of difficulty.",
        "Say: difficulty is part of being human.",
        "Say: may I be kind to myself in this moment.",
        "Take three slow breaths.",
      ],
    },
  ]);

  // Skip journal/mood/sessions/goals seeding if data already exists to be
  // friendly across multiple runs.
  const existingEntries = await db.select().from(journalEntriesTable).limit(1);
  if (existingEntries.length === 0) {
    const now = new Date();
    const daysAgo = (n: number, h = 21, m = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      d.setHours(h, m, 0, 0);
      return d;
    };

    await db.insert(journalEntriesTable).values([
      {
        title: "A quieter morning",
        content:
          "Slept better than I have in weeks. Made coffee slowly, opened the window, watched the light come in. I noticed I was already bracing for the day before anything had happened. Tried to soften the shoulders.",
        mood: 7,
        tags: ["sleep", "morning", "noticing"],
        createdAt: daysAgo(0, 8, 30),
      },
      {
        title: "Hard call with mom",
        content:
          "She asked the same question three different ways. I felt it climb up my neck. Said I had to go before I said something I would regret. Sat in the car after and just breathed for a while. That counts.",
        mood: 4,
        tags: ["family", "boundaries"],
        createdAt: daysAgo(1, 19, 45),
      },
      {
        title: "Small win at work",
        content:
          "The presentation that has been living in my head for two weeks happened, and the world did not end. M. said it was clear. I'm trying to let that land instead of explaining it away.",
        mood: 8,
        tags: ["work", "wins"],
        createdAt: daysAgo(2, 17, 0),
      },
      {
        title: "Restless",
        content:
          "Not sad, not anxious exactly. Just untethered. Couldn't read, couldn't watch anything, couldn't stop checking my phone. Went for a walk without it. Helped a little.",
        mood: 5,
        tags: ["restless", "phone"],
        createdAt: daysAgo(3, 22, 10),
      },
      {
        title: "Dinner with J.",
        content:
          "Laughed until my face hurt. Forgot, for a couple of hours, that anything was hard. Friendship as therapy. Want to remember to ask for this more often instead of waiting for it to happen.",
        mood: 9,
        tags: ["friendship", "joy"],
        createdAt: daysAgo(5, 21, 30),
      },
      {
        title: "Therapy day",
        content:
          "We went back to the thing about my dad. I cried in a way I haven't in a while. Felt wrung out for the rest of the day, but lighter underneath. Trusting the process.",
        mood: 6,
        tags: ["therapy", "grief"],
        createdAt: daysAgo(7, 18, 0),
      },
      {
        title: "Couldn't get out of bed",
        content:
          "Slept through two alarms. Cancelled the run. Tried not to make it mean anything about who I am. Some days are smaller than others.",
        mood: 3,
        tags: ["low", "rest"],
        createdAt: daysAgo(10, 11, 0),
      },
    ]);

    // Mood logs across the past 30 days, with a gentle upward arc.
    const moodValues = [
      { d: 29, score: 4, energy: 4, note: "Heavy start to the month." },
      { d: 27, score: 5, energy: 4 },
      { d: 25, score: 4, energy: 5, note: "Couldn't focus." },
      { d: 23, score: 5, energy: 5 },
      { d: 21, score: 6, energy: 6, note: "First good walk in a while." },
      { d: 19, score: 5, energy: 5 },
      { d: 17, score: 6, energy: 6 },
      { d: 15, score: 7, energy: 6, note: "Slept eight hours." },
      { d: 13, score: 6, energy: 7 },
      { d: 11, score: 7, energy: 7 },
      { d: 10, score: 3, energy: 2, note: "Stayed in bed." },
      { d: 9, score: 5, energy: 4 },
      { d: 7, score: 6, energy: 6, note: "Tough session, lighter after." },
      { d: 6, score: 6, energy: 6 },
      { d: 5, score: 9, energy: 8, note: "Dinner with J." },
      { d: 4, score: 7, energy: 6 },
      { d: 3, score: 5, energy: 5 },
      { d: 2, score: 8, energy: 7, note: "Presentation went well." },
      { d: 1, score: 4, energy: 5, note: "Hard call with mom." },
      { d: 0, score: 7, energy: 7, note: "Quiet morning." },
    ];
    await db.insert(moodLogsTable).values(
      moodValues.map((m) => ({
        score: m.score,
        energy: m.energy,
        note: m.note ?? null,
        createdAt: daysAgo(m.d, 20, 0),
      })),
    );

    // Sessions: a couple in the past, one upcoming.
    const inDays = (n: number, h = 17, m = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + n);
      d.setHours(h, m, 0, 0);
      return d;
    };

    await db.insert(sessionsTable).values([
      {
        therapistName: "Dr. Maren Holt",
        modality: "CBT",
        scheduledAt: daysAgo(14, 17, 0),
        durationMinutes: 50,
        status: "completed",
        location: "Telehealth",
        notes: "Wanted to talk about work overwhelm.",
        takeaways:
          "Name the catastrophe out loud first; it loses some teeth that way. Try the 'next true thing' framing this week.",
      },
      {
        therapistName: "Dr. Maren Holt",
        modality: "CBT",
        scheduledAt: daysAgo(7, 17, 0),
        durationMinutes: 50,
        status: "completed",
        location: "Telehealth",
        notes: "Father stuff resurfaced after the family group chat.",
        takeaways:
          "Old grief isn't a relapse. The body keeps the calendar. Be gentle around the anniversary.",
      },
      {
        therapistName: "Dr. Maren Holt",
        modality: "CBT",
        scheduledAt: inDays(2, 17, 0),
        durationMinutes: 50,
        status: "scheduled",
        location: "Telehealth",
        notes: "Bring the journal entry from Tuesday.",
      },
    ]);

    await db.insert(goalsTable).values([
      {
        title: "Set a phone-down hour after dinner",
        description:
          "One full hour, every evening, with the phone in another room. Read, walk, or just sit.",
        status: "active",
        progress: 45,
        targetDate: null,
      },
      {
        title: "Practice the cognitive reframe before reacting",
        description:
          "When the inner voice gets sharp, pause and run through the three reframe questions before responding.",
        status: "active",
        progress: 30,
        targetDate: null,
      },
      {
        title: "Write something in the journal three days a week",
        description:
          "Not every day. Three is enough. Quality over streak.",
        status: "active",
        progress: 70,
        targetDate: null,
      },
      {
        title: "Finish the workbook chapter on grief",
        description: "Two pages a sitting. No need to power through it.",
        status: "paused",
        progress: 25,
        targetDate: null,
      },
      {
        title: "Get to one therapy session a week for a full month",
        description: "Done. Hold it.",
        status: "completed",
        progress: 100,
        targetDate: null,
      },
    ]);
  } else {
    console.log("Seed data already present; skipping non-exercise rows.");
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
