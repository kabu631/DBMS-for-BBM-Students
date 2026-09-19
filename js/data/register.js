/**
 * register.js — tiny loader used by the per-unit content files.
 *
 * syllabus-data.js defines SYLLABUS_DATA first. Each js/data/unit-N.js file
 * then calls registerUnit(...) to replace (or add) its unit, and
 * registerUnitExtras(...) to attach the plain-language intro, exam corner and
 * self-test quiz onto a unit without rewriting its topics.
 *
 * Keeping each unit in its own file means one unit can be edited without
 * touching a 200 KB blob, and everything still ships as plain static files
 * that GitHub Pages can serve with no build step.
 */

function registerUnit(unit) {
  if (typeof SYLLABUS_DATA === "undefined" || !SYLLABUS_DATA.units) return;
  const idx = SYLLABUS_DATA.units.findIndex(u => u.id === unit.id);
  if (idx >= 0) {
    // Preserve extras already attached to the old unit object.
    const previous = SYLLABUS_DATA.units[idx];
    SYLLABUS_DATA.units[idx] = Object.assign({}, previous, unit);
  } else {
    SYLLABUS_DATA.units.push(unit);
  }
}

function registerUnitExtras(unitId, extras) {
  if (typeof SYLLABUS_DATA === "undefined" || !SYLLABUS_DATA.units) return;
  const unit = SYLLABUS_DATA.units.find(u => u.id === unitId);
  if (!unit) return;
  Object.assign(unit, extras);
}

/**
 * Append more topics to a unit that was already registered. Long units are
 * split across two files so each file stays a readable size.
 */
function appendTopics(unitId, topics) {
  if (typeof SYLLABUS_DATA === "undefined" || !SYLLABUS_DATA.units) return;
  const unit = SYLLABUS_DATA.units.find(u => u.id === unitId);
  if (!unit) return;
  unit.topics = (unit.topics || []).concat(topics);
}

/** Terms shown on the Glossary page. Unit files append to this list. */
const GLOSSARY = [];

function registerGlossary(unitLabel, terms) {
  terms.forEach(t => GLOSSARY.push({ term: t[0], def: t[1], unit: unitLabel }));
}
