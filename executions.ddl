CREATE TABLE TESTS (
  id SERIAL PRIMARY KEY,
  category INTEGER NOT NULL,
  name TEXT NOT NULL,
  time INTEGER NOT NULL,
  questions INTEGER NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT NULL
);

CREATE TABLE QUESTIONS (
  question_id SERIAL PRIMARY KEY,
  from_test INTEGER NOT NULL,
  nullable BOOLEAN NOT NULL,
  multi_choice BOOLEAN NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE OPTIONS (
  option_id SERIAL PRIMARY KEY,
  from_question INTEGER NOT NULL,
  content TEXT NOT NULL,
  comment TEXT DEFAULT NULL
);

CREATE TABLE RESULTS (
  result_id SERIAL PRIMARY KEY,
  from_test INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT DEFAULT NULL,
  content TEXT NOT NULL
);

INSERT INTO TESTS (category, name, time, questions, description)
VALUES (0, 'MBTI2', 15, 42, 'Myers–Briggs Type Indicator, or MBTI, is an introspecitve self-report questionnaire indicating differing psychological perferances in how people perceive the world and make decisions. In MBTI model, individuals are classified as 16 types by their personalities. The result is widely used for job evaluation and self-identificaton.');
