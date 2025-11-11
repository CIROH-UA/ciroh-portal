
import { MdApps } from 'react-icons/md';
import { 
  SiRust, 
  SiPython, 
  SiKubernetes,
  SiNodered,
  SiDocker,
  SiFramework
} from 'react-icons/si';
import { BsBucketFill } from "react-icons/bs";
import { FaRProject } from "react-icons/fa";

export const TYPE_FILTERS = [
  {
    label: 'Apps',
    values: ['application','app', 'web app', 'web application', 'desktop app', 'desktop application'],
    icon: MdApps,
    color: 'var(--ifm-color-primary)',
  },
  {
    label: 'Python',
    values: ['python package', 'python library', 'python', 'jupyter notebook', 'notebook', 'jupyter'],
    icon: SiPython,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 70%, var(--ifm-color-secondary))',
  },
  {
    label: 'Rust',
    values: ['rust'],
    icon: SiRust,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 30%, var(--ifm-color-secondary) 70%)',
  },
  {
    label: 'R',
    values: ['r package', 'r library', 'r'],
    icon: FaRProject,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 20%, var(--ifm-color-secondary) 80%)',
  },
  {
    label: 'Kubernetes',
    values: ['kubernetes', 'helm chart'],
    icon: SiKubernetes,  
    color: 'color-mix(in srgb, var(--ifm-color-primary) 40%, var(--ifm-color-secondary) 60%)',
  },
  {
    label: 'Docker',
    values: ['docker', 'oci image', 'container image', 'container'],
    icon: SiDocker ,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 60%, var(--ifm-color-secondary) 40%)',
  },
  {
    label: 'HPC',
    values: ['hpc', 'high performance computing'],
    icon: SiNodered,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 80%, var(--ifm-color-secondary) 20%)',
  },
  {
   label: 'Frameworks',
    values: ['framework', 'Model_Framework', 'modeling framework'],
    icon: SiFramework,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 90%, var(--ifm-color-secondary) 10%)', 
  },
  {
    label: 'Datasets',
    values: ['dataset'],
    icon: BsBucketFill,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 50%, var(--ifm-color-secondary) 50%)',
  },


];
