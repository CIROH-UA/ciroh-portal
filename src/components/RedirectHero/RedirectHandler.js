import BrowserOnly from '@docusaurus/BrowserOnly';

// delayTime provided in seconds
export default function RedirectHandler({ href, delayTime }) {
  return (
      <BrowserOnly>
        <span>
          <script>
            {setTimeout(() => location.href = href, delayTime * 1000)}
          </script>
        </span>
      </BrowserOnly>
  );
}