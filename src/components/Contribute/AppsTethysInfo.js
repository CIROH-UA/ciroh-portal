import Appstyles from './AppsStyles.module.css';
import ActionButtons from './ActionButtons';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function AppsTethysInfo() {
  const developUrl = useBaseUrl('/develop');
  const hydroshareUrl = useBaseUrl('/hydroshare');
  return (
    <>
      <hr className={Appstyles.sectionDivider} />

      <div className={Appstyles.headerContainer}>
        <h3 className={Appstyles.description2}>
            <div>
              💧 <strong>Thinking about a Product? </strong> Develop applications using our <a href="https://www.tethysplatform.org/" target="_blank" rel="noopener">Tethys Platform</a> toolkit
            </div>
        </h3>
      </div>

      <ActionButtons
          buttons={[
              { label: "Develop a Product", href: developUrl, primary: true },
              { label: "Getting Started", href: "https://docs.tethysplatform.org/en/stable/index.html" }
            ]}
      />
    </>
  );
}
