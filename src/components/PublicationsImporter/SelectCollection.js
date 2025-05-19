import React, {useMemo} from 'react';
import Select from 'react-select';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';

/* ----- data ---------------------------------------------------------- */
const groupedOptions = [
  { label: 'CIROH Research',          options: [{value:'R4GGL3GA', label:'General'}] },
  { label: 'CIROH Cyberinfrastructure', options: [
      {value:'R4GGL3GA', label:'General'},
      {value:'SFJZJXVV', label:'AWS'},
      {value:'FBQV7E3E', label:'GCP and CIROH JupyterHub'},
      {value:'TP6VCHBW', label:'Pantarhei'},
      {value:'GPJZSD3H', label:'Wukong'},
  ]},
];

const Group = ({label, len}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span>{label}</span>
    <span style={{
      background:'#EBECF0',borderRadius:'2em',fontSize:12,padding:'0 8px',
    }}>{len}</span>
  </div>
);

const formatGroupLabel = g => <Group label={g.label} len={g.options.length} />;

/* ---------- browser-only inner component ----------------------------- */
function SelectCollectionInner({onChange}) {
  const {colorMode} = useColorMode();      // just to retrigger memo on theme flip

  /* theme: hand raw CSS-var strings to react-select ------------------- */
  const theme = useMemo(() => base => ({
    ...base,
    colors: {
      ...base.colors,
      primary:   'var(--ifm-color-primary)',
      primary25: 'var(--ifm-color-primary-lightest)',
      primary50: 'var(--ifm-color-primary-lighter)',
      neutral0:  'var(--ifm-background-surface-color)',
      neutral10: 'var(--ifm-color-emphasis-200)',
      neutral20: 'var(--ifm-color-emphasis-300)',
      neutral30: 'var(--ifm-color-emphasis-400)',
      neutral80: 'var(--ifm-font-color-base)',
    },
    spacing: {...base.spacing, controlHeight: 46},
    borderRadius: 4,
  }), [colorMode]);

  /* per-part styles (same trick) -------------------------------------- */
  const styles = useMemo(() => ({
    control:  s => ({...s, border:'1px solid #ccc'}),
    valueContainer: s => ({...s, padding:'2px 8px'}),
    multiValueLabel: s => ({...s, color:'var(--ifm-font-color-base)'}),
    option: (base,state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? 'var(--ifm-color-primary-lightest)'
        : base.backgroundColor,
      color: state.isFocused
        ? 'var(--ifm-color-primary-dark)'
        : base.color,
      ...(state.isSelected && {background:'var(--ifm-color-primary-lighter)'}),
    }),
  }), [colorMode]);

  return (
    <Select
      isMulti
      options={groupedOptions}
      placeholder="Add to collection(s)…"
      formatGroupLabel={formatGroupLabel}
      classNamePrefix="zotero-select"
      /* menuPortalTarget only when DOM exists */
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      theme={theme}
      styles={styles}
      onChange={onChange}
    />
  );
}

/* ---------- export a safe wrapper ------------------------------------ */
export default function SelectCollection(props) {
  return (
    <BrowserOnly>{() => <SelectCollectionInner {...props} />}</BrowserOnly>
  );
}
