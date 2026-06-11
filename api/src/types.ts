export type Bindings = {
  survey_builder: D1Database;
  BUCKET: R2Bucket;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

export type Variables = {
    user: any | null;
    session: any | null;
};