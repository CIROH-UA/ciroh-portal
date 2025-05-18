import React, {useMemo} from 'react';
import Select from 'react-select';
import {useColorMode} from '@docusaurus/theme-common'; // docusaurus hook  :contentReference[oaicite:2]{index=2}

/* ---------- collection data ---------- */
const groupedOptions = [
  {
    label: 'CIROH Research',
    options: [{ value: 'R4GGL3GA', label: 'General' }],
  },
  {
    label: 'CIROH Cyberinfrastructure',
    options: [
      { value: 'R4GGL3GA', label: 'General' },
      { value: 'SFJZJXVV', label: 'AWS' },
      { value: 'FBQV7E3E', label: 'GCP and CIROH JupyterHub' },
      { value: 'TP6VCHBW', label: 'Pantarhei' },
      { value: 'GPJZSD3H', label: 'Wukong' },
    ],
  },
];

/* ---------- custom group label ---------- */
const groupStyles  = { display:'flex', alignItems:'center', justifyContent:'space-between' };
const badgeStyles  = { background:'#EBECF0', borderRadius:'2em', fontSize:12, padding:'0 8px' };
const formatGroupLabel = g => (
  <div style={groupStyles}>
    <span>{g.label}</span>
    <span style={badgeStyles}>{g.options.length}</span>
  </div>
);

/* ---------- helper to read a CSS var ---------- */
const varVal = name => getComputedStyle(document.documentElement).getPropertyValue(name);

export default function SelectCollection({ onChange }) {
  const {colorMode} = useColorMode();           // reacts to light/dark toggle

  /* merge the Docusaurus palette into react-select’s theme */
  const theme = useMemo(() => base => ({
    ...base,
    colors: {
      ...base.colors,
      primary:   varVal('--ifm-color-primary'),
    //   primary25: varVal('--ifm-color-primary-lightest'), // hover
    //   primary50: varVal('--ifm-color-primary-lighter'),  // focus
      neutral0:  varVal('--ifm-background-surface-color'),     // control bg
      neutral10: varVal('--ifm-color-emphasis-200'),           // multi chip bg
      neutral20: varVal('--ifm-color-emphasis-300'),           // border
      neutral30: varVal('--ifm-color-emphasis-400'),
    //   neutral80: varVal('--ifm-font-color-base'),              // text
    },
    spacing: { ...base.spacing, controlHeight: 46 },           // matches .input
    borderRadius: 4,
  }), [colorMode]);

  /* fine-grain tweaks for chips, remove icon, etc. */
  const partStyles = useMemo(() => ({
    control:   styles => ({ ...styles, border: `1px solid #ccc` }),
    valueContainer: styles => ({ ...styles, padding: '2px 8px'}),
    multiValue: styles => ({
      ...styles,
    //   backgroundColor: varVal('--ifm-color-primary-lighter'),
    }),
    multiValueLabel: styles => ({
      ...styles,
      color: varVal('--ifm-font-color-base'),
    }),
    multiValueRemove: styles => ({
      ...styles,
      ':hover': {
        // backgroundColor: varVal('--ifm-color-danger'),
        // color:'#fff',
      },
    }),
  }), [colorMode]);

  return (
    <Select
      isMulti
      options={groupedOptions}
      placeholder="Add to collection(s)…"
      formatGroupLabel={formatGroupLabel}
      classNamePrefix="zotero-select"
      menuPortalTarget={document.body}              /* avoids z-index issues */
      theme={theme}
      styles={partStyles}
      onChange={onChange}
    />
  );
}
