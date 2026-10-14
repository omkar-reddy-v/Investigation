import React from 'react';
import { Button } from '@mui/material';

const names = [
  'complaint_confirmed', 'process_related', 'corrections_or_interim_controls_required',
  'capa_plan_required', 'capa_plan_rationale', 'existing_related_capa_plan_applicable',
  'effectiveness_check_required', 'lot_specific_trend_identified',
  'lot_trend_assessment_and_rationale', 'current_conclusion', 'translated_conclusion_english'
];
export const EMPTY_FIELDS = Object.fromEntries(names.map(name => [name, '']));

function Dropdown({ name, label, options, values, onChange }) {
  return <label className="field"><span>{label}</span>
    <select value={values[name] || ''} onChange={e => onChange(name, e.target.value)}>
      <option value="" hidden></option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

function TextArea({ name, label, values, onChange }) {
  return <label className="field"><span>{label}</span>
    <textarea rows={3} value={values[name] || ''} onChange={e => onChange(name, e.target.value)} />
  </label>;
}

const yesNo = ['Yes', 'No'];
export default function InvestigationForm({ values, onChange, language }) {
  return <>
    <section className="panel"><h2>Conclusion Fields</h2><div className="two-cols">
      <Dropdown name="complaint_confirmed" label="Complaint Confirmed" options={['Confirmed', 'Unconfirmed']} values={values} onChange={onChange} />
      <Dropdown name="process_related" label="Process Related" options={yesNo} values={values} onChange={onChange} />
    </div></section>
    <section className="panel"><h2>CAPA</h2><div className="two-cols">
      <div className="field-stack">
        <Dropdown name="corrections_or_interim_controls_required" label="Corrections or Interim Controls Required" options={yesNo} values={values} onChange={onChange} />
        <TextArea name="capa_plan_rationale" label="CAPA Plan Rationale" values={values} onChange={onChange} />
        <Dropdown name="effectiveness_check_required" label="Effectiveness Check Required" options={yesNo} values={values} onChange={onChange} />
      </div><div className="field-stack">
        <Dropdown name="capa_plan_required" label="CAPA Plan Required" options={yesNo} values={values} onChange={onChange} />
        <Dropdown name="existing_related_capa_plan_applicable" label="Existing Related CAPA Plan Applicable" options={yesNo} values={values} onChange={onChange} />
      </div>
    </div></section>
    <section className="panel"><h2>Trend Section</h2><div className="two-cols">
      <Dropdown name="lot_specific_trend_identified" label="Lot-Specific Trend Identified" options={yesNo} values={values} onChange={onChange} />
      <TextArea name="lot_trend_assessment_and_rationale" label="Lot Trend Assessment and Rationale" values={values} onChange={onChange} />
    </div></section>
    <section className="panel conclusion-panel"><h2>AI Drafted Conclusion</h2>
      <div className="conclusion-subtitle">{language ? `Detected language: ${language}` : 'Review extracted conclusions before submission'}</div>
      <div className="two-cols">
        <TextArea name="current_conclusion" label={`Current Conclusion${language ? ` (${language})` : ''}`} values={values} onChange={onChange} />
        <TextArea name="translated_conclusion_english" label="Translated Conclusion (English)" values={values} onChange={onChange} />
      </div>
      <div className="review-warning">Human review required before submission</div>
      <div className="submit-footer"><Button variant="contained" disabled title="Veeva API endpoint is not configured">Submit to Veeva</Button></div>
    </section>
  </>;
}
