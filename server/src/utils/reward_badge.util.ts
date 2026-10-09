export const requirement_type = {
  APPROVED_CONTRIBUTIONS: "APPROVED_CONTRIBUTIONS",
  APPROVED_MISINFORMATION: "APPROVED_MISINFORMATION",
  APPROVED_MEDIA: "APPROVED_MEDIA",
  TOTAL_POINTS: "TOTAL_POINTS",
} as const;

export const badge = [
  {
    name: "First Contribution",
    description: "Awarded after the user's first approved contribution.",
    requirement_type: requirement_type.APPROVED_CONTRIBUTIONS,
    requirement_value: 1,
  },
  {
    name: "Community Voice",
    description: "Awarded after 10 approved contributions.",
    requirement_type: requirement_type.APPROVED_CONTRIBUTIONS,
    requirement_value: 10,
  },
  {
    name: "Active Contributor",
    description: "Awarded after 50 approved contributions.",
    requirement_type: requirement_type.APPROVED_CONTRIBUTIONS,
    requirement_value: 50,
  },
  {
    name: "Community Advocate",
    description: "Awarded after 100 approved contributions.",
    requirement_type: requirement_type.APPROVED_CONTRIBUTIONS,
    requirement_value: 100,
  },
  {
    name: "Misinformation Fighter",
    description: "Awarded after 5 approved misinformation reports.",
    requirement_type: requirement_type.APPROVED_MISINFORMATION,
    requirement_value: 5,
  },
  {
    name: "Truth Defender",
    description: "Awarded after 25 approved misinformation reports.",
    requirement_type: requirement_type.APPROVED_MISINFORMATION,
    requirement_value: 25,
  },
  {
    name: "Misinformation Guardian",
    description: "Awarded after 100 approved misinformation reports.",
    requirement_type: requirement_type.APPROVED_MISINFORMATION,
    requirement_value: 100,
  },
  {
    name: "Media Contributor",
    description: "Awarded after 10 approved media contributions.",
    requirement_type: requirement_type.APPROVED_MEDIA,
    requirement_value: 10,
  },
  {
    name: "Media Creator",
    description: "Awarded after 50 approved media contributions.",
    requirement_type: requirement_type.APPROVED_MEDIA,
    requirement_value: 50,
  },
  {
    name: "Point Collector",
    description: "Awarded after earning 5,000 total points.",
    requirement_type: requirement_type.TOTAL_POINTS,
    requirement_value: 5000,
  },
  {
    name: "Rising Advocate",
    description: "Awarded after earning 10,000 total points.",
    requirement_type: requirement_type.TOTAL_POINTS,
    requirement_value: 10000,
  },
  {
    name: "Community Champion",
    description: "Awarded after earning 50,000 total points.",
    requirement_type: requirement_type.TOTAL_POINTS,
    requirement_value: 50000,
  },
  {
    name: "Community Guardian",
    description: "Awarded after earning 100,000 total points.",
    requirement_type: requirement_type.TOTAL_POINTS,
    requirement_value: 100000,
  },
];

export const Reward = [
  {
    name: "Newcomer",
    description: "A new member who has started participating in the community.",
    min_points: 0,
  },
  {
    name: "Contributor",
    description: "A member who has started making regular contributions.",
    min_points: 500,
  },
  {
    name: "Active Contributor",
    description: "A member who consistently contributes useful information.",
    min_points: 1500,
  },
  {
    name: "Supporter",
    description: "A reliable member who actively supports the community.",
    min_points: 3000,
  },
  {
    name: "Community Supporter",
    description: "A member with a strong history of meaningful contributions.",
    min_points: 5000,
  },
  {
    name: "Advocate",
    description:
      "A trusted member who consistently contributes verified information.",
    min_points: 10000,
  },
  {
    name: "Trusted Advocate",
    description:
      "A highly trusted community member with significant contributions.",
    min_points: 20000,
  },
  {
    name: "Community Leader",
    description:
      "A leading contributor who has made a substantial impact on the community.",
    min_points: 35000,
  },
  {
    name: "Community Champion",
    description:
      "An exceptional contributor with a long history of meaningful participation.",
    min_points: 50000,
  },
  {
    name: "Community Guardian",
    description:
      "The highest recognition for exceptionally active and trusted community members.",
    min_points: 100000,
  },
];

export const RuleEnum = {
  EXPERIENCE: "EXPERIENCE",
  MISINFORMATION: "MISINFORMATION",
  MEDIA: "MEDIA",
} as const;

export const Rule = [
  {
    action_type: RuleEnum.EXPERIENCE,
    points: 100,
    is_active: true,
  },
  {
    action_type: RuleEnum.MISINFORMATION,
    points: 250,
    is_active: true,
  },
  {
    action_type: RuleEnum.MEDIA,
    points: 150,
    is_active: true,
  },
];
