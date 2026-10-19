import figma from '../assets/heir/tools/01_figma.svg?raw';
import r from '../assets/homepage/tools/04_r.svg?raw';
import sql from '../assets/heir/tools/sql.svg?raw';
import mixpanel from '../assets/homepage/tools/06_mixpanel.svg?raw';
import datadog from '../assets/homepage/tools/07_datadog.svg?raw';
import firebase from '../assets/heir/tools/09_firebase.svg?raw';
import react from '../assets/heir/tools/11_react.svg?raw';
import qualtrics from '../assets/heir/tools/02_qualtrics.svg?raw';
import chatgpt from '../assets/heir/tools/18_chatgpt.svg?raw';
import claude from '../assets/homepage/tools/19_claude.svg?raw';
import bigquery from '../assets/homepage/tools/20_bigquery.svg?raw';
export const homepageTools = [
  { label: 'Figma', icon: figma, description: 'I design app flows, interactive prototypes, and reusable components, taking ideas from early concepts through usability testing and engineering handoff.' },
  { label: 'R', icon: r, description: 'I clean and analyze survey, usability, and behavioral data, using statistics and visualizations to turn research findings into product decisions.' },
  { label: 'SQL', icon: sql, description: 'I query and combine product data to investigate usage patterns, compare user groups, and answer questions that emerge from research.' },
  { label: 'Mixpanel', icon: mixpanel, monochrome: true, description: 'I explore user journeys, feature adoption, and retention to understand where people find value and where the experience needs attention.' },
  { label: 'Datadog', icon: datadog, description: 'I examine app and device events to understand real-world interactions, investigate friction, and connect observed behavior with participant feedback.' },
  { label: 'Firebase', icon: firebase, description: 'I define analytics events and tracking requirements with engineering to measure feature use, activation, and continued engagement across the app.' },
  { label: 'BigQuery', icon: bigquery, description: 'I bring event data together for deeper analysis, connecting individual interactions with broader patterns in engagement and product use.' },
  { label: 'React', icon: react, description: 'I work with AI coding tools to build interactive prototypes and web experiences, exploring behavior beyond what static mockups can show.' },
  { label: 'Qualtrics', icon: qualtrics, description: 'I build surveys to understand customer needs, test product priorities, and gather structured feedback that complements interviews and behavioral data.' },
  { label: 'ChatGPT', icon: chatgpt, monochrome: true, description: 'I use it to challenge research plans, explore design alternatives, and support analysis, checking its suggestions against evidence and project constraints.' },
  { label: 'Claude', icon: claude, monochrome: true, description: 'I use it to work through code, refine prototypes, and organize documentation, translating research and design decisions into working experiences.' },
];
