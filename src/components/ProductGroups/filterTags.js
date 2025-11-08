
import { MdApps } from 'react-icons/md';
import { 
  SiRust, 
  SiPython, 
  SiKubernetes,
  SiNodered,
  SiLinuxcontainers
} from 'react-icons/si';
import { BsBucketFill } from "react-icons/bs";
import { FaRProject } from "react-icons/fa";

export const TYPE_FILTERS = [
  {
    label: 'Apps',
    values: ['application'],
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
    label: 'Containers',
    values: ['docker container', 'oci image', 'container image'],
    icon: SiLinuxcontainers,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 60%, var(--ifm-color-secondary) 40%)',
  },
  {
    label: 'HPC',
    values: ['hpc', 'high performance computing'],
    icon: SiNodered,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 80%, var(--ifm-color-secondary) 20%)',
  },
  {
    label: 'Datasets',
    values: ['dataset'],
    icon: BsBucketFill,
    color: 'color-mix(in srgb, var(--ifm-color-primary) 50%, var(--ifm-color-secondary) 50%)',
  },


];
