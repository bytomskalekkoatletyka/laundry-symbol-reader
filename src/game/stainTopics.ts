/**
 * Eight bundled stain topics. The advice is conservative and detergent-based;
 * it never suggests bleach, solvents or a hotter wash than the selected
 * garment's own label allows.
 */

import { CareRestrictions } from './labelRules';
import { normalize } from './catalog';

export type StainTopic = {
  id: string;
  title: string;
  firstAction: string;
  steps: [string, string, string];
  usesBleach: boolean;
  usesWashing: boolean;
};

export const SHARED_CLOSING = 'Check before drying; repeat appropriate treatment if needed';

export const STAIN_TOPICS: StainTopic[] = [
  {
    id: 'coffee_tea',
    title: 'Coffee / tea',
    firstAction: 'Cool water',
    steps: [
      'Rinse or soak the mark in cool water',
      'Pretreat with a suitable laundry detergent',
      'Wash within the label limits',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'grease_oil',
    title: 'Grease / oil',
    firstAction: 'Pretreat',
    steps: [
      'Lift the excess without rubbing it in',
      'Apply a suitable liquid laundry detergent',
      'Wash within the label limits',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'grass',
    title: 'Grass',
    firstAction: 'Pretreat',
    steps: [
      'Use a fabric-compatible stain product',
      'Follow the product instructions',
      'Wash within the label limits',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'tomato',
    title: 'Tomato sauce',
    firstAction: 'Remove excess',
    steps: [
      'Lift the residue off the surface',
      'Rinse the reverse side with cold water',
      'Pretreat and wash as the label allows',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'chocolate',
    title: 'Chocolate',
    firstAction: 'Lift excess',
    steps: [
      'Remove the loose chocolate',
      'Soak the mark in cool water',
      'Pretreat and wash as the label allows',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'ink',
    title: 'Ink',
    firstAction: 'Identify the mark',
    steps: [
      'Blot gently without spreading the ink',
      'Use a fabric-compatible ink product as directed',
      'Rinse, then wash only if the label permits it',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'blood',
    title: 'Blood',
    firstAction: 'Cold water',
    steps: [
      'Rinse a fresh mark with cold water',
      'Pretreat with a suitable detergent',
      'Wash within the label limits',
    ],
    usesBleach: false,
    usesWashing: true,
  },
  {
    id: 'mud',
    title: 'Mud',
    firstAction: 'Let mud dry',
    steps: [
      'Let the mud dry completely',
      'Brush the dried soil away',
      'Pretreat with detergent and wash as labelled',
    ],
    usesBleach: false,
    usesWashing: true,
  },
];

export function searchTopics(query: string): StainTopic[] {
  const q = normalize(query);
  if (q.length === 0) {
    return STAIN_TOPICS;
  }
  return STAIN_TOPICS.filter(
    t => normalize(t.title + ' ' + t.firstAction + ' ' + t.steps.join(' ')).indexOf(q) >= 0,
  );
}

export type AdviceContext = {
  /** Replaces home-washing steps when the garment must not be washed. */
  replaceWithProfessional: boolean;
  /** Short note shown above the steps. */
  note: string;
};

/** Applies the selected garment's own restrictions to a topic. */
export function adviceContext(
  restrictions: CareRestrictions | null,
  hasGarment: boolean,
): AdviceContext {
  if (!hasGarment || !restrictions) {
    return {
      replaceWithProfessional: false,
      note: 'Check the original care label before treating',
    };
  }
  if (restrictions.washAllowed === 'no') {
    return {
      replaceWithProfessional: true,
      note: 'This garment must not be washed at home',
    };
  }
  if (restrictions.washAllowed === 'unknown') {
    return {
      replaceWithProfessional: false,
      note: 'Check the original care label before treating',
    };
  }
  const temp =
    restrictions.maxWashTemp !== null
      ? 'Wash no hotter than ' + restrictions.maxWashTemp + '°C'
      : 'Keep within the label temperature';
  const bleach =
    restrictions.bleachAllowed === 'no'
      ? '. Do not bleach'
      : restrictions.bleachAllowed === 'oxygen'
      ? '. Oxygen bleach only'
      : '';
  return { replaceWithProfessional: false, note: temp + bleach };
}

export const PROFESSIONAL_STEP = 'Ask a professional cleaner about this stain';
